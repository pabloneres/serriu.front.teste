import React, { useEffect, useState } from "react";

import { Container } from "./styles";
import { useSelector } from "react-redux";
import { Card, Table, Space, Button, Skeleton, Tag } from "antd";
import { index, update } from "~/services/controller";
import { convertMoney } from "~/modules/Util";
import { Notify } from "~/modules/global";

function Analise() {
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);
  const [comissoes, setComissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);

  const firstLetter = e => {
    return e[0].toUpperCase() + e.substr(1);
  };

  const columns = [
    {
      title: "Paciente",
      dataIndex: "paciente",
      render: data => (
        <span>
          {data.firstName} {data.lastName}
        </span>
      )
    },
    {
      title: "Recebimento",
      dataIndex: "negociacao",
      render: data => <span>{firstLetter(data.formaPagamento)}</span>
    },
    {
      title: "Fatura",
      dataIndex: "negociacao_id"
    },
    {
      title: "Orçamento",
      dataIndex: "orcamento_id"
    },
    {
      title: "Total",
      dataIndex: "negociacao",
      render: data => <span>{convertMoney(data.total)}</span>
    }
  ];

  const innerColumns = [
    {
      title: "Data de execução",
      dataIndex: "created_at"
    },
    {
      title: "Profissional",
      render: data => (
        <span>
          {data.dentista.firstName} {data.dentista.lastName}{" "}
          {data.isComissao ? (
            <Tag color="purple">Avaliador</Tag>
          ) : (
            <Tag color="blue">Executor</Tag>
          )}
        </span>
      )
    },
    {
      title: "Procedimento",
      dataIndex: "procedimento_id"
    },
    {
      title: "Paciente",
      dataIndex: "paciente",
      render: data => (
        <span>
          {data.firstName} {data.lastName}
        </span>
      )
    },
    {
      title: "Total (Lab.)",
      render: data => (
        <span>
          {convertMoney(data.total)} ({convertMoney(data.lab)}){" "}
          {data.isBoleto ? <Tag color="purple">Boleto</Tag> : ""}
        </span>
      )
    },
    {
      title: "Valor base",
      render: data => (
        <span>{convertMoney(Number(data.total) - Number(data.lab))}</span>
      )
    },
    {
      title: "Comissão",
      dataIndex: "comissao",
      render: data => <span>{convertMoney(data)}</span>
    },
    // {
    //   title: 'Comissão',
    //   dataIndex: 'isComissao',
    //   render: data => <span>Avaliação</span>
    // },
    {
      title: "Ações",
      render: data => (
        <Space>
          <Button onClick={() => aprovar(data.id, "pendente")} type="primary">
            Aprovar
          </Button>
          <Button onClick={() => aprovar(data.id, "analise")}>Análise</Button>
        </Space>
      )
    }
  ];
  useEffect(() => {
    index("comissoes", {
      clinica_id: selectedClinic.id,
      status: "analise"
    }).then(({ data }) => {
      setComissoes(data);
      setLoading(false);
    });
  }, [reload, selectedClinic.id, token]);

  const aprovar = (id, status) => {
    update("comissoes", id, { status }).then(_ => {
      setReload(!reload);
      return Notify("success", "Sucesso", "A comissão foi para " + status);
    });
  };

  if (loading) {
    return (
      <Card>
        <Skeleton active={true} />
      </Card>
    );
  }

  return (
    <Table
      size="small"
      rowKey="id"
      columns={columns}
      dataSource={comissoes}
      expandable={{
        rowExpandable: record => record.comissoes.length > 0,
        expandedRowRender: (record, index, indent, expanded) => (
          <Table
            rowKey="id"
            size="small"
            columns={innerColumns}
            dataSource={record.comissoes}
            pagination={false}
          />
        )
      }}
    />
  );
}

export default Analise;
