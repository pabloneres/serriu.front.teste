import React, { useState, useEffect, createRef } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useSelector } from 'react-redux'
import { Container } from './styles'

import { Drawer, DatePicker, TimePicker, Modal, Form, Input, Space, Button, Select } from 'antd'
import Draggable from 'react-draggable';
// import Select from "react-select";

import CreatableSelect, { makeCreatableSelect } from "react-select/creatable";
import { FormRow } from '~/modules/global'
import { index, store } from '~/controllers/controller'

const { TextArea } = Input
const localizer = momentLocalizer(moment)
const { RangePicker } = DatePicker

function MyCalendar() {
  const { selectedClinic } = useSelector(state => state.clinic)
  const { token } = useSelector(state => state.auth)

  const [agendamentos, setAgendamentos] = useState([])
  const [novoAgendamento, setNovoAgendamento] = useState(undefined)
  const [abrirAgendamento, setAbrirAgendamento] = useState(undefined)

  const [pacientes, setPacientes] = useState([])
  const [dentistas, setDentistas] = useState([])

  const [reload, setReload] = useState(false)

  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 })
  const [disabled, setDisabled] = useState(true)

  const handleAgendar = (e) => {
    console.log(e)
    setNovoAgendamento(e)
  }

  useEffect(() => {
    index(token, `/agendamento?clinica_id=${selectedClinic.id}`).then(({ data }) => {
      setAgendamentos(data.map(item => {
        console.log(item)
        return {
          ...item,
          title: item.paciente.firstName ? item.paciente.firstName : '',
          start: new Date(item.start),
          end: new Date(item.end),
        }
      }));
    })
  }, [reload])

  useEffect(() => {
    index(token, `patient?id=${selectedClinic.id}&name=`).then(({ data }) => {
      setPacientes(data)
    })
    index(token, `users?cargo=dentista&clinica=${selectedClinic.id}`).then(({ data }) => {
      setDentistas(data)
    })
  }, [])

  const handleSave = () => {
    let dados = {
      ...novoAgendamento,
      clinica_id: selectedClinic.id
    }
    store(token, '/agendamento', dados).then(_ => {
      setNovoAgendamento(undefined)
      setReload(!reload)
    })
  }

  const draggleRef = React.createRef();

  const onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current.getBoundingClientRect();
    setBounds({
      bounds: {
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect.bottom - uiData.y),
      },
    });
  };

  return (
    <Container>
      <Modal
        title="Novo Agendamento"
        width={500}
        visible={novoAgendamento ? true : false}
        onCancel={() => setNovoAgendamento(undefined)}
        onOk={() => handleSave()}
      >
        {novoAgendamento ?
          <Container>
            <Form layout="vertical">
              <Form.Item label="Paciente">
                <Select
                  disabled
                  value={novoAgendamento.paciente_id}
                  placeholder="Selecione o paciente..."
                  options={pacientes.map(item => ({
                    label: `${item.firstName} ${item.lastName}`,
                    value: item.id
                  }))}
                  onChange={(e) => {
                    setNovoAgendamento({ ...novoAgendamento, paciente_id: e })
                  }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    console.log(option)
                    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  }
                />
              </Form.Item>
              <Form.Item label="Dentista">
                <Select
                  disabled
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  value={novoAgendamento.dentista_id}
                  options={dentistas.map(item => ({
                    label: `${item.firstName} ${item.lastName}`,
                    value: item.id
                  }))}
                  onChange={(e) => {
                    setNovoAgendamento({ ...novoAgendamento, dentista_id: e })
                  }}
                />
              </Form.Item>
              <Form.Item label="Início">
                <FormRow columns={3}>
                  <DatePicker
                    defaultValue={moment(novoAgendamento.start)}
                  />
                  <TimePicker
                    defaultValue={moment(novoAgendamento.start)}
                  />
                  <TimePicker
                    defaultValue={moment(novoAgendamento.end)}
                  />
                </FormRow>
              </Form.Item>
              <Form.Item label="Obs">
                <FormRow columns={1}>
                  <TextArea
                    onChange={(e) => {
                      setNovoAgendamento({ ...novoAgendamento, obs: e.target.value })
                    }}
                  />
                </FormRow>
              </Form.Item>
            </Form>
          </Container>
          : <></>}
      </Modal>
      <Modal
        title="Agendamento"
        width={500}
        visible={abrirAgendamento ? true : false}
        onCancel={() => setAbrirAgendamento(undefined)}
        onOk={() => handleSave()}
        okButtonProps={{
          title: 'Atualzar',

        }}
      // modalRender={modal => (
      //   <Draggable
      //     disabled={disabled}
      //     bounds={bounds}
      //     onStart={(event, uiData) => onStart(event, uiData)}
      //   >
      //     <div ref={draggleRef}>{modal}</div>
      //   </Draggable>
      // )}
      >
        {abrirAgendamento ?
          <Container>
            <Form layout="vertical">
              <Form.Item label="Paciente">
                <Select
                  disabled
                  value={abrirAgendamento.paciente_id}
                  placeholder="Selecione o paciente..."
                  options={pacientes.map(item => ({
                    label: `${item.firstName} ${item.lastName}`,
                    value: item.id
                  }))}
                  // onChange={(e) => {
                  //   setNovoAgendamento({ ...novoAgendamento, paciente_id: e })
                  // }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    console.log(option)
                    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  }
                />
              </Form.Item>
              <Form.Item label="Dentista">
                <Select
                  disabled
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  value={abrirAgendamento.dentista_id}
                  options={dentistas.map(item => ({
                    label: `${item.firstName} ${item.lastName}`,
                    value: item.id
                  }))}
                // onChange={(e) => {
                //   setNovoAgendamento({ ...novoAgendamento, dentista_id: e })
                // }}
                />
              </Form.Item>
              <Form.Item label="Início">
                <FormRow columns={3}>
                  <DatePicker
                    value={moment(abrirAgendamento.start)}
                  />
                  <TimePicker
                    value={moment(abrirAgendamento.start)}
                  />
                  <TimePicker
                    value={moment(abrirAgendamento.end)}
                  />
                </FormRow>
              </Form.Item>
              <Form.Item label="Obs">
                <FormRow columns={1}>
                  <TextArea
                    value={abrirAgendamento.obs}
                    onChange={(e) => {
                      setNovoAgendamento({ ...novoAgendamento, obs: e.target.value })
                    }}
                  />
                </FormRow>
              </Form.Item>
            </Form>
          </Container>
          : <></>}
      </Modal>
      <Calendar
        // titleAccessor={e => <span>{e}</span>}
        view="week"
        localizer={localizer}
        events={agendamentos}
        // startAccessor="start"
        // endAccessor="end"
        style={{ height: 700 }}
        onSelectEvent={e => {
          console.log(e)
          setAbrirAgendamento(e)
        }}
        onSelectSlot={e => handleAgendar(e)}
        selectable
        onRangeChange={[

        ]}
      // onSelectEvent={e => console.log(e)}
      />
    </Container>
  )
}

export default MyCalendar