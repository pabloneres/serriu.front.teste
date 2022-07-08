import React from "react";

import { Input } from './styles'

const currencyConfig = {
  locale: "pt-BR",
  formats: {
    number: {
      BRL: {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    }
  }
};

const BrlCurrencyComponent = (props) => {
  // console.log(props)
  const handleChange = (event, value, maskedValue) => {
    event.preventDefault();
    props.onChange(value);
    // console.log(value); // value without mask (ex: 1234.56)
    // console.log(maskedValue); // masked value (ex: R$1234,56)
  };

  return (
    <Input
      {...props}
      currency="BRL"
      config={currencyConfig}
      onChange={handleChange}
    />
  );
};

export default BrlCurrencyComponent;
