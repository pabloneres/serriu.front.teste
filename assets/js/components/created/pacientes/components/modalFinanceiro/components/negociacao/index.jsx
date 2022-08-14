import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import moment from "moment";

import { Container } from "./styles";
import { Card, Table, Tooltip, Spin, Select, Button, DatePicker } from "antd";
import { DollarCircleOutlined, RollbackOutlined } from "@ant-design/icons";
import local from "antd/es/date-picker/locale/pt_BR";

import { convertMoney, convertDate, currencyToInt } from "~/modules/Util";
import { index, store, show, update } from "~/controllers/controller";

function Negociacao({ negociacao, voltar }) {
  const { selectedClinic } = useSelector(state => state.clinic);

  const [loading, setLoading] = useState(false);

  const [boletoParams, setBoletoParams] = useState({});

  const returnRestante = () => {
    return negociacao.total - negociacao.pago;
  };

  const handleChangeNegociacao = () => {
    update(
      token,
      "/negociacao_boleto/change",
      negociacao.negociacao_boleto.id,
      boletoParams
    )
      .then(_ => {})
      .catch(console.log);
  };

  return (
    <Card
      title={`Negociação Nº ${negociacao.id}`}
      extra={
        <Button type="primary" onClick={() => voltar()}>
          Voltar
        </Button>
      }
    >
      <Table
        size="small"
        rowKey="id"
        columns={[
          {
            title: "Fatura",
            dataIndex: "id"
          },
          {
            title: "Total",
            dataIndex: "total",
            render: data => <span>{convertMoney(data)}</span>
          },
          {
            title: "Pago",
            dataIndex: "pago",
            render: data => <span>{convertMoney(data)}</span>
          },
          {
            title: "Qnt. Procedimentos"
          },
          {
            title: "Restante",
            render: data => <span>{convertMoney(returnRestante())}</span>
          }
        ]}
        dataSource={[negociacao]}
        pagination={false}
      />
      <div>
        <div>
          <span>Parcelas</span>
          <Select
            style={{ width: "100%" }}
            options={[...Array(selectedClinic.config.maxParcelas).keys()].map(
              item => ({
                label:
                  item +
                  1 +
                  "X" +
                  convertMoney(
                    (negociacao.total - negociacao.negociacao_boleto.entrada) /
                      (item + 1)
                  ),
                value: item + 1
              })
            )}
            defaultValue={negociacao.negociacao_boleto.parcelas}
            value={boletoParams.parcelas}
            onChange={e =>
              setBoletoParams({
                ...boletoParams,
                parcelas: e
              })
            }
          />
        </div>

        <div border={0} block>
          <span>Vencimento</span>
          <DatePicker
            disabledDate={data => (data < moment() ? true : false)}
            defaultValue={moment(negociacao.negociacao_boleto.vencimento)}
            value={boletoParams.vencimento}
            locale={local}
            format="DD/MM/YYYY"
            style={{ width: "100%" }}
            onChange={e => {
              setBoletoParams({
                ...boletoParams,
                vencimento: e
              });
            }}
          />
        </div>
        <Button block type="primary" onClick={() => handleChangeNegociacao()}>
          Salvar
        </Button>
      </div>
    </Card>
  );
}

export default Negociacao;
