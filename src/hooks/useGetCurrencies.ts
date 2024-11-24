import { useEffect, useState } from "react";
import getCurrencies, { type CurrencyInfo } from "../utils/getCurrencies";

function useGetCurrencies(setError: (message: string) => void) {
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>([]);
  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const fetchedCurrencies = await getCurrencies();
        setCurrencies(fetchedCurrencies);
      } catch (e: any) {
        setError(e.message);
      }
    };
    fetchCurrencies();
  }, []);
  return currencies;
};

export default useGetCurrencies;
