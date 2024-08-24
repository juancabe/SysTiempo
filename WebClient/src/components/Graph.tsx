import React, { useState, useEffect, Component } from 'react';
import { getAllEspData } from '../utils/dbAPI';
import { EspData } from '../utils/dataCommon';
import {
  ChartCanvas,
  Chart,
  LineSeries,
  XAxis,
  YAxis,
  CrossHairCursor,
  withDeviceRatio,
  withSize,
} from 'react-financial-charts';
import { scaleTime, scaleLinear } from 'd3-scale';
import './graph.css';
import { smoothData, cropData, MaxTime } from '../utils/manageEspData';

interface GraphProps {
  // define your props here
}

interface PlaceGraphProps {
  placeName: string;
  maxTime: MaxTime;
  width: number;
  height: number;
  ratio: number;
}

const PlaceGraphComponent: React.FC<PlaceGraphProps> = (props) => {
  const [data, setData] = useState<EspData[]>([]);

  useEffect(() => {
    getAllEspData(props.placeName).then((data) => {
      setData(data);
    });
  }, [props.placeName]);

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  const xAccessor = (d: EspData) => new Date(d.time * 1000);
  const yAccessorTemp = (d: EspData) => d.temp;
  const yAccessorHum = (d: EspData) => d.hum;
  const xExtentss = [xAccessor(data[0]), xAccessor(data[data.length - 1])];

  return (
    <ChartCanvas
      height={props.height}
      width={props.width}
      ratio={props.ratio}
      margin={{ left: 30, right: 30, top: 10, bottom: 30 }}
      data={smoothData(
        cropData(data, props.maxTime, data[data.length - 1].time),
        600,
      )}
      seriesName="Place Data"
      xScale={scaleTime()}
      xAccessor={xAccessor}
      displayXAccessor={xAccessor}
      xExtents={xExtentss}
      clamp="both"
      maintainPointsPerPixelOnResize={false}
    >
      <Chart id={0} yScale={scaleLinear()} yExtents={yAccessorTemp}>
        <XAxis />
        <YAxis axisAt="left" orient="left" ticks={10} />
        <LineSeries yAccessor={yAccessorTemp} strokeStyle="red" />
      </Chart>
      <Chart
        id={1}
        yScale={scaleLinear()}
        yExtents={yAccessorHum}
        origin={() => [0, 0]} // Aligns the second chart on top of the first one
      >
        <YAxis axisAt="right" orient="right" ticks={10} />
        <LineSeries yAccessor={yAccessorHum} strokeStyle="blue" />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

// Wrap PlaceGraphComponent with withSize and withDeviceRatio for responsiveness

class PlaceGraphComponentWrapper extends Component<PlaceGraphProps> {
  render() {
    return <PlaceGraphComponent {...this.props} />;
  }
}

const PlaceGraph = withSize({ style: { minHeight: 300, width: '100%' } })(
  withDeviceRatio()(PlaceGraphComponentWrapper),
);

const Graph: React.FC<GraphProps> = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [placeSelected, setPlaceSelected] = useState<Array<string>>([]);
  const [maxTime, setMaxTime] = useState<MaxTime>(MaxTime.Day);

  useEffect(() => {
    const handleResize = () => {
      if (windowSize)
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="graph-container">
      <div className="inner-containerLayout">
        <button
          className={
            'layoutButton' +
            (placeSelected.includes('fuera') ? ' selected' : '')
          }
          onClick={() => {
            if (placeSelected.includes('fuera')) {
              setPlaceSelected(placeSelected.filter((p) => p !== 'fuera'));
            } else {
              setPlaceSelected([...placeSelected, 'fuera']);
            }
          }}
        >
          <p>Fuera</p>
        </button>
        <button
          className={
            'layoutButton' +
            (placeSelected.includes('dentro') ? ' selected' : '')
          }
          onClick={() => {
            if (placeSelected.includes('dentro')) {
              setPlaceSelected(placeSelected.filter((p) => p !== 'dentro'));
            } else {
              setPlaceSelected([...placeSelected, 'dentro']);
            }
          }}
        >
          <p>Dentro</p>
        </button>
      </div>
      <div className="inner-containerLayout">
        <button
          className={
            'layoutButton' + (maxTime === MaxTime.Day ? ' selected' : '')
          }
          onClick={() => setMaxTime(MaxTime.Day)}
        >
          <p>Day</p>
        </button>
        <button
          className={
            'layoutButton' + (maxTime === MaxTime.Week ? ' selected' : '')
          }
          onClick={() => setMaxTime(MaxTime.Week)}
        >
          <p>Week</p>
        </button>
        <button
          className={
            'layoutButton' + (maxTime === MaxTime.Month ? ' selected' : '')
          }
          onClick={() => setMaxTime(MaxTime.Month)}
        >
          <p>Month</p>
        </button>
        <button
          className={
            'layoutButton' + (maxTime === MaxTime.Year ? ' selected' : '')
          }
          onClick={() => setMaxTime(MaxTime.Year)}
        >
          <p>Year</p>
        </button>
        <button
          className={
            'layoutButton' + (maxTime === MaxTime.All ? ' selected' : '')
          }
          onClick={() => setMaxTime(MaxTime.All)}
        >
          <p>All</p>
        </button>
      </div>
      {placeSelected.map((placeName) => (
        <>
          <div className="place-header">
            <div className="temperature-label-container">
              <p className="temperature-label">Temperatura</p>
            </div>
            <p className="place-name">{placeName.toLocaleUpperCase()}</p>
            <div className="humidity-label-container">
              <p className="humidity-label">Humedad</p>
            </div>
          </div>
          <div className="place-graph-container">
            <PlaceGraph placeName={placeName} maxTime={maxTime} />
          </div>
        </>
      ))}
    </div>
  );
};

export default Graph;
