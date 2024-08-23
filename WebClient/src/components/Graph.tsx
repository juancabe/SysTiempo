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
  HoverTooltip,
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
  const xExtentss = [xAccessor(data[0]), xAccessor(data[data.length - 1])];

  return (
    <ChartCanvas
      height={props.height}
      width={props.width}
      ratio={props.ratio}
      margin={{ left: 30, right: 30, top: 10, bottom: 30 }}
      data={data}
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
        <YAxis axisAt="left" orient="left" />
        <LineSeries yAccessor={yAccessorTemp} strokeStyle="red" />
      </Chart>
      <Chart
        id={1}
        yScale={scaleLinear()}
        yExtents={yAccessorHum}
        origin={() => [0, 0]} // Aligns the second chart on top of the first one
      >
        <YAxis axisAt="right" orient="right" />
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

  const placeNames = ['fuera', 'dentro'];

  return (
    <div className="graph-container">
      <h1 className="graph-title">Graph</h1>
      {placeNames.map((placeName) => (
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
            <PlaceGraph placeName={placeName} />
          </div>
        </>
      ))}
    </div>
  );
};

export default Graph;
