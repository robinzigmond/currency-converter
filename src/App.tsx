import { useState } from "react";
import "./App.css";
import Select from "./components/Select";
import SelectOption from "./components/SelectOption";
import NumberInput from "./components/NumberInput";
import useGetCurrencies from "./hooks/useGetCurrencies";
import convertCurrencies from "./utils/convertCurrencies";
import type { CurrencyInfo } from "./utils/getCurrencies";

function App() {
  const [getCurrenciesError, setGetCurrenciesError] = useState(false);
  const [convertCurrenciesError, setConvertCurrenciesError] = useState(false);

  const currencies = useGetCurrencies((err) =>{
    console.log(err);
    setGetCurrenciesError(true);
  });
  const currencyOptions = [
    <SelectOption key="blank" value="blank" text="Please Select" />,
    ...currencies.map(
      ({ name, short_code }) => <SelectOption key={short_code} text={`${short_code} (${name})`} value={short_code} />
    )
  ];

  const [conversionResultMessage, setConversionResultMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [fromCurrency, setFromCurrency] = useState<CurrencyInfo>();
  const [toCurrency, setToCurrency] = useState<CurrencyInfo>();
  const [amountToConvert, setAmountToConvert] = useState("0.00");
  const onConvertButtonClick = async () => {
    setErrorMessage("");
    setConversionResultMessage("");
    if (!fromCurrency) {
      setErrorMessage("Please select a currency to convert from");
      return;
    }
    if (!toCurrency) {
      setErrorMessage("Please select a currency to convert to");
      return;
    }
    try {
      const { from, to, amount, value } = await convertCurrencies(fromCurrency.short_code, toCurrency.short_code, amountToConvert);
      const fromAmountWithSymbol = fromCurrency.symbol_first ? `${fromCurrency.symbol}${amount}` : `${amount}${fromCurrency.symbol}`;
      const toAmountWithSymbol = toCurrency.symbol_first ? `${toCurrency.symbol}${value}` : `${value}${toCurrency.symbol}`;
      setConversionResultMessage(`${fromAmountWithSymbol} (${from}) converts to ${toAmountWithSymbol} (${to})`);
    } catch (e: any) {
      console.log(e.message);
      setConvertCurrenciesError(true);
    }
  };

  const handleCurrencyChange = (type: "from" | "to") => (shortCode: string) => {
    const setCurrency = type === "from" ? setFromCurrency : setToCurrency;
    if (shortCode === "blank") {
      setCurrency(undefined);
      return;
    }
    const currency = currencies.find(curr => curr.short_code === shortCode);
    if (!currency) {
      // shouldn't happen, just throw uncaught error so it's obvious in the console
      throw new Error(`couldn't find currency with short code ${shortCode}`);
    }
    setCurrency(currency);
  };

  return (
    <div className="app">
      <h1>Currency Converter</h1>
      {getCurrenciesError && <div className="error-messsage">There was an error fetching currencies - please try again later</div>}
      <div className="input-section">
        <Select id="currency-from-select" label="Currency From" onChange={handleCurrencyChange("from")}>
          {currencyOptions}
        </Select>
      </div>
      <div className="input-section">
        <NumberInput label="amount" id="amount-input" onChange={setAmountToConvert} />
      </div>
      <div className="input-section">
        <Select id="currency-to-select" label="Currency To" onChange={handleCurrencyChange("to")}>
          {currencyOptions}
        </Select>
        </div>
      <div className="input-section">
        <button onClick={onConvertButtonClick}>convert</button>
      </div>
      <div className="input-section">
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {convertCurrenciesError && <div className="error-message">There was an error doing the currency conversion - please try again later</div>}
        {conversionResultMessage && <div className="result-message">{conversionResultMessage}</div>}
      </div>
    </div>
  );
}

export default App;
