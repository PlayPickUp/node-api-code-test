import sgMail from '@sendgrid/mail';
import moment from 'moment';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import juice from 'juice';

import { getClosingProps } from '../ctx/props';
import { head } from '../emails/PropsDigest/head';
import { footer } from '../emails/PropsDigest/footer';
import PropsDigest from '../emails/PropsDigest';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
sgMail.setApiKey(SENDGRID_API_KEY);

const today = moment().format('ddd, MMM Do');

const generateDailyPropsEmail = async (): Promise<void> => {
  const props = await getClosingProps();

  const body = ReactDOMServer.renderToStaticMarkup(
    <PropsDigest propositions={props || []} />
  );
  const parsedBody = juice(body);

  const html = head + parsedBody + footer;

  const msg = {
    to: 'content@playpickup.com',
    from: 'eric@playpickup.com',
    subject: `Daily Props Digest for ${today}`,
    html,
    text: 'This email can only be viewed in a client that supports HTML. </3',
  };
  try {
    await sgMail.send(msg);
    console.log('Successfully generated and sent props digest!');
  } catch (error) {
    console.error(error);
  }
};

generateDailyPropsEmail();
