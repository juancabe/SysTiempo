import { useState, useEffect } from 'react';
import {
  getURLFromPlaceName,
  setURLForPlaceName,
  startDB,
} from '../utils/dbAPI';
import { getEspURLFromPlaceName } from '../utils/getEsp';
import './popupSettings.css';
import loaderSvg from '../assets/loader.svg';
import searchSvg from '../assets/search.svg';

// Component that should act as a popup, its position should be absolute
// will ask for the URLs and show the saved ones if any

export default function PopupSettings() {
  const [fueraUrl, setFueraUrl] = useState<null | string>(null);
  const [dentroUrl, setDentroUrl] = useState<null | string>(null);
  const [loaderState, setLoaderState] = useState<string>('');
  const [urlsLookedUp, setUrlsLookedUp] = useState<number>(0);

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
      <div className="setURL-container">
        <h1 className="urlHeader">Automatic URL</h1>
        <div>
          <button
            className="lookupButton"
            onClick={async () => {
              setLoaderState('loading');
              const res = await getEspURLFromPlaceName(
                ['fuera', 'dentro'],
                setUrlsLookedUp,
              );
              setUrlsLookedUp(0);
              if (res[0] !== null) {
                setFueraUrl(res[0]);
                setURLForPlaceName({ placeName: 'fuera', url: res[0] });
              }
              if (res[1] !== null) {
                setDentroUrl(res[1]);
                setURLForPlaceName({ placeName: 'dentro', url: res[1] });
              }
              setLoaderState('loaded');
            }}
          >
            <div className="setUrl">
              <img
                className={'loader ' + loaderState}
                src={loaderState === 'loading' ? loaderSvg : searchSvg}
              ></img>
            </div>
          </button>
          {loaderState === 'loading' ? (
            <p className="loadingText">
              {`Looking up URLs ${urlsLookedUp}/256`}
            </p>
          ) : null}
        </div>
      </div>
      <div className="setUrl">
        <div className="flex">
          <h2 className="inputTitle">Fuera</h2>
        </div>
        <div className="urlInputContainer">
          <input
            className="urlInput"
            type="url"
            onChange={(e) => setFueraUrl(e.target.value)}
            placeholder={fueraUrl ?? 'No URL saved'}
          />
          <button
            className="urlInputButton"
            onClick={() => {
              if (fueraUrl) {
                setURLForPlaceName({ placeName: 'fuera', url: fueraUrl });
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
      <div className="setUrl">
        <div className="flex">
          <h2 className="inputTitle">Dentro</h2>
        </div>
        <div className="urlInputContainer">
          <input
            className="urlInput"
            type="url"
            onChange={(e) => setDentroUrl(e.target.value)}
            placeholder={dentroUrl ?? 'No URL saved'}
          />
          <button
            className="urlInputButton"
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
    </div>
  );
}
