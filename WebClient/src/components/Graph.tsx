import React, { useState, useEffect } from 'react';
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

interface GraphProps {
  // define your props here
}

interface PlaceGraphProps {
  placeName: string;
  width: number;
  height: number;
  ratio: number;
}

enum timePrecision {
  MINUTE,
  HOUR,
  DAY,
  MONTH,
  YEAR,
}

function formatTime(time: number, prec: timePrecision): string {
  const date = new Date(time * 1000);
  const hours: string = date.getHours().toString().padStart(2, '0');
  const minutes: number = date.getMinutes();
  const day: string = date.getDate().toString().padStart(2, '0');
  const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
  const year: number = date.getFullYear() % 2000;

  switch (prec) {
    case timePrecision.MINUTE:
      return `${minutes.toString().padStart(2, '0')}`;
    case timePrecision.HOUR:
      return `${hours}:${minutes.toString().padStart(2, '0')}`;
    case timePrecision.DAY:
      return `${hours}:${(~~(minutes / 10) * 10).toString().padStart(2, '0')} ${day}/${month}`;
    case timePrecision.MONTH:
      return `${day} ${month}/${year}}`;
    case timePrecision.YEAR:
      return `${month}/${year}`;
  }
}

const PlaceGraphComponent: React.FC<PlaceGraphProps> = (props) => {
  const [data, setData] = useState<EspData[]>([]);

  useEffect(() => {
    getAllEspData(props.placeName).then((data) => {
      console.log(
        `Adding ${data.length} data points, a random one is ${data[Math.floor(Math.random() * data.length)].temp}`,
      );
      setData(data);
    });
  }, [props.placeName]);

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  const xAccessor = (d: EspData) => new Date(d.time * 1000);
  const yAccessorTemp = (d: EspData) => d.temp;
  const yAccessorHum = (d: EspData) => d.hum;

  return (
    <ChartCanvas
      height={props.height}
      width={props.width}
      ratio={props.ratio}
      margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
      data={data}
      seriesName="Place Data"
      xScale={scaleTime()}
      xAccessor={xAccessor}
      displayXAccessor={xAccessor}
    >
      <Chart id={0} yScale={scaleLinear()} yExtents={yAccessorTemp}>
        <XAxis />
        <YAxis axisAt="left" orient="left" />
        <LineSeries yAccessor={yAccessorTemp} strokeStyle="red" />
      </Chart>
      <Chart
        id={1}
        yScale={scaleLinear()}
        yExtents={yAccessorHum}
        origin={(w, h) => [0, 0]} // Aligns the second chart on top of the first one
      >
        <YAxis axisAt="right" orient="right" />
        <LineSeries yAccessor={yAccessorHum} strokeStyle="blue" />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

// Wrap PlaceGraphComponent with withSize and withDeviceRatio for responsiveness
const PlaceGraph = withSize({ style: { minHeight: 300, maxWidth: 500 } })(
  withDeviceRatio()(PlaceGraphComponent),
);

const Graph: React.FC<GraphProps> = (props) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const placeNames = ['fuera', 'dentro'];

  return (
    <div className="text-center flex flex-col mx-5 max-w-100">
      <h1 className="text-3xl pb-6">Graph</h1>
      {/* map for each placeName */}
      {placeNames.map((placeName) => (
        <>
          <div className="flex flex-row justify-between pt-6">
            <div className="pl-1 flex flex-col justify-end">
              <p className="bg-[#ff3b3b] rounded-t-md text-sm text-[#000000] p-1">
                Temperatura
              </p>
            </div>
            <p className=" p-3 bg-[#c3c3c3] rounded-t-md text-[#000000]">
              {placeName.toLocaleUpperCase()}
            </p>
            <div className="pr-7 flex flex-col justify-end">
              <p className="bg-[#3b5bff] rounded-t-md text-sm text-[#000000] p-1">
                Humedad
              </p>
            </div>
          </div>
          <div className="bg-[#e9e9e9] rounded-md max-w-100">
            <PlaceGraph placeName={placeName} />
          </div>
        </>
      ))}
    </div>
  );
};

export default Graph;
