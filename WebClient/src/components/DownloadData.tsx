import React from 'react';
import { getEspFromLTime } from '../utils/getEsp';

interface DownloadDataProps {
  // define your props here
}

const DownloadData: React.FC<DownloadDataProps> = () => {
  return (
    <div>
      <button>
        <p
          onClick={async () => {
            const data = await getEspFromLTime(0, {
              placeName: 'dentro',
              url: 'http://192.168.1.131',
            });
            console.log(data);
          }}
        >
          Click here to download Data
        </p>
      </button>
    </div>
  );
};

export default DownloadData;
