import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
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
import moment from "moment";
import InputCurrency from "~/utils/Currency";
import { FormRow } from "~/modules/global";
import "moment/locale/pt-br";
import locale from "antd/es/date-picker/locale/pt_BR";
import { store, index } from "~/controllers/controller";

const { TextArea } = Input;
function Adicionar({ show, utils }) {
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);
  const [movimentacao, setMovimentacao] = useState({});
  const [despesas, setDespesas] = useState([]);
  const [despesa, setDespesa] = useState();

  const send = _ => {
    store(token, "caixa_principal", {
      clinica_id: selectedClinic.id,
      tipo: movimentacao.tipo,
      valor: movimentacao.valor,
      descricao: movimentacao.descricao,
      status: "ok"
    }).then(({ data }) => {
      utils.reload();
      setMovimentacao({});
      show.setShowModal(false);
      setDespesa();
    });
  };

  useEffect(() => {
    index(token, `despesas?clinica_id=${selectedClinic.id}`).then(
      ({ data }) => {
        setDespesas(data);
      }
    );
  }, [selectedClinic.id, token]);

  const handleDespesa = id => {
    setDespesa(id);
    if (id) {
      let index = despesas.findIndex(item => item.id === id);
      if (index !== -1) {
        changeMovimentacao(index);
      }
    } else {
      setMovimentacao({ ...movimentacao, valor: 0, descricao: "" });
      return;
    }
  };

  const changeMovimentacao = index => {
    setMovimentacao({
      ...movimentacao,
      valor: despesas[index].valor,
      descricao: despesas[index].descricao
    });
  };

  return (
    <Modal
      width={1000}
      visible={show.showModal}
      closable={false}
      onCancel={() => show.setShowModal(false)}
      onOk={send}
      okText="Adicionar"
      cancelText="Cancelar"
    >
      <Form layout="vertical">
        <FormRow columns={3}>
          <Form.Item label="Tipo">
            <Select
              placeholder="Entrada/Saída"
              value={movimentacao.tipo}
              onChange={e => setMovimentacao({ ...movimentacao, tipo: e })}
              options={[
                {
                  label: "Entrada",
                  value: 1
                },
                {
                  label: "Saída",
                  value: 0
                }
              ]}
            />
          </Form.Item>

          <Form.Item label="Despesas">
            <Select
              allowClear
              placeholder="Selecione uma despesa"
              options={despesas.map(item => ({
                label: item.name,
                value: item.id
              }))}
              value={despesa}
              onChange={e => handleDespesa(e)}
            />
          </Form.Item>

          <Form.Item label="Valor">
            <InputCurrency
              value={movimentacao.valor}
              onChange={e => setMovimentacao({ ...movimentacao, valor: e })}
            />
          </Form.Item>

          {/* 
          <Form.Item label="Receber agora ?">
            <Switch
              checkedChildren="Sim"
              unCheckedChildren="Não"
              onChange={e =>
                setMovimentacao({ ...movimentacao, receberAgora: e })
              }
            />
          </Form.Item> */}
        </FormRow>

        <FormRow columns={3}>
          <FormRow columns={1}>
            <Form.Item label="Anexar arquivo">
              <Upload>
                <Button>
                  <UploadOutlined />
                  Clique para anexar
                </Button>
              </Upload>
            </Form.Item>
          </FormRow>

          <Form.Item label="Método de pagamento">
            <Select
              allowClear
              placeholder="Ex: Dinheiro"
              options={utils.metodosPagamento.map(item => ({
                label: item.name,
                value: item.value
              }))}
              value={movimentacao.metodoPagamento}
              onChange={e =>
                setMovimentacao({ ...movimentacao, metodoPagamento: e })
              }
            />
          </Form.Item>
        </FormRow>

        <Form.Item label="Descrição">
          <TextArea
            value={movimentacao.descricao}
            onChange={e =>
              setMovimentacao({ ...movimentacao, descricao: e.target.value })
            }
          />
        </Form.Item>

        {/* <FormRow columns={1}>
          <Form.Item label="Anexar arquivo">
            <Upload>
              <Button>
                <UploadOutlined />
                Clique para anexar
              </Button>
            </Upload>
          </Form.Item>
        </FormRow> */}
      </Form>
    </Modal>
  );
}

export default Adicionar;
