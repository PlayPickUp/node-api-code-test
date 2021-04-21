import knex from '../util/db';
import sgMail from '@sendgrid/mail';
import {
    CreatePrizeCodesRequest,
    CreatePrizeCodesResponse,
    CreatePrizeRequest,
    Prize,
    PrizeCode,
    RedeemPrizeCodesRequest,
    RedemptionDateDTO
} from "../models/prizes.model";
import {purchasePrizeForFan} from "./fans.service";
import {Fan} from "../models/fans.model";
import moment from "moment";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';

export const listAllPrizes = async (): Promise<Prize[]> => {
    const prizes = await knex
        .select('*')
        .from('prizes')
        .orderBy('id', 'desc');
    if (!prizes) {
        throw new Error('Could not retrieve prizes from API!');
    }
    if (prizes.name === 'Error') {
        throw new Error(prizes.message);
    }
    return prizes;
};

export const getPrizeById = async (prizeId: number): Promise<Prize> => {
    try {
        return await knex('prizes')
            .select('*')
            .where('id', '=', prizeId)
            .first();
    } catch (err) {
        console.error("Couldn't find prize by ID: " + prizeId);
        throw err;
    }
}

export const getRedemptionDatesForFan = async (fanId: number): Promise<RedemptionDateDTO[]> => {
    try {
        //TODO #863 Convert this whole method into a single DB query, or at least reduce it down from N+1 queries :(
        const prizeIds: Partial<Prize>[] = await knex('prizes')
            .select('id');

        const redemptionDates: RedemptionDateDTO[] = await Promise.all(
            prizeIds.map(async (prizePartial) => {
                if (prizePartial.id) {
                    return {
                        prizeId: prizePartial.id,
                        nextRedemption: await getNextRedemptionDate(fanId, prizePartial.id).then((data: Date) => {
                            return moment(data).toISOString()
                        })
                    }
                } else {
                    throw new Error("Got a prize from the Database with no ID.")
                }
            })
        )
        return redemptionDates
    } catch (err) {
        console.error("Couldn't get redemption dates for fan: " + fanId);
        throw err;
    }
}

export const createNewPrize = async (createPrizeReq: CreatePrizeRequest): Promise<Prize> => {
    const prize = await knex('prizes')
        .insert({
            ...createPrizeReq,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString()
        })
        .catch((err: string) => {
            throw new Error(err);
        });
    if (!prize) {
        throw new Error("Unable to create prize: " + JSON.stringify(createPrizeReq))
    }
    if (prize.name === 'Error') {
        throw new Error(prize.message);
    }
    return prize;
}

export const createNewPrizeCodes = async (createPrizeCodesReq: CreatePrizeCodesRequest): Promise<CreatePrizeCodesResponse>  => {
    const response: CreatePrizeCodesResponse = {
        created: 0,
        failed: []
    }
    await Promise.all(createPrizeCodesReq.codes.map(async (code) => {
        try {
            await knex('prize_codes')
                .insert({
                    code,
                    expiration_date: createPrizeCodesReq.expiration_date,
                    prize_id: createPrizeCodesReq.prize_id,
                    created_at: moment().toISOString(),
                    updated_at: moment().toISOString()
                })
                .returning(['id', 'code'])
                .catch((err: string) => {
                    throw new Error(err);
                });
            response.created++
        } catch (e) {
            response.failed.push(code)
        }
    }))
    return response
}

export const redeemPrizeCodeForFan = async (redeemPrizeCodeRequest: RedeemPrizeCodesRequest): Promise<void> => {
    await validateFanIsEligibleForPrize(redeemPrizeCodeRequest)
    const prizeCode: PrizeCode = await getRedeemablePrizeCode(redeemPrizeCodeRequest.prize_id)
    await assignCodeToFan(prizeCode, redeemPrizeCodeRequest.fan.id)
    const prizeCost: number = await getPrizeById(redeemPrizeCodeRequest.prize_id).then((data: Prize) => {
        return data.points_cost
    })
    try {
        await purchasePrizeForFan({
            fan_id: redeemPrizeCodeRequest.fan.id,
            points_cost: prizeCost
        })
    } catch (e) {
        console.error("failed to purchase prize code for fan")
        await unassignPrizeCode(prizeCode)
        throw e
    }
    await sendPrizeCodeEmail(prizeCode, redeemPrizeCodeRequest.fan)
}

const validateFanIsEligibleForPrize = async (request: RedeemPrizeCodesRequest) => {
    const lastRedemption: Date | null = await getLastRedemptionDate(request.fan.id, request.prize_id)

    if (!lastRedemption) return //First time purchase, no need to validate further

    const prizePeriod = await knex('prizes')
        .where('id', '=', request.prize_id)
        .first()
        .then((data: Prize) => {
            return data.min_days_between_redemptions
        })

    if (prizePeriod === null || prizePeriod < 1) return //No limit on redemptions

    const nextEligibleRedeemDate: Date = await getNextRedemptionDate(request.fan.id, request.prize_id)
    if (nextEligibleRedeemDate.getTime() > Date.now()) {
        throw new Error("Fan is not yet eligible to redeem this prize again")
    }
}

const getNextRedemptionDate = async (fanId: number, prizeId: number): Promise<Date> => {
    const lastRedemption: Date | null = await getLastRedemptionDate(fanId, prizeId)
    if (!lastRedemption) {
        return moment('2020-01-01').toDate() // can redeem immediately; any past date is acceptable
    }


    const prizePeriod: number = await knex('prizes')
        .where('id', '=', prizeId)
        .first()
        .then((data: Prize) => {
            return data.min_days_between_redemptions
        })
    if (!prizePeriod || prizePeriod < 1) {
        return moment('2020-01-01').toDate() // can redeem immediately; any past date is acceptable
    }


    // return new Date(lastRedemption.getTime() + (prizePeriod*24*60*60*1000))
    return moment(lastRedemption).add(prizePeriod, "days").toDate()
}

const getLastRedemptionDate = async (fanId: number, prizeId: number): Promise<Date | null>  => {
    return await knex('prize_codes')
        .select('redeemed_at')
        .where('fan_id','=', fanId)
        .andWhere('prize_id','=',prizeId)
        .orderBy('redeemed_at','desc')
        .limit(1)
        .then((data: Partial<PrizeCode>[]) => {
            if (data.length < 1) {
                return null;
            }
            return data[0].redeemed_at;
        })
}

const assignCodeToFan = async (prizeCode: PrizeCode, fanId: number): Promise<PrizeCode> => {
    const redeemDateString: string = new Date().toISOString()
    return knex('prize_codes')
        .where('id', '=', prizeCode.id)
        .update({
            fan_id: fanId,
            redeemed_at: redeemDateString,
            updated_at: redeemDateString
        })
        .then(async (data: PrizeCode) => {
            if (!data) throw new Error("Unable to assign PrizeCode to Fan")
            return data;
        })
}

const unassignPrizeCode = async (prizeCode: PrizeCode): Promise<PrizeCode> => {
    return await knex('prize_codes')
        .where('id', '=', prizeCode.id)
        .update({
            fan_id: null,
            redeemed_at: null,
            updated_at: new Date().toISOString()
        })
        .then((data: PrizeCode) => {
            if (!data) throw new Error("Unable to un-assign PrizeCode")
            return data;
        })
}

const getRedeemablePrizeCode = async (prizeId: number): Promise<PrizeCode> => {
    const ninetyDaysFromNow: Date = moment().add(90, "days").toDate()
    return await knex('prize_codes')
        .select()
        .whereNull('fan_id')
        .andWhere('prize_id', '=', prizeId)
        .andWhere('expiration_date', '>', ninetyDaysFromNow)
        .first()
        .then(async (data: PrizeCode) => {
            if (!data) throw new Error("No Redeemable prize code available")
            return data;
        })
}

const sendPrizeCodeEmail = async (prizeCode: PrizeCode, fan: Fan) => {
    // TODO https://app.zenhub.com/workspaces/pickup-5ee6cbe39ef1ca001fefe69b/issues/playpickup/pickup-rails/856
    // replace this call to metafloor with our own barcode service
    const imageSource = 'https://bwipjs-api.metafloor.com/?bcid=code128&text=' + prizeCode.code
    const emailBody = `
    <span>Hey ${fan.username}!</span>
    <br/>
    <span>You've successfully redeemed your points for a Free Game of Bowling at Bowlero!</span>
    Show this barcode at any participating Bowlero to get started! 
    
    Thanks for Playing PickUp!
    <br/>
    <div style="background: white">
    <img src=${imageSource} />
    </div>
    <br/>`
    try {
        sgMail.setApiKey(SENDGRID_API_KEY)
        const msg = {
            to: fan.email,
            from: 'marketplace@playpickup.com',
            subject: 'Your Pickup Marketplace Prize From Bowlero Is Here!',
            html: emailBody,
        };
        await sgMail.send(msg)
    } catch (e) {
        console.error("Unable to send Prize Code email: " + e.message)
        throw e
    }
    return
}
