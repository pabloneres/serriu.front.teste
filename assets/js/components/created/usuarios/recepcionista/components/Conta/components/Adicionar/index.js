import React, { useState } from "react";

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
import { store } from "~/controllers/controller";

const { TextArea } = Input;
function Adicionar({ show, utils }) {
  const { token } = useSelector(state => state.auth);
  const [movimentacao, setMovimentacao] = useState({});

  const send = _ => {
    store(token, "movimentacoes", movimentacao).then(({ data }) => {
      utils.reload();
      setMovimentacao({});
      show.setShowModal(false);
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

          <Form.Item label="Receber agora ?">
            <Switch
              checkedChildren="Sim"
              unCheckedChildren="Não"
              onChange={e =>
                setMovimentacao({ ...movimentacao, receberAgora: e })
              }
            />
          </Form.Item>

          <Form.Item label="Data de débito/crédito">
            <DatePicker
              locale={locale}
              style={{ width: "100%" }}
              placeholder="Selecione a data"
              disabled={movimentacao.receberAgora}
              onChange={e =>
                setMovimentacao({ ...movimentacao, dataDebito: e })
              }
            />
          </Form.Item>
        </FormRow>

        <FormRow columns={3}>
          <Form.Item label="Método de pagamento">
            <Select
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

          <Form.Item label="Despesas">
            <Select
              placeholder="Selecione uma despesa"
              options={[]}
              value={movimentacao.despesa}
              onChange={e => setMovimentacao({ ...movimentacao, despesa: e })}
            />
          </Form.Item>

          <Form.Item label="Valor">
            <InputCurrency
              value={movimentacao.valor}
              onChange={e => setMovimentacao({ ...movimentacao, valor: e })}
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
      </Form>
    </Modal>
  );
}

export default Adicionar;
