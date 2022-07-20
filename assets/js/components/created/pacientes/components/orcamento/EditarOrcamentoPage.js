import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import {
  Form,
  Table,
  Col,
  Button,
  CardGroup,
  Modal,
  ButtonToolbar,
  ButtonGroup,
  Alert
} from "react-bootstrap";

import { Button as ButtonNew } from 'antd'

import './styles.css'

import SVG from "react-inlinesvg";

import moment from "moment";




import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  store,
  index,
  update,
  show
} from "~/controllers/controller";
import { index as indexNew } from '~/controllers/controller'
import { convertMoney, convertDate } from "~/modules/Util";

//COMPONENTES
import ProcedimentoGeral from "./components/formularios/procedimentoGeral";
import ProcedimentoSelecaoDente from "./components/formularios/procedimentoSelecaoDente";

import Select from "react-select";
import { Select as SelectNew, Form as FormNew, DatePicker } from 'antd'
import { FormRow } from '~/modules/global'

import locale from 'antd/es/date-picker/locale/pt_BR';

function EditarOrcamento({ id, onFinish }) {

  const { token } = useSelector((state) => state.auth);
  const { selectedClinic, clinics } = useSelector((state) => state.clinic);
  const history = useHistory();
  const { params, url } = useRouteMatch();
  const [procedimento, setProcedimento] = useState(undefined);

  const options = () => {
    if (selectedClinic.config.workBoletos) {
      return [
        { value: 'total', label: 'Total' },
        { value: 'boleto', label: 'Boleto' },
        { value: 'procedimento', label: 'Procedimento executado' },
      ]
    }

    return [
      { value: 'total', label: 'Total' },
      { value: 'procedimento', label: 'Procedimento executado' },
    ]
  }

  const date_now = new Date();
  const data = format(date_now, `dd/MM/yyyy HH:mm:ss`, {
    timeZone: "America/Sao_Paulo",
  });

  const [tabelas, setTabelas] = useState([]);
  const [tabela, setTabela] = useState(undefined);

  const [procedimentos, setProcedimentos] = useState([]);

  const [dentists, setDentists] = useState([]);
  const [dentista, setDentista] = useState([]);
  const [clinicas, setClinicas] = useState([]);
  const [procedimentosFinalizados, setProcedimentosFinalizados] = useState([]);
  const [dadosAPI, setDadosAPI] = useState([]);

  const [modalFormaPagamento, setModalFormaPagamento] = useState(false);

  const [orcamento, setOrcamento] = useState(undefined)

  const [cobranca, setCobranca] = useState({})
  const [pagamento, setPagamento] = useState({})
  const [condicao, setCondicao] = useState({})
  const [entrada, setEntrada] = useState(undefined)
  const [parcelas, setParcelas] = useState(undefined)
  const [showAlert, setShowAlert] = useState(false)

  const [opcoesPagamento, setOpcoesPagamento] = useState(undefined)

  useEffect(() => {
    index(token, `/preco?id=${selectedClinic.id}`).then(({ data }) => { setTabelas(data) })

    index(token, `/users?cargo=dentista&clinica=${selectedClinic.id}`).then(({ data }) => { setDentists(data) })
  }, []);

  useEffect(() => {
    if (tabela) {
      index(token, `/procedimento?id=${tabela}`).then(({ data }) => { setProcedimentos(data) })
    }
  }, [tabela]);


  useEffect(() => {
    show(token, 'orcamentos', id).then(({ data }) => {

      let procedimentos = []
      let dentes = []

      data.procedimentos.forEach(element => {
        let index = procedimentos.findIndex(item => item.id === element.procedimento.id)
        if (index === -1) {
          procedimentos.push({
            label: element.procedimento.name,
            value: element.procedimento.id,
            id: element.procedimento.id,
            especialidade_id: element.procedimento.especialidade_id,
            tabela_id: element.procedimento.tabela_id,
            name: element.procedimento.name,
            geral: element.procedimento.geral,
            valor: element.procedimento.valor,
            labsService: element.procedimento.labsService,
            dentista_id: element.dentista.id,
            habilitado: true,
            dentes: []
          })
        }
      })

      data.procedimentos.forEach(element => {
        let index = dentes.findIndex(item => item.id === element.procedimento.id)
        if (index === -1) {
          dentes.push({
            valor: element.valor,
            procedimento_id: element.procedimento.id,
            label: element.dente,
            faces: element.faces,
            active: true
          })
        }
      })

      dentes.forEach(element => {
        let index = procedimentos.findIndex(item => item.id === element.procedimento_id)

        if (procedimentos[index].geral === 1) {
          return
        }

        procedimentos[index].dentes = [...procedimentos[index].dentes, element]
      })

      procedimentos = procedimentos.map(element => ({
        ...element,
        valorTotal: element.dentes.length > 0 ? element.dentes.reduce((a, b) => a + b.valor, 0) : element.valor
      }))


      setDentista(data.avaliador)
      setProcedimentosFinalizados(procedimentos)
    })
  }, [])

  const handleSubmitFormaPagamento = (e) => {
    e.preventDefault()

    let opcoesPagamento = {
      condicao: returnCondicao('value'),
      entrada,
      parcelas: !parcelas ? undefined : parcelas,
    }
    setOpcoesPagamento(opcoesPagamento)
    setModalFormaPagamento(false);
  };

  const handlerMudancaTabela = (e) => {
    setTabela(e.target.value);
    setProcedimento(undefined)
    // indexNew(token, `dentista/procedimentos/${dentista.value}?tabela_id=${e.target.value}`).then(({data}) => {
    //   setProcedimentos(data.map(item => ({
    //     label: item.name,
    //     value: item.id,
    //     ...item
    //   })))
    // })  
  };

  const handlerMudancaDentista = async (data) => {
    if (!data) {
      return
    }
    setDentista(data)
    // indexNew(token, `dentista/procedimentos/${data.value}?tabela_id=${tabela}`).then(({ data }) => {
    //   setProcedimentos(data.map(item => ({
    //     label: item.name,
    //     value: item.id,
    //     ...item
    //   })))
    // })
  };

  const handlerMudancaProcedimentos = (procedimento, action) => {
    console.log(procedimento)

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

  const removerProcedimento = (key) => {
    procedimentosFinalizados.splice(key, 1);
    setProcedimentosFinalizados([...procedimentosFinalizados]);
  };

  const alternarProcedimento = (proced) => {
    proced.habilitado = !proced.habilitado;

    setProcedimentosFinalizados([...procedimentosFinalizados]);
  };

  const alterarProcedimento = (procedimento) => {
    procedimento.acao = "alterar";
    setProcedimento(procedimento);
  };

  const getTotalProcedimentos = () => {
    let total = 0;
    procedimentosFinalizados.map((row) => {
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

  const getFacesProcedimentoFormatado = (procedimento) => {
    console.log(procedimento)

    let strFaces = "";
    procedimento.dentes.map((dente) => {
      strFaces = strFaces.concat(dente.label);

      if (dente.faces !== undefined) {
        dente.faces.map((face) => {
          strFaces = strFaces.concat(face.label);
        });
      }

      strFaces = strFaces.concat(", ");
    });

    strFaces = strFaces.slice(0, -2);

    return strFaces;
  };

  function handleSubmit(type) {
    // if (type === "aprovar") {
    //   update(token, id, {
    //     procedimentos: procedimentosFinalizados,
    //     paciente_id: params.id,
    //     pagamento: opcoesPagamento,
    //     avaliador: dentista.value,
    //     clinic_id: selectedClinic.id,
    //     status: 'aprovado',
    //   })
    //     .then(() => {
    //       notify("Orçamento editado", "success", 1000);
    //       onFinish()
    //     })
    //     .catch((err) => {
    //       return;
    //       // retirar a linha debaixo e retornar o erro
    //       // setSubmitting(false);
    //     });
    // }

    update(token, '/orcamentos', id, {
      procedimentos: procedimentosFinalizados,
      pagamento: opcoesPagamento,
      avaliador: dentista,
      paciente_id: params.id,
      clinic_id: selectedClinic.id,
      status: 'aprovado',
      data_aprovacao: new Date(),
      id,
    })
      .then(() => {
        notify("Orçamento editado", "success", 1000);
        onFinish()
      })
      .catch((err) => {
        return;
        // retirar a linha debaixo e retornar o erro
        // setSubmitting(false);
      });

    return;
  }

  const returnFormaPagamento = () => {
    if (cobranca.value === 'procedimento' || cobranca.value === 'parcial') {
      return options()['pagamento'][0]
    }
    return pagamento
  }

  const returnCondicao = (props) => {
    if (props === 'value') {
      if (pagamento.value === 'dinheiro') {
        return options()['condicao'][0]
      }

      if (cobranca.value === 'procedimento' || cobranca.value === 'parcial') {
        return options()['condicao'][0]
      }

      return condicao
    }

    if (props === 'disabled') {
      if (cobranca.value === 'procedimento' || cobranca.value === 'parcial' || pagamento.value === 'dinheiro') {
        return true
      }
    }
  }

  return (
    <Card>
      <Modal show={showAlert} onHide={() => setShowAlert(false)} centered>
        <Modal.Body>Esse dentista não tem uma comissão configurada, deseja criar ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAlert(false)}>
            Cancelar
          </Button>
          <Link
            to={{
              pathname: "/dentista/editar/" + dentista,
              state: { rota: 'configComissoes' }
            }}
          >
            <Button variant="primary">
              Criar
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>
      <Modal show={modalFormaPagamento && getTotalProcedimentos() > 0} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Forma de Pagamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitFormaPagamento}>

            {/* <Form.Row className="justify-content-md-center">
              <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Forma de Cobrança</Form.Label>
                <Select
                  required
                  value={cobranca}
                  placeholder="Selecione a forma de cobrança..."
                  options={options['cobranca']}
                  onChange={(value) => {
                    setCobranca(value)
                  }}
                />
              </Form.Group>
            </Form.Row> */}

            <Form.Row className="justify-content-md-center">
              <Form.Group as={Col} controlId="formGridAddress1">
                <Form.Label>Condição de Pagamento</Form.Label>
                <Select
                  required
                  value={returnCondicao('value')}
                  isDisabled={returnCondicao('disabled')}
                  placeholder="Selecione a condição de pagamento..."
                  options={options()}
                  onChange={(value) => {
                    setCondicao(value)
                  }}
                />
              </Form.Group>
            </Form.Row>

            {/* <Form.Row className="justify-content-md-center">
              <Form.Group as={Col}>
              <Form.Label>Valor Entrada</Form.Label>
              <Form.Control
                type="number"
                name="valorEntrada"
                value={entrada}
                required
                onChange={(e) => {
                  setEntrada(e.target.value)
                }}
              />
              <Form.Control.Feedback type="invalid">
                Esse campo é necessario!
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Restante</Form.Label>
              <Form.Control
                type="text"
                name="valorEntrada"
                disabled
                value={convertMoney( getTotalProcedimentos() - entrada )}
              />
              <Form.Control.Feedback type="invalid">
                Esse campo é necessario!
              </Form.Control.Feedback>
            </Form.Group>

          </Form.Row> */}

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setModalFormaPagamento(false);
                }}
              >
                Fechar
              </Button>
              <Button variant="primary" type="submit">
                Salvar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <CardHeader title="Adicionar Orcamento"></CardHeader>
      <CardBody>
        <FormNew layout="vertical">
          <FormRow columns={3}>
            {/* LISTAR CLINICAS */}

            <FormNew.Item label="Clinica*">
              <SelectNew
                disabled
                value={selectedClinic.id}
                placeholder="Selecione a clinica..."
                options={clinics.map(item => ({
                  value: item.id,
                  label: item.name
                }))}
              />
            </FormNew.Item>

            {/* LISTAR DENTISTAS */}

            <FormNew.Item label="Dentista*">
              <SelectNew
                disabled
                allowClear={true}
                value={dentista}
                placeholder="Selecione o dentista..."
                options={dentists.map(item => ({
                  value: item.id,
                  label: `${item.firstName} ${item.lastName}`

                }))}
                onChange={(value) => {
                  console.log(value)
                  handlerMudancaDentista(value)
                }}
              />
            </FormNew.Item>

            {/* INSERE A DATA */}
            <FormNew.Item label="Data*" >
              <DatePicker
                style={{ width: "100%" }}
                disabled
                defaultValue={moment()}
                locale={locale}
              />
            </FormNew.Item>
          </FormRow>

          {/* LISTA AS TABELAS DE PREÇO */}
          <Form.Row>
            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Tabela *</Form.Label>
              <Form.Control
                as="select"
                name="tabela"
                onChange={(e) => handlerMudancaTabela(e)}
              >
                <option value=""></option>
                {tabelas.map((tabela) => (
                  <option key={tabela.id} value={tabela.id}>
                    {tabela.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form.Row>

          {/* LISTA OS PROCEDIMENTOS */}
          <Form.Row>
            <Form.Group as={Col} controlId="formGridAddress1">
              <Form.Label>Procedimentos *</Form.Label>

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
                isOptionDisabled={procedimentos}
              />
            </Form.Group>
          </Form.Row>

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
                          <div className="linha">
                            {/* {dentista.label} */}
                          </div>
                          <div className="linha">
                            {getFacesProcedimentoFormatado(row)}
                          </div>
                        </div>
                        <div className="total" style={{
                          backgroundColor: '#00cf45'
                        }}>
                          <p className="texto">
                            {console.log(row)}
                            {convertMoney(row.valorTotal)}
                          </p>

                          <div className="acoes">
                            <span
                              onClick={() => alterarProcedimento(row)}
                              className="svg-icon menu-icon"
                            >
                              <SVG
                                style={{
                                  fill: "#fff",
                                  color: "#fff",
                                  cursor: "pointer",
                                }}
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/Design/create.svg"
                                )}
                              />
                            </span>
                            <span
                              onClick={() => removerProcedimento(key)}
                              className="svg-icon menu-icon"
                            >
                              <SVG
                                style={{
                                  fill: "#fff",
                                  color: "#fff",
                                  marginLeft: 8,
                                  cursor: "pointer",
                                }}
                                src={toAbsoluteUrl(
                                  "/media/svg/icons/Design/delete.svg"
                                )}
                              />
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
                    return (
                      <span
                        onClick={() => setModalFormaPagamento(true)}
                        className="svg-icon menu-icon btn-formapagamento"
                      >
                        <SVG
                          style={{
                            fill: "#3699FF",
                            color: "#3699FF",
                            marginRight: 8,
                            cursor: "pointer",
                          }}
                          src={toAbsoluteUrl(
                            "/media/svg/icons/Design/create.svg"
                          )}
                        />
                        DEFINIR FORMA DE PAGAMENTO
                      </span>
                    );
                  })()}
                </div>
                <div className="text-right">
                  {(() => {
                    if (opcoesPagamento) {
                      return (
                        <div>
                          <div
                            style={{
                              marginLeft: "auto",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <ButtonNew
                              type="primary"
                              style={{ backgroundColor: '#00cf45', border: '#00cf45' }}
                              block
                              onClick={() => {
                                handleSubmit("aprovar");
                              }}
                            >
                              Aprovar
                            </ButtonNew>
                            <div
                              style={{
                                display: "grid",
                                gap: 10,
                                gridTemplateColumns: '1fr 1fr',
                                marginTop: 10,
                              }}
                            >

                              <ButtonNew
                                style={{ backgroundColor: '#f73b54', border: '#f73b54' }}
                                block
                                type="primary"
                                danger
                              >
                                Cancelar
                              </ButtonNew>

                              <ButtonNew
                                type="primary"
                                style={{ backgroundColor: '#f7c500', border: '#f7c500' }}
                                block
                                onClick={() => {
                                  handleSubmit("salvar");
                                }}
                              >
                                Alterar
                              </ButtonNew>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>
              </CardBody>
            </Card>
          </CardGroup>
        </FormNew>
      </CardBody>
    </Card>
  );
}


export default EditarOrcamento