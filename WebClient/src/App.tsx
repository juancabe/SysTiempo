import React, { useState } from 'react';
import './App.css';
import Export from './components/Export';
import Import from './components/Import';
import Graph from './components/Graph';

enum ButSel {
  None,
  Import,
  Export,
  Graph,
}

export default function App() {
  const [butSelState, setButSelState] = useState<ButSel>(ButSel.None);
  return (
    <>
      <div className="containerLayout">
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
            <h1 className="heading">Export</h1>
          </button>
          <button
            onClick={() =>
              butSelState !== ButSel.Graph ? setButSelState(ButSel.Graph) : null
            }
            className={`layoutButton${butSelState === ButSel.Graph ? ' selected ' : ' '} last-layoutButton`}
          >
            <h1 className="heading">Graph</h1>
          </button>
        </div>
      </div>
      {butSelState === ButSel.Import ? (
        <Import />
      ) : butSelState === ButSel.Export ? (
        <Export />
      ) : butSelState === ButSel.Graph ? (
        <Graph />
      ) : null}
    </>
  );
}
