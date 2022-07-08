import React, { useState, useEffect } from "react";

import { Row, Container, Header, Extra } from "./styles";
import { useSelector } from "react-redux";
import {
  Table,
  Card,
  Button,
  Modal,
  Input,
  Form,
  Tabs,
  DatePicker,
  Select,
  Radio,
  Statistic,
  Tag,
  Space
} from "antd";
import { useRouteMatch } from "react-router";
import { index, show, update, store } from "~/controllers/controller";
import InputCurrency from "~/utils/Currency";
import Adicionar from "./components/Adicionar";
import moment from "moment";
import { convertMoney, convertDate } from "~/modules/Util";
import "moment/locale/pt-br";
import locale from "antd/es/date-picker/locale/pt_BR";
import "./style.css";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
function Conta() {
  const { params, url } = useRouteMatch();
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);

  const [metodosPagamento, setMetodosPagamento] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState();
  const [reload, setRelaod] = useState(false);

  const [mode, setMode] = useState("all");

  const [caixas, setCaixas] = useState([]);

  const [saldo, setSaldo] = useState();
  const [pendencia, setPendencia] = useState();

  const [movimentacoes, setMovimentacoes] = useState([]);

  const [modalSaque, setModalSaque] = useState(false);
  const [valorSaque, setValorSaque] = useState();

  const [filters, setFilters] = useState({
    dentista_id: params.id,
    created_at: "",
    tipo: "all"
  });

  useEffect(() => {
    index(
      token,
      `financeiro_dentista?dentista_id=${filters.dentista_id}&tipo=${filters.tipo}&created_at=${filters.created_at}`
    ).then(({ data }) => {
      setMovimentacoes(data);

      let saldo = data.reduce((a, b) => {
        if (b.tipo === 1) {
          return a + b.valor;
        }
        if (b.tipo === 0) {
          return a - b.valor;
        }
      }, 0);

      let pendencia = data
        .filter(a => a.tipo === 2)
        .reduce((a, b) => a + b.valor, 0);
      setPendencia(pendencia);

      setSaldo(saldo);
    });
  }, [
    filters.created_at,
    filters.dentista_id,
    filters.tipo,
    selectedClinic.id,
    token,
    reload
  ]);

  const firstLetter = e => {
    return e[0].toUpperCase() + e.substr(1);
  };

  const rowClass = e => {
    switch (e.tipo) {
      case 2:
        return "pendente-color";
      case 1:
        return "entrada-color";
      case 0:
        return "saida-color";
      default:
        break;
    }
  };

  const columns = [
    {
      title: "Data de execução",
      dataIndex: "created_at"
    },
    {
      title: "Profissional",
      render: data => (
        <span>
          {data.dentista.firstName} {data.dentista.lastName}{" "}
          {/* {data.isComissao ? (
            <Tag color="purple">Avaliador</Tag>
          ) : (
            <Tag color="blue">Executor</Tag>
          )} */}
        </span>
      )
    },
    {
      title: "Comissão ID",
      dataIndex: "comissao_id"
    },
    {
      title: "Paciente",
      dataIndex: "comissao",
      render: data => (
        <span>
          {data && data.paciente
            ? data.paciente.firstName + " " + data.paciente.lastName
            : "-"}
        </span>
      )
    },
    {
      title: "Descrição",
      dataIndex: "descricao"
    },
    {
      title: "Valor base",
      dataIndex: "comissao",
      render: data => {
        if (data) {
          return (
            <span>{convertMoney(Number(data.total) - Number(data.lab))}</span>
          );
        }
      }
    },
    {
      title: "Comissão",
      dataIndex: "valor",
      render: data => <span>{convertMoney(data)}</span>
    }
  ];

  const handleSaque = _ => {
    store(token, "solicitacoes_saque", {
      dentista_id: params.id,
      valor: valorSaque,
      data: moment(),
      clinic_id: selectedClinic.id
    }).then(({ data }) => {
      setRelaod(!reload);
      setModalSaque(false);
    });
  };

  return (
    <>
      <Modal
        title="Solicitar saque"
        visible={modalSaque}
        onCancel={() => setModalSaque(false)}
        onOk={handleSaque}
        okText="Solicitar"
        cancelText="Cancelar"
      >
        <InputCurrency
          onChange={setValorSaque}
          value={valorSaque}
          max={saldo}
        />
      </Modal>
      <Card
        title={
          <Row>
            <Radio.Group onChange={e => setMode(e.target.value)} value={mode}>
              <Radio.Button value="all">Todos</Radio.Button>
              <Radio.Button value={1}>Entrada</Radio.Button>
              <Radio.Button value={0}>Saída</Radio.Button>
            </Radio.Group>
            <Extra></Extra>
          </Row>
        }
        extra={
          <Row
            style={{
              width: 500,
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div className="legends">
              <div className="row-legend">
                <div className="legend-color entrada-color"></div>
                <span>Crédito</span>
              </div>
              <div className="row-legend ">
                <div className="legend-color saida-color"></div>
                <span>Débito</span>
              </div>
              <div className="row-legend ">
                <div className="legend-color pendente-color"></div>
                <span>Análise</span>
              </div>
            </div>
            <Statistic title="Em análise" value={convertMoney(pendencia)} />
            <Statistic title="Saldo" value={convertMoney(saldo)} />
            <Button
              onClick={() => setModalSaque(true)}
              type="primary"
              disabled={saldo <= 0}
            >
              Solicitar Saque
            </Button>
          </Row>
        }
      >
        <Adicionar
          show={{ showModal, setShowModal }}
          utils={{ metodosPagamento, reload: () => setRelaod(!reload) }}
        />
        <Table
          columns={columns}
          dataSource={movimentacoes}
          size="small"
          rowClassName={rowClass}
        />
        {/* <Card title="Resumo">
        
      </Card> */}
      </Card>
    </>
  );
}

export default Conta;
