import React, { useState, useEffect, createRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import { Container, EditButton, ContainerEdit } from "./styles";

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

import CreatableSelect, { makeCreatableSelect } from "react-select/creatable";
import { FormRow } from "~/modules/global";
import { index, store, update } from "~/controllers/controller";

const { TextArea } = Input;
const localizer = momentLocalizer(moment);
const { RangePicker } = DatePicker;

function Drawers({
  appointment,
  updateData,
  setEditCliente,
  pacientes,
  dentistas,
  close
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
    setNovoAgendamento(appointment);
  }, [appointment]);

  const handleSave = () => {
    if (!novoAgendamento.paciente_id) {
      return;
    }
    update(token, "agendamento", novoAgendamento.id, {
      dentista_id: novoAgendamento.dentista_id,
      startDate: novoAgendamento.startDate,
      endDate: novoAgendamento.endDate,
      obs: novoAgendamento.obs,
      tipo: novoAgendamento.tipo,
      status: novoAgendamento.status
    }).then(_ => {
      updateData();
      close();
    });
  };

  return (
    <Container>
      <Modal
        title="Editar Agendamento"
        width={500}
        visible={novoAgendamento ? true : false}
        onCancel={() => {
          updateData();
          close();
          setNovoAgendamento(undefined);
        }}
        onOk={() => handleSave()}
        okText="Salvar"
        cancelText="Cancelar"
      >
        {novoAgendamento ? (
          <Container>
            <Form layout="vertical">
              <Form.Item label="Paciente">
                <ContainerEdit>
                  <Select
                    disabled
                    value={novoAgendamento.paciente_id}
                    placeholder="Selecione o paciente..."
                    options={pacientes.map(item => ({
                      label: `${item.firstName} ${item.lastName}`,
                      value: item.id
                    }))}
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
                  disabled={!novoAgendamento.isValidAppointment}
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
                  disabled={!novoAgendamento.isValidAppointment}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
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
                    disabled={!novoAgendamento.isValidAppointment}
                    value={moment(novoAgendamento.startDate)}
                    onChange={e =>
                      setNovoAgendamento({ ...novoAgendamento, startDate: e })
                    }
                  />
                  <TimePicker
                    disabled={!novoAgendamento.isValidAppointment}
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
                    disabled={!novoAgendamento.isValidAppointment}
                    value={novoAgendamento.obs}
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
