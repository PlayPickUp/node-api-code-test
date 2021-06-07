import sgMail from '@sendgrid/mail';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import juice from 'juice';
import split from 'lodash/split';

import { head } from '../emails/PublisherDemo/head';
import { footer } from '../emails/PublisherDemo/footer';
import PublisherDemo from '../emails/PublisherDemo';

const PUBLISHER_DEMO_SEND_TO = process.env.PUBLISHER_DEMO_SEND_TO;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
sgMail.setApiKey(SENDGRID_API_KEY);

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

    const msg = {
      to,
      from: 'eric@playpickup.com',
      subject: `A Publisher Wants a Demo! (${publisherEmail})`,
      html,
      text: `${publisherEmail} would like a demo of the PickUp platform, please contact them!`,
    };

    await sgMail.send(msg);
    console.log('[Publisher Demo]: Successfully sent request for demo!');
    return { code: 0 };
  } catch (err) {
    console.error(err);
  }
};
