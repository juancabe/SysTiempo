import React, { useState, useEffect } from 'react';
import { getSaveEspData, getLastTime } from '../utils/dbAPI';

interface DownloadDataProps {
  // define your props here
}

const DownloadData: React.FC<DownloadDataProps> = () => {
  const [fueraState, setFueraState] = useState<string>('No data downloaded');
  const [dentroState, setDentroState] = useState<string>('No data downloaded');

  useEffect(() => {
    const fn = async () => {
      let lastTime = await getLastTime('fuera');
      setFueraState(
        ~~((Date.now() - lastTime * 1000) / 1000 / 60) +
          ' minute(s) since last download',
      );
      lastTime = await getLastTime('dentro');
      setDentroState(
        ~~((Date.now() - lastTime * 1000) / 1000 / 60) +
          ' minute(s) since last download',
      );
    };
    fn();
  });

  return (
    <div className="flex flex-col">
      <div className="text-center p-10">
        <div className="flex justify-center p-2">
          <p className="border-b"> Fuera: {fueraState}</p>
        </div>
        <div className="flex justify-center">
          <p className="border-b">Dentro: {dentroState}</p>
        </div>
      </div>
      <div className="flex justify-center">
        <button className="layoutButton">
          <p
            className="text-xl"
            onClick={async () => {
              try {
                setDentroState(await getSaveEspData('dentro'));
              } catch (e) {
                console.error(e);
              }
              try {
                setFueraState(await getSaveEspData('fuera'));
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Click to download Data
          </p>
        </button>
      </div>
    </div>
  );
};

export default DownloadData;
