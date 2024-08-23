import React, { useState } from 'react';
import { getSaveEspData } from '../utils/dbAPI';

interface DownloadDataProps {
  // define your props here
}

const DownloadData: React.FC<DownloadDataProps> = () => {
  const [fueraState, setFueraState] = useState<string>('No data downloaded');
  const [dentroState, setDentroState] = useState<string>('No data downloaded');

  return (
    <div className="flex flex-col">
      <div className="text-center p-10">
        <div className="flex justify-center p-2">
          <p className="border-b">Fuera: {fueraState}</p>
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
