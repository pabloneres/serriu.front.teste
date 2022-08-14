import React, { useState, useEffect } from "react";

import {
  Container,
  ContainerSide,
  ContainerSideBody,
  ContainerFormRow,
  EspecialidadeContainer,
  EspecialidadeContainerAll,
  EspecialidadeRow,
  Especialidades,
  ContainerDashed,
  ContainerFooter,
  FormFixed,
  FormFixedLabel,
  FormFixedValue,
  ContainerScroll,
  Row
} from "../../styles";

import Especialidade from "../especialidades";
import Laboratorio from "../laboratorio";
import Resumo from "../resumoBoleto";
import Extra from "../../../Extra";
import { useSelector } from "react-redux";

import { convertMoney, convertDate, currencyToInt } from "~/modules/Util";
import { store, index, show, update } from "~/controllers/controller";

import { Table, Tooltip, Button, Select, Input, Spin, DatePicker } from "antd";
import local from "antd/es/date-picker/locale/pt_BR";
import moment from "moment";
import { DollarCircleOutlined, RollbackOutlined } from "@ant-design/icons";
import InputCurrency from "~/utils/Currency";

function Negociacao({ data, paciente, close }) {
  const { selectedClinic } = useSelector(state => state.clinic);
  const { token } = useSelector(state => state.auth);

  const [faturamento, setFaturamento] = useState(undefined);
  const [valorDistribuir, setValorDistribuir] = useState();
  const [valorDigitado, setValorDigitado] = useState();
  const [metodoPagamento, setMetodoPagamento] = useState();

  const [labValue, setLabValue] = useState(0);

  const [showResumo, setShowResumo] = useState(false);

  const [pagamentoDetails, setPagamentoDetails] = useState();

  const [totalDistribuido, setTotalDistribuido] = useState(0);

  const [loadingButton, setLoadingButton] = useState(false);

  const [boletoParams, setBoletoParams] = useState({});

  const [changeNegociacao, setChangeNegociacao] = useState(false);

  const [loadingGerar, setLoadingGerar] = useState(false);

  const getNegociacao = id => {
    show(token, "/faturamento", id).then(({ data }) => {
      setFaturamento({
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

  const changeEspecialidadeValue = (value, index) => {
    let arr = faturamento.especialidades;
    arr.splice(index, 1, { ...arr[index], valorAplicado: value });
    setTotalDistribuido(arr.reduce((a, b) => a + Number(b.valorAplicado), 0));
    setFaturamento({ ...faturamento, especialidades: arr });
    console.log(arr);
  };

  const returnRestante = () => {
    return faturamento.total - faturamento.pago;
  };

  const clearFields = () => {
    setFaturamento();
    setValorDistribuir();
    setValorDigitado();
    setMetodoPagamento();
    setPagamentoDetails();
  };

  const send = ({ addEntrada }) => {
    setLoadingButton(true);
    const sendObject = {
      negociacao_id: faturamento.id,
      valorDigitado,
      especialidades: faturamento.especialidades,
      metodoPagamento,
      lab: labValue,
      addEntrada
    };

    update(token, "faturamento", faturamento.id, sendObject)
      .then(_ => {
        setLoadingButton(false);
        getNegociacao(faturamento.id);
        setPagamentoDetails(undefined);
        setShowResumo(true);
        // return close()
      })
      .catch(console.log);
  };

  const gerar = () => {
    setLoadingGerar(true);
    store(token, "pagamento/gerar_boletos", {
      negociacao_id: faturamento.id
    }).then(({ data }) => {
      setLoadingGerar(false);
      close();
    });
  };

  const handleChangeNegociacao = () => {
    update(
      token,
      "/negociacao_boleto/change",
      faturamento.negociacao_boleto.id,
      boletoParams
    )
      .then(_ => {
        setLoadingButton(false);
        getNegociacao(faturamento.id);
        setPagamentoDetails(undefined);
        setChangeNegociacao(false);
        setShowResumo(true);
        // return close()
      })
      .catch(console.log);
  };

  const addEntrada = () => {
    const sendObject = {
      negociacao_id: faturamento.id,
      valorDigitado,
      especialidades: faturamento.especialidades,
      metodoPagamento
    };

    update(token, "negociacao_boleto", faturamento.id, sendObject)
      .then(_ => {
        // return close()
      })
      .catch(console.log);
  };

  const InnerTable = record => {
    return (
      <Table
        showHeader={false}
        dataSource={record.pagamentos}
        columns={[
          {
            // title: 'Data',
            dataIndex: "created_at",
            render: data => <span>{convertDate(data)}</span>
          },
          {
            dataIndex: "abertura",
            render: data => (
              <span>
                {data.usuario
                  ? `Recebido por: ${data.usuario?.firstName} ${data.usuario?.lastName}`
                  : "-"}
              </span>
            )
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
    );
  };

  const distribuirAtualizado = () => {
    return valorDistribuir - totalDistribuido - labValue;
  };

  const sendBoleto = () => {
    setLoadingButton(true);

    const sendObject = {
      negociacao_id: faturamento.id,
      valorDigitado,
      especialidades: faturamento.especialidades,
      metodoPagamento,
      lab: labValue
    };

    update(token, "faturamento", faturamento.id, sendObject)
      .then(_ => {
        setLoadingButton(false);
        getNegociacao(faturamento.id);
        setPagamentoDetails(undefined);
        setShowResumo(true);
        // return close()
      })
      .catch(console.log);
  };

  return (
    <ContainerSide>
      <div
        className="pagamento-receber"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        {showResumo ? (
          <></>
        ) : (
          <div>
            {!faturamento ? (
              <div className="header-panel">
                <span>Negociações pendentes</span>
              </div>
            ) : (
              <div
                className="header-panel"
                style={{ display: "flex", alignItems: "center" }}
              >
                <RollbackOutlined
                  onClick={() => clearFields()}
                  style={{ cursor: "pointer", fontSize: "1.2rem" }}
                />
                {/* <span style={{ marginLeft: 5 }}>Fatura</span> */}
              </div>
            )}

            {!faturamento ? (
              <ContainerScroll border={1} dashed>
                <Table
                  rowKey="id"
                  size="small"
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
                      title: "F. Pagmento",
                      dataIndex: "formaPagamento",
                      render: data => <span>{data}</span>
                    },
                    {
                      title: "",
                      render: data =>
                        data.status !== "pago" ? (
                          <Tooltip title="Abrir negociação">
                            <DollarCircleOutlined
                              onClick={() => getNegociacao(data.id)}
                              style={{ cursor: "pointer" }}
                            />
                          </Tooltip>
                        ) : (
                          <></>
                        )
                    }
                  ]}
                  dataSource={data}
                  expandable={{
                    rowExpandable: record => record.pagamentos.length > 0,
                    expandedRowRender: (record, index, indent, expanded) =>
                      InnerTable(record, index, indent, expanded)
                  }}
                  pagination={false}
                />
              </ContainerScroll>
            ) : (
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
                    render: data => (
                      <span>{convertMoney(returnRestante())}</span>
                    )
                  }
                ]}
                dataSource={[faturamento]}
                pagination={false}
              />
            )}
          </div>
        )}

        {faturamento && changeNegociacao ? (
          <div>
            <FormFixed border={0} block>
              <FormFixedLabel>Parcelas</FormFixedLabel>
              <Select
                // disabled={!valorDigitado}
                style={{ width: "100%" }}
                options={[
                  ...Array(selectedClinic.config.maxParcelas).keys()
                ].map(item => ({
                  label:
                    item +
                    1 +
                    "X" +
                    convertMoney(
                      (faturamento.total -
                        faturamento.negociacao_boleto.entrada) /
                        (item + 1)
                    ),
                  value: item + 1
                }))}
                defaultValue={faturamento.negociacao_boleto.parcelas}
                value={boletoParams.parcelas}
                onChange={e =>
                  setBoletoParams({
                    ...boletoParams,
                    parcelas: e
                  })
                }
              />
            </FormFixed>

            <FormFixed border={0} block>
              <FormFixedLabel>Vencimento</FormFixedLabel>
              <DatePicker
                // disabled={!valorDigitado}
                disabledDate={data => (data < moment() ? true : false)}
                defaultValue={moment(faturamento.negociacao_boleto.vencimento)}
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
            </FormFixed>
            <Button
              block
              type="primary"
              onClick={() => handleChangeNegociacao()}
            >
              Salvar
            </Button>
          </div>
        ) : (
          <></>
        )}

        {faturamento ? (
          <>
            {!showResumo && !changeNegociacao ? (
              <>
                {faturamento && !faturamento.negociacao_boleto ? (
                  <ContainerDashed centered width="100">
                    <Row>
                      <FormFixed border={0} block>
                        <FormFixedLabel>Total a pagar</FormFixedLabel>
                        <InputCurrency
                          onChange={e => setValorDigitado(e)}
                          max={returnRestante()}
                        />
                      </FormFixed>
                      <FormFixed border={0} block>
                        <Button
                          onClick={() => {
                            setPagamentoDetails({
                              valorDigitado
                            });
                            setValorDistribuir(valorDigitado);
                          }}
                          // disabled={selecionado.length === 0}
                          type="primary"
                          block
                        >
                          Adicionar
                        </Button>
                      </FormFixed>
                    </Row>
                  </ContainerDashed>
                ) : (
                  <div>
                    <ContainerDashed centered width="100">
                      <Row>
                        <FormFixed border={0} block>
                          <FormFixedLabel>
                            Adicionar mais entrada
                          </FormFixedLabel>
                          <InputCurrency
                            onChange={e => setValorDigitado(e)}
                            value={valorDigitado}
                            max={returnRestante()}
                          />
                        </FormFixed>
                        <FormFixed border={0} block>
                          <Button
                            onClick={() => {
                              setPagamentoDetails({
                                valorDigitado
                              });
                              setValorDistribuir(valorDigitado);
                            }}
                            type="primary"
                            block
                          >
                            Adicionar
                          </Button>
                        </FormFixed>
                      </Row>
                    </ContainerDashed>
                    {pagamentoDetails ? (
                      <></>
                    ) : (
                      <>
                        <Button
                          style={{ marginTop: 10, marginBottom: 10 }}
                          block
                          type="primary"
                          onClick={() => setShowResumo(true)}
                        >
                          Visualizar resumo
                        </Button>
                        <Button
                          block
                          type="primary"
                          onClick={() => setChangeNegociacao(true)}
                        >
                          Alterar negociação
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                {faturamento && faturamento.negociacao_boleto && showResumo ? (
                  <Resumo
                    faturamento={faturamento}
                    showBack={true}
                    back={() => setShowResumo(false)}
                    showButtons={true}
                    width={100}
                    valor={faturamento.total}
                    resumoCobranca={{
                      tipoCobranca: "Parcial",
                      valor: faturamento.total,
                      // metodoPagamento: data.pagamento.condicao,
                      descricao: "teste"
                    }}
                    boletoParams={faturamento.negociacao_boleto}
                    paciente={paciente}
                    send={() => send()}
                    sendBoleto={() => sendBoleto()}
                    gerar={() => gerar()}
                    loadingGerar={loadingGerar}
                    close={() => close()}
                  />
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </div>

      {/* especialidadesNegociacao */}
      {faturamento && pagamentoDetails ? (
        <EspecialidadeContainerAll>
          <div className="info">
            <h2>Á Distribuir</h2>
            <span
              style={{ color: distribuirAtualizado() < 0 ? "red" : "green" }}
            >
              {convertMoney(distribuirAtualizado())}
            </span>
          </div>
          <EspecialidadeContainer>
            <Especialidades>
              {faturamento.especialidades.map((item, index) => {
                return (
                  <Especialidade
                    key={index}
                    onChange={value => changeEspecialidadeValue(value, index)}
                    title={item.especialidadeExecucao.especialidade.name}
                    restante={item.restante}
                  />
                );
              })}
            </Especialidades>

            {faturamento.lab && faturamento.lab.restante !== 0 ? (
              <Laboratorio
                retido={faturamento.lab.pago}
                labValue={faturamento.lab.restante + faturamento.lab.pago}
                restante={faturamento.lab.restante}
                onChange={value => {
                  setLabValue(value);
                }}
              />
            ) : (
              <></>
            )}
          </EspecialidadeContainer>
        </EspecialidadeContainerAll>
      ) : (
        ""
      )}

      {faturamento && distribuirAtualizado() === 0 && pagamentoDetails ? (
        <>
          <FormFixed border={0} block>
            <FormFixedLabel>Selecione a forma de pagamento</FormFixedLabel>
            <Select
              style={{ width: "100%" }}
              options={[
                {
                  label: "Dinheiro",
                  value: "dinheiro"
                },
                {
                  label: "Crédito",
                  value: "credito"
                },
                {
                  label: "Débito",
                  value: "debito"
                },
                {
                  label: "Pix",
                  value: "pix"
                }
              ]}
              onChange={e => {
                setMetodoPagamento(e);
              }}
            />
          </FormFixed>
          {!faturamento.negociacao_boleto && pagamentoDetails ? (
            <>
              {loadingButton ? (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  <Spin />
                </div>
              ) : (
                <Button
                  disabled={!metodoPagamento}
                  type="primary"
                  onClick={() => send({ addEntrada: false })}
                >
                  Receber
                </Button>
              )}
            </>
          ) : (
            <></>
          )}
          {pagamentoDetails && faturamento.formaPagamento === "boleto" ? (
            <Button type="primary" onClick={() => send({ addEntrada: true })}>
              Adicionar entrada e visualizar resumo
            </Button>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </ContainerSide>
  );
}

export default Negociacao;
