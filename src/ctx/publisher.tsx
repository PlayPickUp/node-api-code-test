import sgMail from '@sendgrid/mail';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import juice from 'juice';
import split from 'lodash/split';
import { PUServerEvents } from '@playpickup/server-events';

import { head } from '../emails/PublisherDemo/head';
import { footer } from '../emails/PublisherDemo/footer';
import PublisherDemo from '../emails/PublisherDemo';

const PUBLISHER_DEMO_SEND_TO = process.env.PUBLISHER_DEMO_SEND_TO;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
sgMail.setApiKey(SENDGRID_API_KEY);

const { NODE_ENV, MIXPANEL_TOKEN } = process.env;
const tracker = new PUServerEvents(MIXPANEL_TOKEN || '', NODE_ENV || '');

export const deliverDemo = async (
  publisherEmail: string | null | undefined
): Promise<{ code: number } | void> => {
  try {
    if (!publisherEmail) {
      new Error('No publisher email provided');
      return { code: 1 };
    }
    const body = ReactDOMServer.renderToStaticMarkup(
      <PublisherDemo publisherEmail={publisherEmail} />
    );
    const parsedBody = juice(body);

    const html = head + parsedBody + footer;

    const to = split(PUBLISHER_DEMO_SEND_TO, ',');
    const subject = `A Publisher Wants a Demo! (${publisherEmail})`;

    const msg = {
      to,
      from: 'eric@playpickup.com',
      subject,
      html,
      text: `${publisherEmail} would like a demo of the PickUp platform, please contact them!`,
    };

    await sgMail.send(msg);
    tracker.captureEvent('publisher_demo_email_sent', null, { to, subject });
    console.log('[Publisher Demo]: Successfully sent request for demo!');
    return { code: 0 };
  } catch (err) {
    tracker.captureEvent('publisher_demo_email_error', null, {
      to: publisherEmail || '',
      err,
    });
    console.error(err);
    return { code: 1 };
  }
};
