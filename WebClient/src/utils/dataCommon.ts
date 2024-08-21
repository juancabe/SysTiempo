export interface EspData {
  index: number;
  temp: number;
  hum: number;
  time: number;
}

export function isEspData(data: any): data is EspData {
  return (
    typeof data === 'object' &&
    typeof data.index === 'number' &&
    typeof data.temp === 'number' &&
    typeof data.hum === 'number' &&
    typeof data.time === 'number'
  );
}

export interface EspFile {
  fuera: EspData[];
  dentro: EspData[];
}

export function isEspFile(data: any): data is EspFile {
  return (
    typeof data === 'object' &&
    Array.isArray(data.fuera) &&
    Array.isArray(data.dentro) &&
    data.fuera.every(isEspData) &&
    data.dentro.every(isEspData)
  );
}
