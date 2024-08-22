import React, { useEffect, useState } from 'react';
import { getEspRealTime } from '../utils/getEspRealTime';
import { startDB, getURLFromPlaceName } from '../utils/dbAPI';
import './realTime.css';

interface RealTimeProps {
  // props here
}

interface RealTimeState {
  temp: string;
  humidity: string;
}

async function placeRealTime(url: string): Promise<RealTimeState | null> {
  let realTimeWeather = null;

  await getEspRealTime(url).then((data) => {
    if (!data || data.length !== 2) return null;
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

  const [urlFuera, setUrlFuera] = useState<string | null>(null);
  const [urlDentro, setUrlDentro] = useState<string | null>(null);

  const reloadURL = async (placeName: string) => {
    if (placeName === 'fuera') {
      setUrlFuera(await getURLFromPlaceName('fuera'));
    } else {
      setUrlDentro(await getURLFromPlaceName('dentro'));
    }
  };

  useEffect(() => {
    startDB();
  }, []);

  useEffect(() => {
    reloadURL('fuera');
    reloadURL('dentro');
  }, []);

  useEffect(() => {
    const fetchData = () => {
      if (!urlFuera) return;
      placeRealTime(urlFuera).then((data) => {
        if (!data) {
          setRealTimeFuera(null);
          reloadURL('fuera');
          return;
        }
        setRealTimeFuera(data);
      });
    };
    fetchData(); // Fetch initially
    const intervalId = setInterval(fetchData, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [urlFuera]);

  useEffect(() => {
    const fetchData = () => {
      if (!urlDentro) return;
      placeRealTime(urlDentro).then((data) => {
        if (!data) {
          setRealTimeDentro(null);
          reloadURL('dentro');
          return;
        }
        setRealTimeDentro(data);
      });
    };

    fetchData(); // Fetch initially
    const intervalId = setInterval(fetchData, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [urlDentro]);

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
