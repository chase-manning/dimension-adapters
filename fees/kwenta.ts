import { Chain } from "@defillama/sdk/build/general"
import { CHAIN } from "../helpers/chains";
import { FetchResultFees, SimpleAdapter } from "../adapters/types";
import fetchURL from "../utils/fetchURL";
import { getTimestampAtStartOfDayUTC } from "../utils/date";

interface IData {
  timestamp: number;
  feesKwenta: number;
}
const url = 'https://storage.kwenta.io/25710180-23d8-43f4-b0c9-5b7f55f63165-bucket/data/stats/daily_stats.json';
const fetchData = (_: Chain) => {
  return async (timestamp: number): Promise<FetchResultFees> => {
    const todaysTimestamp = getTimestampAtStartOfDayUTC(timestamp)
    const value: IData[] = (await fetchURL(url)).data;
    const dailyFee = value.find((d) => d.timestamp === todaysTimestamp)?.feesKwenta;
    const totalFees  = value.filter((e: IData) => e.timestamp <= todaysTimestamp)
      .reduce((acc: number, e: IData) => acc + e.feesKwenta, 0)
    return {
      dailyFees: dailyFee ? `${dailyFee}` : undefined,
      totalFees: totalFees ? `${totalFees}` : undefined,
      timestamp: todaysTimestamp
    }
  }
}

const adapter: SimpleAdapter = {
  adapter: {
    [CHAIN.OPTIMISM]: {
      fetch: fetchData(CHAIN.OPTIMISM),
      start: async () => 1682121600,
    },
  }
};

export default adapter;