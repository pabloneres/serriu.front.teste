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
  Statistic
} from "antd";
import { Link } from "react-router-dom";

import { index, show, update, store } from "~/controllers/controller";
import InputCurrency from "~/utils/Currency";
import Adicionar from "./components/Adicionar";
import moment from "moment";
import { convertMoney, convertDate } from "~/modules/Util";
import "moment/locale/pt-br";
import locale from "antd/es/date-picker/locale/pt_BR";
import "./style.css";
import Filters from "~/utils/Filters";
import { filter } from "lodash";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
function Fluxo() {
  const { token, user } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);

  const [metodosPagamento, setMetodosPagamento] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState();
  const [reload, setRelaod] = useState(false);

  const [mode, setMode] = useState("all");

  const [caixas, setCaixas] = useState([]);

  const [movimentacoes, setMovimentacoes] = useState([]);

  const [hascaixa, setHasCaixa] = useState(true);

  const [defaultCaixa, setDefaultCaixa] = useState(undefined);

  const [resumoPeriodo, setResumoPeriodo] = useState({});

  const [showFilter, setShowFilter] = useState(false);
  const [query, setQuery] = React.useState();

  const [filters, setFilters] = useState({
    clinic_id: selectedClinic.id,
    created_at: [null, null],
    caixa: undefined
  });

  const permission = user.department_id !== "administrador" ? false : true;

  useEffect(() => {
    index(token, "metodosPagamento").then(({ data }) => {
      setMetodosPagamento(data);
    });
  }, [token]);

  useEffect(() => {
    index(token, `caixa?clinic_id=${selectedClinic.id}`).then(({ data }) => {
      setCaixas(data);
      if (!permission) {
        const index = data.findIndex(
          item => item.abertura && item.abertura.user_id === user.id
        );
        if (index !== -1) {
          setDefaultCaixa(data[index].id);
          changeFilter({ caixa: data[index].id });
        }
      } else {
        changeFilter({ caixa: "all" });
      }
    });
  }, [changeFilter, permission, selectedClinic.id, token, user.id]);

  const changeFilter = (data = {}) => {
    setFilters({ ...filters, caixa: data.caixa });
  };

  useEffect(() => {
    let query = {
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD")
    };

    let filter = new URLSearchParams(query).toString();

    setQuery(filter);
  }, []);

  useEffect(() => {
    if (filters.caixa) {
      index(
        token,
        `movimentacoes?clinic_id=${filters.clinic_id}&tipo=${mode}&caixa=${filters.caixa}&${query}`
      ).then(({ data }) => {
        let saida = data
          .filter(item => item.tipo === 0)
          .reduce((a, b) => a + b.valor, 0);
        let entrada = data
          .filter(item => item.tipo === 1)
          .reduce((a, b) => a + b.valor, 0);

        setResumoPeriodo({
          entrada,
          saida,
          saldo: entrada - saida
        });
        setMovimentacoes(data);
      });
    }
  }, [
    filters.caixa,
    filters.clinic_id,
    filters.created_at,
    filters.tipo,
    mode,
    token,
    reload,
    filters.dateFilter,
    filters.startDate,
    filters.endDate,
    query
  ]);

  const firstLetter = e => {
    return e[0].toUpperCase() + e.substr(1);
  };

  const rowClass = e => {
    switch (e.tipo) {
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
      title: "Data",
      dataIndex: "createdDate",
      render: data => <span>{convertDate(data)}</span>
    },
    {
      title: "Caixa",
      dataIndex: "caixa",
      render: data => <span>{data.name}</span>
    },
    {
      title: "Descrição",
      render: data => (
        <span>
          {data.descricao} {data.paciente ? " - Cliente: " : ""}
          {data.paciente ? (
            <Link
              to={"/paciente/editar/" + data.paciente.id + "?tab=orcamentos"}
            >{`${data.paciente.firstName} ${data.paciente.lastName}`}</Link>
          ) : (
            ""
          )}
        </span>
      )
    },
    {
      title: "Forma Pagamento",
      dataIndex: "metodoPagamento",
      render: data => <span>{data ? firstLetter(data) : ""}</span>
    },
    {
      title: "Valor",
      dataIndex: "valor",
      render: data => <span>{convertMoney(data)}</span>
    }
  ];

  useEffect(() => {
    show(token, "caixa/status", selectedClinic.id)
      .then(({ data }) => {
        setHasCaixa(data);
        if (!data) {
          warningModal();
        }
      })
      .catch(() => {});
  }, [selectedClinic.id, token]);

  function warningModal() {
    Modal.warning({
      title: "Atenção",
      content: "Nenhum caixa aberto!"
    });
  }

  return (
    <Card
      title={
        <Row>
          <Button
            type="primary"
            onClick={() => {
              let query = {
                startDate: moment().format("YYYY-MM-DD"),
                endDate: moment().format("YYYY-MM-DD")
              };

              let filter = new URLSearchParams(query).toString();

              setQuery(filter);
            }}
          >
            Hoje
          </Button>
          <Extra>
            <Select
              disabled={!permission}
              placeholder="Filtrar caixas"
              style={{ width: 180, marginRight: 10 }}
              onChange={e => setFilters({ ...filters, caixa: e })}
              value={defaultCaixa || filters.caixa}
              options={[
                {
                  label: "Todos caixas",
                  value: "all"
                },
                ...caixas.map(item => ({
                  label: item.name,
                  value: item.id
                }))
              ]}
            />
            <Filters
              show={showFilter}
              setShow={setShowFilter}
              filter={query}
              setFilter={setQuery}
            />
            <Radio.Group onChange={e => setMode(e.target.value)} value={mode}>
              <Radio.Button value="all">Todos</Radio.Button>
              <Radio.Button value={1}>Entrada</Radio.Button>
              <Radio.Button value={0}>Saída</Radio.Button>
            </Radio.Group>
          </Extra>
          <div
            style={{
              display: "flex",
              width: 400,
              marginRight: 30,
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Statistic
              valueStyle={{ fontSize: 15 }}
              loading={!resumoPeriodo}
              title="Entrada/Mês"
              value={convertMoney(resumoPeriodo.entrada)}
            />
            <Statistic
              valueStyle={{ fontSize: 15 }}
              loading={!resumoPeriodo}
              title="Saída/Mês"
              value={convertMoney(resumoPeriodo.saida)}
            />
            <Statistic
              valueStyle={{ fontSize: 15 }}
              loading={!resumoPeriodo}
              title="Saldo"
              value={convertMoney(resumoPeriodo.saldo)}
            />
          </div>
        </Row>
      }
      extra={
        <Button
          disabled={!hascaixa}
          type="primary"
          onClick={() => setShowModal(true)}
        >
          Adicionar
        </Button>
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
        rowKey="id"
      />
      {/* <Card title="Resumo">
        
      </Card> */}
    </Card>
  );
}

export default Fluxo;
