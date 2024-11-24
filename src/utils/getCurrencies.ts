import { CURRENCIES_ENDPOINT, API_KEY } from "./constants";

const searchParams = new URLSearchParams({ api_key: API_KEY, type: "fiat" });
const endpoint = `${CURRENCIES_ENDPOINT}?${searchParams.toString()}}`;

export interface CurrencyInfo {
  name: string,
  short_code: string,
  symbol: string,
  symbol_first: boolean,
}

async function getCurrencies(): Promise<CurrencyInfo[]> {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return (await response.json()).response.map(
      ({ name, short_code, symbol, symbol_first }: CurrencyInfo) => ({ name, short_code, symbol, symbol_first })
    );
  } catch (error) {
    throw error;
  }
}

export default getCurrencies;
