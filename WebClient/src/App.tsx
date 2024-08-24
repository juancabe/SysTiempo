import { useEffect, useState } from 'react';
import './App.css';
import DownloadData from './components/DownloadData';
import Import from './components/Import';
import Graph from './components/Graph';
import RealTime from './components/RealTime';
import PopupSettings from './components/PopupSettings';

import settingsSvg from './assets/settings.svg';
import xSettingsSvg from './assets/x.svg';
import iconPng from '../src-tauri/icons/32x32.png';

enum ButSel {
  None,
  Import,
  Export,
  Graph,
}

export default function App() {
  const [butSelState, setButSelState] = useState<ButSel>(ButSel.None);
  const [settingsShown, setSettingsShown] = useState<boolean>(false);

  return (
    <>
      <div className="containerLayout p-4">
        <div className="flex justify-between items-center">
          {settingsShown ? <PopupSettings /> : null}
          <div
            className="text-black"
            onClick={() => setSettingsShown(!settingsShown)}
          >
            {settingsShown ? (
              <img src={xSettingsSvg} alt="settings" className={'settingss'} />
            ) : (
              <img src={settingsSvg} alt="settings" className={'settings'} />
            )}
          </div>

          <div className="inner-containerLayout">
            <button
              onClick={() =>
                butSelState !== ButSel.Import
                  ? setButSelState(ButSel.Import)
                  : null
              }
              className={`layoutButton${butSelState === ButSel.Import ? ' selected ' : ' '}
            first-layoutButton`}
            >
              <h1 className="heading">Import</h1>
            </button>
            <button
              onClick={() =>
                butSelState !== ButSel.Export
                  ? setButSelState(ButSel.Export)
                  : null
              }
              className={`layoutButton${butSelState === ButSel.Export ? ' selected ' : ' '}
            middle-layoutButton`}
            >
              <h1 className="heading">Download</h1>
            </button>
            <button
              onClick={() =>
                butSelState !== ButSel.Graph
                  ? setButSelState(ButSel.Graph)
                  : null
              }
              className={`layoutButton${butSelState === ButSel.Graph ? ' selected ' : ' '} last-layoutButton`}
            >
              <h1 className="heading">Graph</h1>
            </button>
          </div>
          <img src={iconPng} alt="icon" className="settings" />
        </div>
        <div>
          <RealTime />
        </div>
      </div>
      {butSelState === ButSel.Import ? (
        <Import />
      ) : butSelState === ButSel.Export ? (
        <DownloadData />
      ) : butSelState === ButSel.Graph ? (
        <div className="p-10">
          <Graph />
        </div>
      ) : null}
    </>
  );
}
