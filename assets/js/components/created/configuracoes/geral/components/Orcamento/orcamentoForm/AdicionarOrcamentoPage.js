import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import {
  Table,
  Col,
  Button,
  CardGroup,
  Modal,
  ButtonToolbar,
  ButtonGroup,
  Alert
} from "react-bootstrap";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import "./styles.css";

import { Button as ButtonNew, Radio, Select as SelectNew, Form } from "antd";

import SVG from "react-inlinesvg";

import moment from "moment";


import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import axios from "axios";
import { store, index, update, show } from "~/controllers/controller";
import { index as indexNew } from "~/controllers/controller";
import { convertMoney, convertDate } from "~/modules/Util";
import { Notify } from "~/modules/global";

//COMPONENTES
import ProcedimentoGeral from "./components/formularios/procedimentoGeral";
import ProcedimentoSelecaoDente from "./components/formularios/procedimentoSelecaoDente";

import Select from "react-select";
import { RowForm } from "./styles";

function AdicionarOrcamentoPage({ orcamento, alterar, onFinish }) {
  const { token } = useSelector(state => state.auth);
  const { selectedClinic, clinics } = useSelector(state => state.clinic);
  const history = useHistory();
  const { params, url } = useRouteMatch();
  const [procedimento, setProcedimento] = useState(undefined);

  const [tabelas, setTabelas] = useState([]);
  const [tabela, setTabela] = useState(undefined);

  const [procedimentos, setProcedimentos] = useState([]);
  const [dentista, setDentista] = useState([]);
  const [procedimentosFinalizados, setProcedimentosFinalizados] = useState([]);

  const [defaultOrcamento, setDefaultOrcamento] = useState();

  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const options = () => {
    if (selectedClinic.config.workBoletos) {
      return [
        { value: "total", label: "Total" },
        { value: "boleto", label: "Boleto" },
        { value: "procedimento", label: "Procedimento executado" }
      ];
    }

    return [
      { value: "total", label: "Total" },
      { value: "procedimento", label: "Procedimento executado" }
    ];
  };

  const date_now = new Date()

  useEffect(() => {
    index(token, `/preco?id=${selectedClinic.id}`).then(({ data }) => {
      setTabelas(data);
    });
  }, [selectedClinic.id, token]);

  useEffect(() => {
    if (tabela) {
      index(token, `/procedimento?id=${tabela}`).then(({ data }) => {
        setProcedimentos(data);
      });
    }
  }, [tabela, token]);

  useEffect(() => {
    show(token, "defaultOrcamentos", selectedClinic.id).then(({ data }) => {
      if (data) {
        setDefaultOrcamento(true);
        setProcedimentosFinalizados(data.orcamento);
      } else {
        setDefaultOrcamento(false);
        setProcedimentosFinalizados([]);
      }
    });
  }, [selectedClinic.id, token, reload]);

  const handlerMudancaTabela = e => {
    setTabela(e);
    setProcedimento(undefined);
  };

  const handlerMudancaProcedimentos = (procedimento, action) => {
    if (procedimento && procedimento.value)
      setProcedimento({ ...procedimento });
    else setProcedimento(undefined);
  };

  const addProcedimentoFinalizado = (e, proced) => {
    if (proced.acao === undefined) {
      proced.habilitado = true;
      setProcedimentosFinalizados([...procedimentosFinalizados, proced]);
    }
    setProcedimento(undefined);
  };

  const removerProcedimento = key => {
    procedimentosFinalizados.splice(key, 1);
    setProcedimentosFinalizados([...procedimentosFinalizados]);
  };

  const alternarProcedimento = proced => {
    proced.habilitado = !proced.habilitado;

    setProcedimentosFinalizados([...procedimentosFinalizados]);
  };

  const alterarProcedimento = procedimento => {
    procedimento.acao = "alterar";
    setProcedimento(procedimento);
  };

  const getTotalProcedimentos = () => {
    let total = 0;
    procedimentosFinalizados.map(row => {
      total += row.valorTotal;
    });

    return total;
  };

  const exibeFormularioProcedimento = () => {
    let html = "";

    if (procedimento) {
      if (procedimento.geral) {
        html = (
          <ProcedimentoGeral
            onFinish={addProcedimentoFinalizado}
            procedimento={procedimento}
            dentista={dentista}
          />
        );
      } else {
        html = (
          <ProcedimentoSelecaoDente
            onFinish={addProcedimentoFinalizado}
            procedimento={procedimento}
            dentista={dentista}
          />
        );
      }
    }

    return html;
  };

  const getFacesProcedimentoFormatado = procedimento => {
    let strFaces = "";
    procedimento.dentes.map(dente => {
      strFaces = strFaces.concat(dente.label);

      if (dente.faces !== undefined) {
        dente.faces.map(face => {
          strFaces = strFaces.concat(face.label);
        });
      }

      strFaces = strFaces.concat(", ");
    });

    strFaces = strFaces.slice(0, -2);

    return strFaces;
  };

  function handleSubmit() {
    setLoading(true);
    store(token, "/defaultOrcamentos", {
      disabled: false,
      procedimentosFinalizados,
      clinic_id: selectedClinic.id
    })
      .then(() => {
        setReload(!reload);
        setLoading(false);
        Notify("success", "Orçamento alterado");
      })
      .catch(err => {
        setLoading(false);
        Notify("error", "Erro ao alterar o orçamento");
      });
  }

  function disableOrcamento() {
    store(token, "/defaultOrcamentos", {
      disable: true,
      clinic_id: selectedClinic.id
    })
      .then(() => {
        setReload(!reload);
        setLoading(false);
        Notify("success", "Orçamento alterado");
      })
      .catch(err => {
        setLoading(false);
        Notify("error", "Erro ao alterar o orçamento");
      });
  }

  return (
    <Form layout="vertical">
      {/* LISTA AS TABELAS DE PREÇO */}

      <RowForm columns={2}>
        <Form.Item label="Orçamento padrão ?">
          <Radio.Group
            defaultValue={defaultOrcamento ? true : false}
            value={defaultOrcamento}
            onChange={e => {
              setDefaultOrcamento(e.target.value);
              if (!e.target.value) {
                disableOrcamento();
              }
            }}
          >
            <Radio value={true}>Sim</Radio>
            <Radio value={false}>Não</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Tabela*">
          <SelectNew
            disabled={!defaultOrcamento}
            value={tabela}
            onChange={e => handlerMudancaTabela(e)}
            options={tabelas.map(item => ({
              value: item.id,
              label: item.name
            }))}
          />
        </Form.Item>
      </RowForm>

      {/* LISTA OS PROCEDIMENTOS */}
      <RowForm columns={1}>
        <Form.Item>
          <Select
            isClearable={true}
            value={procedimento}
            placeholder="Busque procedimento..."
            options={procedimentos.map(item => ({
              label: item.name,
              value: item.id,
              ...item
            }))}
            onChange={(value, action) => {
              handlerMudancaProcedimentos(value, action);
            }}
            // isOptionDisabled={procedimentos}
            isDisabled={!defaultOrcamento}
          />
        </Form.Item>
      </RowForm>

      <CardGroup>
        <Card>
          <CardHeader title="Procedimento"></CardHeader>
          <CardBody>{exibeFormularioProcedimento()}</CardBody>
        </Card>

        <Card className="card-orcamento">
          <CardHeader title="Orçamentos"></CardHeader>
          <CardBody>
            <div className="todosOrcamentos">
              {procedimentosFinalizados.map((row, key) => {
                return (
                  <div
                    className={
                      "orcamento " + (!row.habilitado ? "desabilitado" : "")
                    }
                    key={key}
                  >
                    <div className="conteudo">
                      <div className="linha">{row.label}</div>
                      <div className="linha">{dentista.label}</div>
                      <div className="linha">
                        {getFacesProcedimentoFormatado(row)}
                      </div>
                    </div>
                    <div
                      className="total"
                      style={{
                        backgroundColor: "#00cf45"
                      }}
                    >
                      <p className="texto">{convertMoney(row.valorTotal)}</p>

                      <div className="acoes">
                        <span
                          onClick={() => alterarProcedimento(row)}
                          className="svg-icon menu-icon"
                        >
                          <EditOutlined />
                        </span>
                        <span
                          onClick={() => removerProcedimento(key)}
                          className="svg-icon menu-icon"
                        >
                          <DeleteOutlined />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-right">
              <h2>Total : {convertMoney(getTotalProcedimentos())}</h2>
            </div>
            <div className="text-right">
              {(() => {
                if (procedimentosFinalizados.length > 0) {
                  return (
                    <div>
                      <div
                        style={{
                          marginLeft: "auto",
                          display: "flex",
                          flexDirection: "column"
                        }}
                      >
                        <ButtonNew
                          loading={loading}
                          type="primary"
                          style={{
                            backgroundColor: "#00cf45",
                            border: "#00cf45"
                          }}
                          block
                          onClick={() => {
                            handleSubmit();
                          }}
                        >
                          Salvar
                        </ButtonNew>
                        {/* <ButtonNew
                            style={{
                              backgroundColor: "#f73b54",
                              border: "#f73b54",
                              marginTop: 5
                            }}
                            block
                            type="primary"
                            danger
                          >
                            Cancelar
                          </ButtonNew> */}
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </Form>
  );
}

export default AdicionarOrcamentoPage;
