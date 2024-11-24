import "@testing-library/jest-dom";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import getCurrencies from "./utils/getCurrencies";
import convertCurrencies from "./utils/convertCurrencies";

// mock API responses for testing
const mockCurrencies = [
  {
    short_code: "ABC",
    name: "abc currency",
    symbol: "!",
    symbol_first: true,
  },
  {
    short_code: "XYZ",
    name: "xyz currency",
    symbol: "*",
    symbol_first: false,
  }
];

const mockConversion = {
  from: "ABC",
  to: "XYZ",
  amount: "10.00",
  value: "9.987",
};

jest.mock("./utils/getCurrencies");
(getCurrencies as jest.MockedFunction<typeof getCurrencies>).mockImplementation(() => {
  return Promise.resolve(mockCurrencies);
});
jest.mock("./utils/convertCurrencies");
(convertCurrencies as jest.MockedFunction<typeof convertCurrencies>).mockImplementation(() => {
  return Promise.resolve(mockConversion);
});

// need a custom render function to wait for the Select options to be populated, to avoid
// "act" warnings in the tests

async function renderApp() {
  render(<App />);
  await waitFor(async () => {
    expect((await screen.findAllByRole("option")).length).toBeGreaterThan(0);
  });
};

test("there is an h1 heading of 'Currency Converter'", async () => {
  await renderApp();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Currency Converter");
});

test("there is a 'Currency From' select", async () => {
  await renderApp();
  expect(screen.getByRole("combobox", { name: "Currency From" })).toBeInTheDocument();
});

test("there is an 'amount' input", async () => {
  await renderApp();
  const amountInput = screen.getByRole("textbox", { name: "amount" });
  expect(amountInput).toBeInTheDocument();
  expect(amountInput).toHaveAttribute("inputMode", "decimal");
});

test("there is a 'Currency To' select", async () => {
  await renderApp();
  expect(screen.getByRole("combobox", { name: "Currency To" })).toBeInTheDocument();
});

test("there is a 'convert' button", async () => {
  await renderApp();
  expect(screen.getByRole("button", { name: "convert"})).toBeInTheDocument();
});

test("both currency inputs are populated with a blank option, and formatted currencies from the API", async () => {
  await renderApp();

  const currencyFromOptions = within(screen.getByRole("combobox", { name: "Currency From" })).getAllByRole("option");
  expect(currencyFromOptions[0]).toHaveAttribute("value", "blank");
  expect(currencyFromOptions[0]).toHaveTextContent("Please Select");
  expect(currencyFromOptions[1]).toHaveAttribute("value", "ABC");
  expect(currencyFromOptions[1]).toHaveTextContent("abc currency");
  expect(currencyFromOptions[2]).toHaveAttribute("value", "XYZ");
  expect(currencyFromOptions[2]).toHaveTextContent("xyz currency");

  const currencyToOptions = within(screen.getByRole("combobox", { name: "Currency To" })).getAllByRole("option");
  expect(currencyToOptions[0]).toHaveAttribute("value", "blank");
  expect(currencyToOptions[0]).toHaveTextContent("Please Select");
  expect(currencyToOptions[1]).toHaveAttribute("value", "ABC");
  expect(currencyToOptions[1]).toHaveTextContent("abc currency");
  expect(currencyToOptions[2]).toHaveAttribute("value", "XYZ");
  expect(currencyToOptions[2]).toHaveTextContent("xyz currency");
});

test("pressing the 'convert' button without a 'from' currency selected results in an error message", async () => {
  const user = userEvent.setup();
  await renderApp();

  await user.click(screen.getByRole("button", { name: "convert" }));
  const expectedMessage = "Please select a currency to convert from";
  expect(await screen.findByText(expectedMessage)).toBeInTheDocument;
});

test("pressing the 'convert' button without a 'to' currency selected results in an error message", async () => {
  const user = userEvent.setup();
  await renderApp();

  await user.selectOptions(screen.getByRole("combobox", { name: "Currency From"}), ["ABC"]);

  await user.click(screen.getByRole("button", { name: "convert" }));
  const expectedMessage = "Please select a currency to convert to";
  expect(await screen.findByText(expectedMessage)).toBeInTheDocument;
});

test("pressing the 'convert' button with both currencies selected provides the correct result from the API", async () => {
  const user = userEvent.setup();
  await renderApp();

  await user.selectOptions(screen.getByRole("combobox", { name: "Currency From"}), ["ABC"]);
  await user.selectOptions(screen.getByRole("combobox", { name: "Currency To"}), ["XYZ"]);

  await user.click(screen.getByRole("button", { name: "convert" }));
  const expectedMessage = "!10.00 (ABC) converts to 9.987* (XYZ)";
  expect(await screen.findByText(expectedMessage)).toBeInTheDocument;
});

test("if there is an error fetching currencies, a generic error message is shown to the user", async () => {
  (getCurrencies as jest.MockedFunction<typeof getCurrencies>).mockImplementationOnce(() => {
    throw new Error("an error occurred");
  });
  await renderApp();

  const expectedErrorMessage = "There was an error fetching currencies - please try again later";
  expect(await screen.findByText(expectedErrorMessage)).toBeInTheDocument();
});

test("if there is an error in the currency conversion request, a generic error message is shown to the user", async () => {
  (convertCurrencies as jest.MockedFunction<typeof convertCurrencies>).mockImplementationOnce(() => {
    throw new Error("an error occurred");
  });
  const user = userEvent.setup();
  await renderApp();

  await user.selectOptions(screen.getByRole("combobox", { name: "Currency From"}), ["ABC"]);
  await user.selectOptions(screen.getByRole("combobox", { name: "Currency To"}), ["XYZ"]);

  await user.click(screen.getByRole("button", { name: "convert" }));
  const expectedErrorMessage = "There was an error doing the currency conversion - please try again later";
  expect(await screen.findByText(expectedErrorMessage)).toBeInTheDocument();
});
