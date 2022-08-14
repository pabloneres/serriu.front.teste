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
  Space,
  Tooltip,
  Statistic
} from "antd";
import { Link } from "react-router-dom";
import { FileTextOutlined, EyeOutlined } from "@ant-design/icons";
import { index, show, update, store } from "~/controllers/controller";
import InputCurrency from "~/utils/Currency";
import Adicionar from "./components/Adicionar";
import Resumo from "./components/Resumo";
import moment from "moment";
import { convertMoney, convertDate } from "~/modules/Util";
import "moment/locale/pt-br";
import locale from "antd/es/date-picker/locale/pt_BR";

import Filters from "~/utils/Filters";

import "./style.css";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
function CaixaPrincipal() {
  const { access_token: token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);

  const [metodosPagamento, setMetodosPagamento] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState();
  const [reload, setRelaod] = useState(false);

  const [mode, setMode] = useState("all");

  const [caixas, setCaixas] = useState([]);

  const [movimentacoes, setMovimentacoes] = useState([]);

  const [resumoMes, setResumoMes] = useState({});

  const [showModalResumo, setShowModalResumo] = useState(false);
  const [movimentacaoSelected, setMovimentacaoSelected] = useState();

  const [showFilter, setShowFilter] = useState(false);
  const [query, setQuery] = React.useState();

  const [filters, setFilters] = useState({
    clinic_id: selectedClinic.id,
    created_at: [null, null],
    caixa: "all"
  });

  useEffect(() => {
    index(token, "metodosPagamento").then(({ data }) => {
      setMetodosPagamento(data);
    });
  }, [token]);

  useEffect(() => {
    index(token, `caixa?clinic_id=${selectedClinic.id}`).then(({ data }) => {
      setCaixas(data);
    });
  }, [selectedClinic.id, token]);

  useEffect(() => {
    index(
      token,
      `caixa_principal?clinic_id=${filters.clinic_id}&tipo=${mode}&${query ? query : ""
      }`
    ).then(({ data }) => {
      setMovimentacoes(data);
    });
  }, [
    filters.caixa,
    filters.clinic_id,
    filters.created_at,
    filters.tipo,
    mode,
    token,
    reload,
    query
  ]);

  useEffect(() => {
    index(token, `caixa_principal/resumo?clinica_id=${selectedClinic.id}`).then(
      ({ data }) => {
        setResumoMes(data);
      }
    );
  }, [selectedClinic.id, token]);

  const firstLetter = e => {
    return e[0].toUpperCase() + e.substr(1);
  };

  const rowClass = e => {
    if (e.status === "divergente" && e.tipo === 1) {
      return "divergente-color";
    }

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
      dataIndex: "created_at",
      render: data => <span>{convertDate(data)}</span>
    },
    // {
    //   title: "Usuário",
    //   dataIndex: ""
    // },
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
      title: "Valor",
      dataIndex: "valor",
      render: data => <span>{convertMoney(data)}</span>
    },
    {
      title: "",
      render: data => {
        if (data.abertura_id && data.tipo === 1) {
          return (
            <Space>
              <Tooltip title="Visualizar">
                <EyeOutlined
                  onClick={() => {
                    setMovimentacaoSelected(data);
                    setShowModalResumo(data.abertura_id);
                  }}
                  style={{ fontSize: 20, cursor: "pointer" }}
                />
              </Tooltip>
            </Space>
          );
        }
      }
    }
  ];

  return (
    <Card
      title={
        <Row>
          <Radio.Group onChange={e => setMode(e.target.value)} value={mode}>
            <Radio.Button value="all">Todos</Radio.Button>
            <Radio.Button value={1}>Entrada</Radio.Button>
            <Radio.Button value={0}>Saída</Radio.Button>
          </Radio.Group>
          <Extra>
            <Filters
              show={showFilter}
              setShow={setShowFilter}
              filter={query}
              setFilter={setQuery}
            />
          </Extra>
        </Row>
      }
      extra={
        <div
          style={{
            display: "flex",
            width: 600,
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
          <Statistic
            valueStyle={{ fontSize: 15 }}
            loading={!resumoMes}
            title="Entrada/Mês"
            value={convertMoney(resumoMes.entrada)}
          />
          <Statistic
            valueStyle={{ fontSize: 15 }}
            loading={!resumoMes}
            title="Saída/Mês"
            value={convertMoney(resumoMes.saida)}
          />
          <Statistic
            valueStyle={{ fontSize: 15 }}
            loading={!resumoMes}
            title="Saldo"
            value={convertMoney(resumoMes.entrada + resumoMes.saida)}
          />
          <Button type="primary" onClick={() => setShowModal(true)}>
            Adicionar
          </Button>
        </div>
      }
    >
      <Adicionar
        show={{ showModal, setShowModal }}
        utils={{ metodosPagamento, reload: () => setRelaod(!reload) }}
      />
      <Resumo
        show={{ showModalResumo, setShowModalResumo, movimentacaoSelected }}
        reload={() => setRelaod(!reload)}
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
  );
}

export default CaixaPrincipal;
