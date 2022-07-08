import React, { useEffect, useState } from "react";

import { Container, Extra, Row } from "./styles";
import { useSelector } from "react-redux";
import { Card, Table, Space, Button, Skeleton, Tag, Select, Radio } from "antd";
import { index, show } from "~/services/controller";
import { convertMoney } from "~/modules/Util";

function Comissoes() {
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);
  const [comissoes, setComissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(true);

  const [mode, setMode] = useState(0);

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
          <Button onClick={() => handlePagar(data.id)} type="primary">
            Pagar
          </Button>
        </Space>
      )
    }
  ];

  const handlePagar = id => {
    show("comissoes/pagar", id).then(({ data }) => {
      setReload(!reload);
    });
  };

  useEffect(() => {
    index("comissoes", {
      clinica_id: selectedClinic.id,
      status: "pendente"
    }).then(({ data }) => {
      setComissoes(data);
      setLoading(false);
    });
  }, [reload, selectedClinic.id, token]);

  if (loading) {
    return (
      <Card>
        <Skeleton active={true} />
      </Card>
    );
  }

  return (
    <Card
      title={
        <Row>
          <Radio.Group onChange={e => setMode(e.target.value)} value={mode}>
            <Radio.Button value={0}>A pagar</Radio.Button>
            <Radio.Button value={1}>Pago</Radio.Button>
          </Radio.Group>
          <Extra>
            <Select
              style={{ width: 200, marginRight: 10 }}
              options={[{ label: "Pablo", value: 1 }]}
              placeholder="Filtrar denstista"
            />
          </Extra>
        </Row>
      }
    >
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
    </Card>
  );
}

export default Comissoes;
