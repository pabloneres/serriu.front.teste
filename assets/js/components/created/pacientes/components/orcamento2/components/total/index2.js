import React, { Component } from "react";

import {
  Table,
  Button,
  Tooltip,
  Input,
  InputNumber,
  DatePicker,
  Form,
  Modal as ModalAnt,
  Select,
  Tabs,
  Skeleton,
  Spin
} from "antd";

import { MoneyCollectOutlined, DollarCircleOutlined } from "@ant-design/icons";
import { Notify } from "~/modules/global";

import moment from "moment";
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
} from "./styles";

import Procedimentos from "../procedimentos";
import PaymentOptions from "../paymentOptions";

class Payment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: {},

            resumoCobranca: {},
            dentista: {},
            paciente: {},
            boletoParams: {},

            especialidades: [],
            saldoDistribuir: [],
            selecionado: [],
            labsSelecionado: [],
            especialidadesSelecionado: [],


            formaPagamento: null,
            labTotal: null,
            valorSelecionado: null,
            valorDigitado: null,
            valorDistribuir: null,
            metodoPagamento: null,
            orcamento: null,

            labValues: 0,
            pagamentoValue: 0,
            totalDistribuido: 0,

            faturamento: null,
            pagamentoDetails: null,

            loadingButton: false,
            loadingGerar: false,
            disabledLab: false,
            mostrarResumo: false,
            
            selectionType: "checkbox",
            pagamentoValue2: {},
        }

    }

    render() {
        const {data, selecionado} = this.state

        return (
            <div className="orcamento-page">
                <div className="orcamento-row">
                    <Procedimentos/>
                    <PaymentOptions/>
                </div>
            </div>
        )
    }

}

export default Payment