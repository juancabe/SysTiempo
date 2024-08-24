import { EspData } from './dataCommon';

export enum MaxTime {
  Day,
  Week,
  Month,
  Year,
  All,
}

export function cropData(
  data: EspData[],
  maxTime: MaxTime,
  lastTime: number,
): EspData[] {
  let dataCopy = [...data];

  switch (maxTime) {
    case MaxTime.Day:
      return dataCopy.filter((d) => d.time > lastTime - 24 * 60 * 60);
    case MaxTime.Week:
      return dataCopy.filter((d) => d.time > lastTime - 7 * 24 * 60 * 60);
    case MaxTime.Month:
      return dataCopy.filter((d) => d.time > lastTime - 30 * 24 * 60 * 60);
    case MaxTime.Year:
      return dataCopy.filter((d) => d.time > lastTime - 365 * 24 * 60 * 60);
    case MaxTime.All:
      return dataCopy;
  }
}

export function smoothData(data: EspData[], maxDataPoints: number): EspData[] {
  if (data.length <= maxDataPoints) {
    return data;
  }

  const interval = Math.ceil(data.length / maxDataPoints);
  const smoothedData: EspData[] = [];

  for (let i = 0; i < data.length; i += interval) {
    const slice = data.slice(i, i + interval);
    const avgTemp =
      slice.reduce((acc, val) => acc + val.temp, 0) / slice.length;
    const avgHumidity =
      slice.reduce((acc, val) => acc + val.hum, 0) / slice.length;
    const avgTime =
      slice.reduce((acc, val) => acc + val.time, 0) / slice.length;
    smoothedData.push({
      index: 0,
      temp: avgTemp,
      hum: avgHumidity,
      time: avgTime,
    });
  }

  return smoothedData;
}
