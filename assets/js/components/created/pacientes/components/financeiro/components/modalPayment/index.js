import React, { useEffect, useState } from "react";

import {
  Table,
  Modal,
  Select,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Upload,
  Tooltip,
  Form
} from "antd";

// import Modal from '~/components/created/modal'

import { UploadOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { convertMoney, convertDate, currencyToInt } from "~/modules/Util";
import { FormRow, Notify } from "~/modules/global";
import { useSelector } from "react-redux";

import { store, show } from "~/services/controller";
import { useRouteMatch } from "react-router-dom";

import BoletoModal from "./components/boleto";
import TotalModal from "./components/total";
import ProcedimentoModal from "./components/procedimento";

import { Container } from "./styles";
import { set } from "date-fns";

import "../styles.css";

function ModalPayment({ modal, setModal, close }) {

  const { params } = useRouteMatch();

  const [desconto, setDesconto] = useState(undefined);
  const [procedimentos, setProcedimentos] = useState([]);
  const [passwordCode, setPasswordCode] = useState("");

  const columnsModalReceber = [
    {
      title: "Procedimento",
      dataIndex: "procedimento",
      render: data => <span>{data.name}</span>
    },
    {
      title: "Valor un",
      render: data => <span>{data.valor ? convertMoney(data.valor) : ""}</span>
    },
    {
      title: "Valor total",
      render: data => <span>{data.valor ? convertMoney(data.valor) : ""}</span>
    },
    {
      title: "Status",
      dataIndex: "status",
      render: data => <span>{data}</span>
    }
  ];

  useEffect(() => {
    if (modal) {
      setProcedimentos(modal.procedimentos);
    }
  }, [modal]);

  function update() {
    show("/orcamentos", modal.id).then(async ({ data }) => {
      const paciente = await show("/patient", params.id).then(
        ({ data }) => {
          return data;
        }
      );
      setModal({ ...data, paciente });
    });
  }

  const clearPasswordCode = () => {
    setTimeout(() => {
      setPasswordCode("");
    }, 30000);
  };

  const handleDesconto = () => {
    console.log(desconto);
    if (desconto) {
      store("/procedimentoExecucao/discount", {
        ...desconto,
        passwordCode
      })
        .then(({ data }) => {
          update();
          setDesconto(undefined);
          clearPasswordCode();
          Notify("success", "Autorizado", "Seu desconto foi autorizado");
        })
        .catch(({ data }) => {
          Notify("error", "Negado", "Seu desconto não foi autorizado");
          clearPasswordCode();
        });
    }
  };

  const closeAll = () => {
    setDesconto(undefined);
    setProcedimentos([]);
    setPasswordCode("");
    close();
  };

  return (
    <Container>
      <Modal
        title="Liberar desconto"
        visible={desconto ? true : false}
        onCancel={() => setDesconto(undefined)}
        onOk={() => handleDesconto()}
      >
        <Form layout="vertical">
          <FormRow columns={1}>
            <Form.Item label="Senha financeira">
              <Input
                onChange={e => setPasswordCode(e.target.value)}
                type="password"
                value={passwordCode}
              />
            </Form.Item>
          </FormRow>
        </Form>
      </Modal>
      <Modal
        className="ant_modal_edited"
        centered
        visible={modal ? true : false}
        onClose={() => close()}
        onCancel={() => close()}
        width={"80%"}
        footer={null}
      >
        {modal ? (
          <TotalModal
            close={closeAll}
            data={{
              ...modal,
              procedimentos,
              columnsModalReceber,
              changeFormaPagamento: () => close()
            }}
            setModal={setModal}
            setDesconto={setDesconto}
            desconto={desconto}
            update={update}
          />
        ) : (
          ""
        )}
      </Modal>
    </Container>
  );
}

export default ModalPayment;
