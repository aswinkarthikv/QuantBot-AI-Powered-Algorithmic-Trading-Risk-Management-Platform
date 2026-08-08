import React, { createContext, useContext, useState } from 'react';

export type Currency = 'USD' | 'INR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  formatAmount: (amountInUSD: number) => string;
  currencySymbol: string;
  exchangeRate: number; // 1 USD = 83.50 INR
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const USD_TO_INR_RATE = 83.50;

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('USD');

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'USD' ? 'INR' : 'USD'));
  };

  const currencySymbol = currency === 'USD' ? '$' : '₹';

  const formatAmount = (amountInUSD: number): string => {
    if (isNaN(amountInUSD) || amountInUSD === null || amountInUSD === undefined) {
      return `${currencySymbol}0.00`;
    }

    const converted = currency === 'USD' ? amountInUSD : amountInUSD * USD_TO_INR_RATE;
    const formatted = converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return `${currencySymbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        formatAmount,
        currencySymbol,
        exchangeRate: currency === 'USD' ? 1 : USD_TO_INR_RATE,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
