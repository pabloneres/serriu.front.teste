import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import { Container } from "./styles";
import { Card, Table, Tooltip, Spin } from "antd";
import { DollarCircleOutlined, RollbackOutlined } from "@ant-design/icons";

import { convertMoney, convertDate, currencyToInt } from "~/modules/Util";
import { index, store, show } from "~/controllers/controller";

import Negociacao from "../negociacao";

function Negociacoes({ negociacoes }) {

  const [negociacao, setNegociacao] = useState();
  const [loading, setLoading] = useState(false);

  const loadNegociacao = id => {
    setLoading(true);
    show(token, "/faturamento", id).then(({ data }) => {
      console.log(data);
      setNegociacao({
        ...data,
        especialidades: data.especialidades
          .map(item => ({
            ...item,
            valorAplicado: 0
          }))
          .filter(item => item.restante !== 0)
      });
    });
  };

  const columns = [
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
      title: "F. Pagmento",
      dataIndex: "formaPagamento",
      render: data => <span>{data}</span>
    },
    {
      title: "Status",
      dataIndex: "status",
      render: data => <span>{data}</span>
    },
    {
      title: "",
      render: data =>
        data.status !== "pago" ? (
          <Tooltip title="Abrir negociação">
            <DollarCircleOutlined
              onClick={() => loadNegociacao(data.id)}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
        ) : (
          <></>
        )
    }
  ];

  if (negociacao) {
    return (
      <Negociacao
        negociacao={negociacao}
        voltar={() => setNegociacao(undefined)}
      />
    );
  }

  return (
    <Card title="Negociações existentes">
      <Table
        rowKey="id"
        size="small"
        columns={columns}
        dataSource={negociacoes}
        expandable={{
          rowExpandable: record => record.pagamentos.length > 0,
          expandedRowRender: (record, index, indent, expanded) => (
            <Table
              size="small"
              showHeader={false}
              dataSource={record.pagamentos}
              columns={[
                {
                  // title: 'Data',
                  dataIndex: "created_at",
                  render: data => <span>{convertDate(data)}</span>
                },
                {
                  // title: 'Valor',
                  dataIndex: "valor",
                  render: data => <span>{convertMoney(data)}</span>
                },
                {
                  // title: 'Forma de pagamento',
                  dataIndex: "formaPagamento"
                }
              ]}
              pagination={false}
            />
          )
        }}
        pagination={false}
      />
    </Card>
  );
}

export default Negociacoes;
