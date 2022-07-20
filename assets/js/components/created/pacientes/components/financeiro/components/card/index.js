import React, { useState, useEffect } from "react";

import { Table, Space, Tooltip, Modal, Form, Select, Skeleton } from "antd";
import {
  DeleteOutlined,
  DiffOutlined,
  DollarCircleOutlined,
  FolderOpenOutlined,
  EditOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  BarcodeOutlined,
  ShareAltOutlined,
  PrinterOutlined
} from "@ant-design/icons";

import { useHistory, useRouteMatch } from "react-router-dom";

import { Card, FormRow } from "~/modules/global";
// import { Container } from './styles';
import { convertMoney, upperFirst } from "~/modules/Util";

import { useSelector } from "react-redux";

import { index, show, store } from "~/controllers/controller";

import "../styles.css";

import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");

function CardItem({ data, modal, loading, hascaixa }) {
  const { params } = useRouteMatch();
  const { token } = useSelector(state => state.auth);

  if (!data) {
    return <></>;
  }

  function convertDate(data) {
    return moment(data).format("L") + " - " + moment(data).format("LT");
  }

  const InnerTableTotal = record => {
    return (
      <Table
        dataSource={record.pagamentos}
        columns={columnsTotalInner}
        pagination={false}
      />
    );
  };

  const columnsTotal = [
    {
      title: "Orçamento",
      dataIndex: "id"
    },
    {
      title: "Criado em",
      dataIndex: "created_at",
      render: data => <span>{convertDate(data)}</span>
    },
    {
      title: "Total orçamento",
      dataIndex: "valor",
      render: data => <span>{convertMoney(data)}</span>
    },
    {
      title: "Total com desconto",
      dataIndex: "valorDesconto",
      render: data => <span>{convertMoney(data)}</span>
    },
    {
      title: "Total pago",
      render: data => (
        <span>
          {convertMoney(
            data.procedimentos.reduce((a, b) => a + Number(b.desconto), 0) -
              Number(data.restante)
          )}
        </span>
      )
    },
    {
      title: "Total a receber",
      dataIndex: "restante",
      render: data => <span>{convertMoney(data)}</span>
    },
    {
      title: "Retido Lab",
      dataIndex: "lab",
      render: data => <span>{convertMoney(data)}</span>
    },
    {
      title: "Ações",
      key: "acoes",
      render: data => (
        <Space size="middle">
          {data.status !== "pago" && hascaixa ? (
            <Tooltip placement="top" title="Definir pagamento">
              <span
                onClick={() => {
                  modal(data.id);
                }}
                style={{ cursor: "pointer" }}
                className="svg-icon menu-icon"
              >
                <DollarCircleOutlined />
              </span>
            </Tooltip>
          ) : (
            ""
          )}
        </Space>
      )
    }
  ];

  const columnsTotalInner = [
    {
      title: "Data",
      dataIndex: "created_at",
      render: data => <span>{convertDate(data)}</span>
    },
    {
      title: "Procedimento",
      dataIndex: "procedimento_id",
      render: data => <span>{data ? data : "Pagamento parcial"}</span>
    },
    {
      title: "Especialidade",
      dataIndex: "especialidades",
      render: data => <span>{data ? data.name : "-"}</span>
    },
    // {
    //   title: "Quantidade",
    //   dataIndex: "data_aprovacao",
    //   render: (data) => <span>{convertDate(data)}</span>,
    //   key: "data_aprovacao",
    // },
    {
      title: "Total da especialidade",
      dataIndex: "valor",
      render: data => <span>{convertMoney(data)}</span>
    },
    {
      title: "Valor pago",
      // dataIndex: 'valorAplicado',
      render: data => (
        <span>
          {convertMoney(data.valorAplicado)} ({data.formaPagamento}){" "}
        </span>
      )
    },
    {
      title: "Total a receber",
      render: data => <span>{convertMoney(data.restanteOrcamento)}</span>
    }
  ];

  return (
    <Card>
      <Table
        size="small"
        rowKey="id"
        pagination={false}
        columns={columnsTotal}
        dataSource={[data]}
        expandable={{
          rowExpandable: record => record.pagamentos.length > 0,
          expandedRowRender: (record, index, indent, expanded) =>
            InnerTableTotal(record, index, indent, expanded)
        }}
        loading={loading}
      />
    </Card>
  );
}

export default CardItem;
