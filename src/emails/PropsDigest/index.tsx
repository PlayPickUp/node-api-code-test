import React from 'react';
import moment from 'moment';
import { Prop } from '../../types';

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
              {moment(Number(item.close_time)).format(
                'dddd, MMMM Do YYYY, h:mm:ss a'
              )}
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
