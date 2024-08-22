import React, { useEffect, useState } from 'react';
import { getEspRealTime } from '../utils/getEspRealTime';
import './realTime.css';

interface RealTimeProps {
  // props here
}

interface RealTimeState {
  temp: string;
  humidity: string;
}

async function placeRealTime(placeName: string, url: string) {
  let realTimeWeather = null;

  await getEspRealTime(placeName, url).then((data) => {
    if (!data) return;
    realTimeWeather = {
      temp: data[0],
      humidity: data[1],
    };
  });

  return realTimeWeather;
}

const RealTime: React.FC<RealTimeProps> = (props) => {
  const [realTimeFuera, setRealTimeFuera] = useState<RealTimeState | null>(
    null,
  );
  const [realTimeDentro, setRealTimeDentro] = useState<RealTimeState | null>(
    null,
  );

  useEffect(() => {
    const placeName = 'fuera';
    const url = 'http://192.168.1.132/weather';

    const fetchData = () => {
      placeRealTime(placeName, url).then((data) => {
        if (!data) return;
        setRealTimeFuera(data);
      });
    };

    fetchData(); // Fetch initially
    const intervalId = setInterval(fetchData, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    const placeName = 'dentro';
    const url = 'http://192.168.1.128/weather';

    const fetchData = () => {
      placeRealTime(placeName, url).then((data) => {
        if (!data) return;
        setRealTimeDentro(data);
      });
    };

    fetchData(); // Fetch initially
    const intervalId = setInterval(fetchData, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <div className="realTimeContainer">
      <div className="realTimeCard">
        <p className="realTimeData">
          Fuera:{' '}
          {realTimeFuera ? (
            <span>
              <span className="realTimeTemp">{realTimeFuera.temp + ' C '}</span>
              <span className="realTimeHumidity">
                {realTimeFuera.humidity + ' %'}
              </span>
            </span>
          ) : (
            'Loading...'
          )}
        </p>
        <p className="realTimeData realTimeDivider">
          Dentro:{' '}
          {realTimeDentro ? (
            <span>
              <span className="realTimeTemp">
                {realTimeDentro.temp + ' C '}
              </span>
              <span className="realTimeHumidity">
                {realTimeDentro.humidity + ' %'}
              </span>
            </span>
          ) : (
            'Loading...'
          )}
        </p>
      </div>
    </div>
  );
};

export default RealTime;
