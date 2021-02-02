import React from 'react';
import moment from 'moment-timezone';
import {Prop} from "../../models/prop.interface";

interface PropsDigestProps {
  propositions: Prop[];
}

const PropsDigest: React.FC<PropsDigestProps> = ({ propositions }) => {
  return (
    <div>
      {propositions.length > 0 ? (
        propositions.map((item: Prop) => (
          <div key={item.id}>
            <p>
              <b>{item.id}</b> - {item.proposition} ||{' '}
              {moment(Number(item.close_time), 'X')
                .tz('America/New_York')
                .format('dddd, MMM Do, h:mm a z')}
            </p>
          </div>
        ))
      ) : (
        <p>No upcoming props are closing in the next 48 Hours. 🌴</p>
      )}
    </div>
  );
};

export default PropsDigest;
