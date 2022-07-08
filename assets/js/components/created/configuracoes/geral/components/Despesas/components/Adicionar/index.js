import React, { useState } from "react";

import { Container } from "./styles";
import {
  Modal,
  Form,
  Select,
  Input,
  Switch,
  DatePicker,
  Upload,
  Button
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { store } from "~/controllers/controller";

import InputCurrency from "~/utils/Currency";
import { FormRow } from "~/modules/global";

const { TextArea } = Input;
function Adicionar({ show, utils }) {
  const { token } = useSelector(state => state.auth);
  const [despesa, setDespesa] = useState({});

  const handleSend = () => {
    store(token, "despesas", { ...despesa, clinica_id: utils.clinica_id }).then(
      ({ data }) => {
        setDespesa({});
        utils.clean();
      }
    );
  };

  return (
    <Modal
      width={800}
      visible={show.showModal}
      closable={false}
      onCancel={() => show.setShowModal(false)}
      okText="Adicionar"
      cancelText="Cancelar"
      onOk={handleSend}
    >
      <Form layout="vertical">
        <FormRow columns={3}>
          <Form.Item label="Nome">
            <Input
              placeholder="Nome da despesa"
              value={despesa.name}
              onChange={e => setDespesa({ ...despesa, name: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="Tipo">
            <Select
              placeholder="Selecione o tipo"
              options={[
                {
                  label: "Recorrênte",
                  value: "recorrente"
                },
                {
                  label: "Variável",
                  value: "variavel"
                }
              ]}
              value={despesa.tipo}
              onChange={e => setDespesa({ ...despesa, tipo: e })}
            />
          </Form.Item>

          <Form.Item label="Valor">
            <InputCurrency
              value={despesa.valor}
              onChange={e => setDespesa({ ...despesa, valor: e })}
            />
          </Form.Item>
        </FormRow>

        <Form.Item label="Descrição">
          <TextArea
            value={despesa.descricao}
            onChange={e =>
              setDespesa({ ...despesa, descricao: e.target.value })
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Adicionar;
