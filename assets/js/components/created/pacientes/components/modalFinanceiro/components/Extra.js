import React, { useState } from "react";

// import { Container } from './styles';

import { index, update } from "~/controllers/controller";
import { useSelector } from "react-redux";

import { Select } from "antd";

const Extra = ({ callback, disabled, value }) => {
  const { selectedClinic } = useSelector(state => state.clinic);
  const [condicao, setCondicao] = useState(undefined);

  const returnOptions = () => {
    if (selectedClinic.config.workBoletos) {
      return [
        {
          label: "Total",
          value: "total"
        },
        {
          label: "Boleto",
          value: "boleto"
        }
      ];
    }

    return [
      {
        label: "Total",
        value: "total"
      }
    ];
  };

  return (
    <Select
      style={{ width: "100%" }}
      onChange={e => callback(e)}
      disabled={disabled}
      value={value}
      placeholder="Condição de pagamento..."
      options={returnOptions()}
    />
  );
};

export default Extra;
