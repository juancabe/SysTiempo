import { getClient, ResponseType, Client } from '@tauri-apps/api/http';
import { serverData, EspData } from './dataCommon';

export async function getEspFromLTime(
  lastTime: number,
  serverData: serverData,
): Promise<EspData[] | null> {
  interface IndexTime {
    index: number;
    time: number;
  }

  interface IndexesNTimes {
    first: IndexTime;
    last: IndexTime;
  }

  const client = await getClient();
  let data: EspData[] = [];

  // Verify its the correct server
  try {
    let response = await client.get(serverData.url, {
      timeout: 30,
      responseType: ResponseType.Text,
    });
    if (!(response.data as string).includes(serverData.placeName))
      throw '(d)-Invalid server';
  } catch (e) {
    console.error('[getEspFromTime]EX: ' + e);
    return null;
  }

  let indexesNTImes: IndexesNTimes;
  // Get the indexesNTImes
  try {
    let response = await client.get(serverData.url + '/weatherindexesntimes', {
      timeout: 30,
      responseType: ResponseType.Text,
    });
    indexesNTImes = JSON.parse(response.data as string);
    if (!indexesNTImes) throw '(d)-Invalid indexesNTImes';
  } catch (e) {
    console.error('[getEspFromTime]EX: ' + e);
    return null;
  }

  if (lastTime >= indexesNTImes.last.time) return null;

  // Get vector length

  let vectorLength: number;

  try {
    let response = await client.get(serverData.url + '/weathervectoritems', {
      timeout: 30,
      responseType: ResponseType.Text,
    });
    vectorLength = JSON.parse(response.data as string).dataItems;
    if (vectorLength < 1) throw '(d)-Invalid vectorLength';
  } catch (e) {
    console.error('[getEspFromTime]EX: ' + e);
    return null;
  }

  // Get the index from time
  let lastTimeIndex;

  try {
    let response = await client.get(
      serverData.url + '/indexfromtime?time=' + lastTime,
      {
        timeout: 30,
        responseType: ResponseType.Text,
      },
    );
    lastTimeIndex = JSON.parse(response.data as string).index;
    if (lastTimeIndex === -1) lastTimeIndex = indexesNTImes.first.index - 1;
    else if (!(lastTimeIndex >= 0 && lastTimeIndex < vectorLength))
      throw '(d)-Invalid lastTimeIndex';
  } catch (e) {
    console.error('[getEspFromTime]EX: ' + e);
    return null;
  }

  let index;
  if (lastTimeIndex + 1 >= vectorLength) index = 0;
  else index = lastTimeIndex + 1;

  // Get the data
  if (index > indexesNTImes.last.index) {
    // Circular buffer case
    for (let i = index; i < vectorLength; i++) {
      let espData = await getEspDataFromIndex(i, serverData, client);
      if (espData && espData.time > lastTime) {
        data.push(espData);
      }
    }
    for (let i = 0; i <= indexesNTImes.last.index; i++) {
      let espData = await getEspDataFromIndex(i, serverData, client);
      if (espData && espData.time > lastTime) {
        data.push(espData);
      }
    }
  } else {
    // Normal case
    for (let i = index; i <= indexesNTImes.last.index; i++) {
      let espData = await getEspDataFromIndex(i, serverData, client);
      if (espData && espData.time > lastTime) {
        data.push(espData);
      }
    }
  }

  return data;
}

export async function getEspRealTime(url: string) {
  try {
    const client = await getClient();
    const response = await client.get(url + '/weather', {
      timeout: 30,
      responseType: ResponseType.Text,
    });

    // Assert the type of response.data
    const data = response.data as string;

    // Now it's safe to use split on data
    return data.split(',');
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

async function getEspDataFromIndex(
  index: number,
  serverData: serverData,
  client: Client,
): Promise<EspData | null> {
  try {
    let response = await client.get(
      serverData.url + '/weatherbyindex?index=' + index,
      {
        timeout: 30,
        responseType: ResponseType.Text,
      },
    );
    let data: EspData = JSON.parse(response.data as string);
    if (!data) throw '(d)-Invalid data';
    return data;
  } catch (e) {
    console.error('[getEspFromTime]EX: ' + e);
    return null;
  }
}
