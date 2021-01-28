import React from 'react';

interface PublisherDemoProps {
  publisherEmail: string;
}

const PublisherDemo: React.FC<PublisherDemoProps> = ({ publisherEmail }) => {
  return (
    <div>
      <p>Hey there!</p>
      <p>
        This is a friendly automated message from playpickup.com letting you
        know that <b>{publisherEmail}</b> has requested a demo from the content
        team!
      </p>
      <p>
        <b>Beep Boop,</b>
        <br />
        The PickUp Platform
      </p>
    </div>
  );
};

export default PublisherDemo;
