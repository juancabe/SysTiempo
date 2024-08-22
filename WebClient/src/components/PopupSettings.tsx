import React, { useState, useEffect } from 'react';
import {
  getURLFromPlaceName,
  setURLForPlaceName,
  startDB,
} from '../utils/dbAPI';
import './popupSettings.css';

// Component that should act as a popup, its position should be absolute
// will ask for the URLs and show the saved ones if any

export default function PopupSettings() {
  const [fueraUrl, setFueraUrl] = useState<null | string>(null);
  const [dentroUrl, setDentroUrl] = useState<null | string>(null);

  useEffect(() => {
    startDB();
  }, []);

  useEffect(() => {
    const funct = async () => {
      setFueraUrl(await getURLFromPlaceName('fuera'));
    };
    funct();
  }, []);

  useEffect(() => {
    const funct = async () => {
      setDentroUrl(await getURLFromPlaceName('dentro'));
    };
    funct();
  }, []);

  return (
    <div className="popupSettings">
      <div className="setUrl">
        <h2>Fuera</h2>
        <input
          className="urlInput"
          type="url"
          onChange={(e) => setFueraUrl(e.target.value)}
          placeholder={fueraUrl ?? 'No URL saved'}
        />
        <button
          onClick={() => {
            if (fueraUrl) {
              setURLForPlaceName({ placeName: 'fuera', url: fueraUrl });
            }
          }}
        >
          Save
        </button>
      </div>
      <div className="setUrl">
        <h2>Dentro</h2>
        <input
          className="urlInput"
          type="url"
          onChange={(e) => setDentroUrl(e.target.value)}
          placeholder={dentroUrl ?? 'No URL saved'}
        />
        <button
          onClick={() => {
            if (dentroUrl) {
              setURLForPlaceName({ placeName: 'dentro', url: dentroUrl });
            }
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
