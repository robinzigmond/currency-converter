import { CONVERT_ENDPOINT, API_KEY } from "./constants";

interface ConversionResult {
  from: string,
  to: string,
  amount: string,
  value: string,
};

async function convertCurrencies(fromCurrencyCode: string, toCurrencyCode: string, amount: string): Promise<ConversionResult> {
  try {
    const searchParams = new URLSearchParams({ api_key: API_KEY, from: fromCurrencyCode, to: toCurrencyCode, amount });
    const endpoint = `${CONVERT_ENDPOINT}?${searchParams.toString()}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return (await response.json()).response;
  } catch (error) {
    throw error;
  }
}

export default convertCurrencies;
