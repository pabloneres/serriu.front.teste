import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Select, Input, Button, DatePicker, } from 'antd';

import { store, index, show } from "~/services/controller";

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
    ContainerScroll
  } from "../components/total/styles";
import local from "antd/es/date-picker/locale/pt_BR";

import InputCurrency from "~/utils/Currency";
import { convertMoney, convertDate, currencyToInt } from "~/modules/Util";

class PaymentOptions extends Component {
    constructor(props) {
        super(props)

        this.state = {
            metodoPagamento: null,
            valorDigitado: null,
            laboratorios: [],
            selecionado: [],
            boletoParams: {},
        }
    }

    returnOptions = () => {
        const {clinic} = this.props

        if (clinic.config.workBoletos) {
          return [
            {
              label: "Total",
              value: "total",
            },
            {
              label: "Boleto",
              value: "boleto",
            },
          ]
        }
    
        return [
          {
            label: "Total",
            value: "total",
          },
        ]
    }


    returnValorSelecionado = () => {
        const {selecionado} = this.state
        return selecionado.reduce((a, b) => a + Number(b.desconto), 0);
      };

    returnPorcentagem = () => {
        const {clinic} = this.props
        return (this.returnValorSelecionado() * clinic.config.entMinima) / 100;
    };

    returnEntradaMinima = () => {
        const {laboratorios} = this.state
        return (
          this.returnPorcentagem() +
          laboratorios.reduce((a, b) => a + Number(b.restante), 0)
        );
    };

    isDisable = () => {
        const {valorDigitado, laboratorios, boletoParams} = this.state

        if (!valorDigitado || valorDigitado === 0) {
          return true;
        }
        if (
          valorDigitado <
          Number(
            this.returnPorcentagem() +
              laboratorios.reduce((a, b) => a + Number(b.restante), 0)
          )
        ) {
          return true;
        }
        if (!boletoParams.parcelas) {
          return true;
        }
        if (!boletoParams.vencimento) {
          return true;
        }
    };

    render() {
        const {metodoPagamento, valorDigitado, laboratorios, selecionado} = this.state
        const {clinic} = this.props

        return (
            <div>
                <Select
                    style={{ width: '100%' }}
                    onChange={e => this.setState({metodoPagamento: e})}
                    disabled={this.props.disabled}
                    value={metodoPagamento}
                    placeholder="Condição de pagamento..."
                    options={this.returnOptions()}
                />

            {metodoPagamento === "total" ? (
              <ContainerDashed centered width="100">
                <FormFixed border={0} block>
                  <FormFixedLabel>Total a pagar</FormFixedLabel>
                  <InputCurrency
                    defaultValue={valorDigitado}
                    onChange={e => {
                      this.setState({valorDigitado: e})
                    }}
                  />
                </FormFixed>

                <FormFixed border={0} block>
                  <FormFixedLabel>Contém laboratório</FormFixedLabel>
                  <Input
                    style={{ width: "100%", marginBottom: 10 }}
                    disabled
                    value={convertMoney(
                      laboratorios.reduce(
                        (a, b) => a + Number(b.restante),
                        0
                      )
                    )}
                  />
                </FormFixed>

                <Button
                  onClick={() => {
                    setPagamentoDetails({});
                  }}
                  disabled={selecionado.length === 0}
                  type="primary"
                  block
                >
                  Adicionar
                </Button>
              </ContainerDashed>
            ) : (
              <></>
            )}

            {metodoPagamento === "boleto" ? (
              <ContainerDashed centered width="100">
                <FormFixed border={0} block>
                  <FormFixedLabel>Total a pagar</FormFixedLabel>
                  <InputCurrency disabled value={selecionado.reduce((a, b) => a + Number(b.desconto), 0)} />
                </FormFixed>
                <FormFixed border={0} block>
                  <FormFixedLabel>Entrada</FormFixedLabel>
                  <InputCurrency
                    max={selecionado.reduce((a, b) => a + Number(b.desconto), 0)}
                    onChange={(e) => this.setState({valorDigitado: e})}
                  />
                  <span>
                    Entrada mínima de {clinic.config.entMinima}% ={" "}
                    {convertMoney(this.returnPorcentagem())} + Lab ={" "}
                    {convertMoney(
                      laboratorios.reduce(
                        (a, b) => a + Number(b.restante),
                        0
                      )
                    )}{" "}
                    {" | "}
                    {convertMoney(this.returnEntradaMinima())}
                  </span>
                </FormFixed>

                <FormFixed border={0} block>
                  <FormFixedLabel>Parcelas</FormFixedLabel>
                  <Select
                    disabled={!valorDigitado}
                    style={{ width: "100%" }}
                    options={[
                      ...Array(clinic.config.maxParcelas).keys()
                    ].map(item => ({
                      label:
                        item +
                        1 +
                        "X" +
                        convertMoney(
                          (selecionado.reduce((a, b) => a + Number(b.desconto), 0) - valorDigitado) /
                            (item + 1)
                        ),
                      value: item + 1
                    }))}
                    onChange={e =>
                        this.setState(state => ({
                            boletoParams: {
                                ...state.boletoParams,
                                parcelas: e
                            }
                        }))
                    }
                  />
                </FormFixed>

                <FormFixed border={0} block>
                  <FormFixedLabel>Vencimento</FormFixedLabel>
                  <DatePicker
                    disabled={!valorDigitado}
                    disabledDate={data => (data < moment() ? true : false)}
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
                  onClick={() => {
                    setPagamentoDetails({});
                    if (!returnDisabledVerified()) {
                      setMostrarResumo(true);
                    }
                    setResumoCobranca({
                      tipoCobranca: "Total",
                      valor: data.totalDesconto,
                      // metodoPagamento: data.pagamento.condicao,
                      descricao: returnDescricao()
                    });
                    setBoletoParams({
                      ...boletoParams,
                      entrada: valorDigitado
                    });
                    setValorDistribuir(0);
                  }}
                  disabled={this.isDisable()}
                  type="primary"
                  block
                >
                  Adicionar
                </Button>
              </ContainerDashed>
            ) : (
              <></>
            )}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
	return {
		clinic: state.clinic.selectedClinic,
	};
};

export default connect(mapStateToProps, null)(PaymentOptions)