import sgMail from '@sendgrid/mail';
import moment from 'moment';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import juice from 'juice';

import {getClosingProps} from '../services/props.service';
import {head} from '../emails/PropsDigest/head';
import {footer} from '../emails/PropsDigest/footer';
import PropsDigest from '../emails/PropsDigest';
import {epochNow, epochNowPlus48} from '../util/epochConverts';

const PROPS_DIGEST_SEND_TO = process.env.PROPS_DIGEST_SEND_TO;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
sgMail.setApiKey(SENDGRID_API_KEY);

const today = moment().format('ddd, MMM Do');

const generateDailyPropsEmail = async (): Promise<void> => {
  try {
    const props = await getClosingProps();

    if (!props) {
      throw new Error('[Daily Props Digest]: No props were returned.');
    }

    // get and log times for props we are checking
    const now = epochNow;
    const cap = epochNowPlus48;
    console.log(
      `[Daily Props Digest]: Capturing closing props between ${now} - ${cap}`
    );

    const body = ReactDOMServer.renderToStaticMarkup(
      <PropsDigest propositions={props || []} />
    );
    const parsedBody = juice(body);

    const html = head + parsedBody + footer;

    const msg = {
      to: PROPS_DIGEST_SEND_TO,
      from: 'eric@playpickup.com',
      subject: `Daily Props Digest for ${today}`,
      html,
      text: 'This email can only be viewed in a client that supports HTML. </3',
    };

    await sgMail.send(msg);
    console.log(
      '[Daily Props Digest]: Successfully generated and sent props digest!'
    );
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

generateDailyPropsEmail();
