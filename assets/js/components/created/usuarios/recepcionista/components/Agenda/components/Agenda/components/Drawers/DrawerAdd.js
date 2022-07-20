import React, { useState, useEffect, createRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import { Container, EditButton, ContainerEdit, CreateSelect } from "./styles";

import {
  Drawer,
  DatePicker,
  TimePicker,
  Modal,
  Form,
  Input,
  Space,
  Button,
  Select
} from "antd";
import Draggable from "react-draggable";
// import Select from "react-select";
import { EditOutlined } from "@ant-design/icons";

import CreatableSelect, { makeCreatableSelect } from "react-select/creatable";
import { FormRow } from "~/modules/global";
import { index, store } from "~/controllers/controller";

const { TextArea } = Input;
const localizer = momentLocalizer(moment);
const { RangePicker } = DatePicker;

function Drawers({
  selectedDate,
  update,
  setAddCliente,
  setEditCliente,
  updateClientes,
  pacientes,
  dentistas
}) {
  const { selectedClinic } = useSelector(state => state.clinic);
  const { token } = useSelector(state => state.auth);

  const [novoAgendamento, setNovoAgendamento] = useState(undefined);

  // const [reload, setReload] = useState(false)

  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setNovoAgendamento(selectedDate);
  }, [selectedDate]);

  const handleSave = () => {
    let dados = {
      ...novoAgendamento,
      clinica_id: selectedClinic.id
    };
    if (!dados.paciente_id) {
      return;
    }
    store(token, "/agendamento", dados).then(_ => {
      update();
      setNovoAgendamento(undefined);
    });
  };

  return (
    <Container>
      <Modal
        destroyOnClose
        title="Novo Agendamento"
        width={500}
        visible={novoAgendamento ? true : false}
        onCancel={() => setNovoAgendamento(undefined)}
        onOk={() => handleSave()}
      >
        {novoAgendamento ? (
          <Container>
            <Form layout="vertical">
              <Form.Item label="Paciente">
                <ContainerEdit>
                  <CreateSelect
                    // value={novoAgendamento.paciente_id}
                    placeholder="Selecione o paciente..."
                    options={pacientes.map(item => ({
                      label: `${item.firstName} ${item.lastName}`,
                      value: item.id
                    }))}
                    onCreateOption={e => setAddCliente(e)}
                    onChange={e => {
                      setNovoAgendamento({
                        ...novoAgendamento,
                        paciente_id: e.value
                      });
                    }}
                  />
                  <EditButton
                    type="primary"
                    disabled={!novoAgendamento.paciente_id}
                    onClick={e => setEditCliente(novoAgendamento.paciente_id)}
                  >
                    Editar
                  </EditButton>
                </ContainerEdit>
              </Form.Item>
              <Form.Item label="Tipo">
                <Select
                  value={novoAgendamento.tipo}
                  placeholder="Selecione o tipo de agendamento..."
                  options={[
                    {
                      label: "Avaliação",
                      value: "avaliacao"
                    },
                    {
                      label: "Retorno",
                      value: "retorno"
                    }
                  ]}
                  onChange={e => {
                    setNovoAgendamento({ ...novoAgendamento, tipo: e });
                  }}
                />
              </Form.Item>
              <Form.Item label="Dentista">
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    // console.log(option)
                    return (
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    );
                  }}
                  value={novoAgendamento.dentista_id}
                  options={dentistas.map(item => ({
                    label: `${item.firstName} ${item.lastName}`,
                    value: item.id
                  }))}
                  onChange={e => {
                    setNovoAgendamento({ ...novoAgendamento, dentista_id: e });
                  }}
                />
              </Form.Item>
              <Form.Item label="Status">
                <Select
                  value={novoAgendamento.status}
                  options={[
                    {
                      label: "Agendado",
                      value: "agendado"
                    },
                    {
                      label: "Confirmado",
                      value: "confirmado"
                    },
                    {
                      label: "Cancelado pelo paciente",
                      value: "cancelado_paciente"
                    },
                    {
                      label: "Cancelado pelo dentista",
                      value: "cancelado_dentista"
                    },
                    {
                      label: "Atendido",
                      value: "atendido"
                    },
                    {
                      label: "Não compareceu",
                      value: "nao_compareceu"
                    }
                  ]}
                  onChange={e => {
                    setNovoAgendamento({ ...novoAgendamento, status: e });
                  }}
                />
              </Form.Item>
              <Form.Item label="Início">
                <FormRow columns={3}>
                  <DatePicker
                    value={moment(novoAgendamento.startDate)}
                    disabled
                  />
                  <TimePicker
                    value={moment(novoAgendamento.startDate)}
                    onChange={e =>
                      setNovoAgendamento({ ...novoAgendamento, startDate: e })
                    }
                  />
                  <TimePicker
                    value={moment(novoAgendamento.endDate)}
                    onChange={e =>
                      setNovoAgendamento({ ...novoAgendamento, endDate: e })
                    }
                  />
                </FormRow>
              </Form.Item>
              <Form.Item label="Obs">
                <FormRow columns={1}>
                  <TextArea
                    onChange={e => {
                      setNovoAgendamento({
                        ...novoAgendamento,
                        obs: e.target.value
                      });
                    }}
                  />
                </FormRow>
              </Form.Item>
            </Form>
          </Container>
        ) : (
          <></>
        )}
      </Modal>
    </Container>
  );
}

export default Drawers;
