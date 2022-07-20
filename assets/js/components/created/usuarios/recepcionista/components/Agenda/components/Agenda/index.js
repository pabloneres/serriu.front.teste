import React, { useState, useEffect, useRef } from "react";
import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  MonthView,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
  DragDropProvider,
  EditRecurrenceMenu,
  CurrentTimeIndicator,
  AppointmentTooltip,
  AppointmentForm,
  DayView
} from "@devexpress/dx-react-scheduler-material-ui";
import CreatableSelect from "react-select/creatable";

import { PacienteIcon } from "~/icons";

import { Modal, Skeleton, Tooltip, Card } from "antd";

import { Notify } from "~/modules/global";

import { data, holidays } from "./components/data.js";

import Utils from "./components/utils.js";
import DataCell from "./components/DataCell";
import DateCell from "./components/DateCell.js";
import TimeCell from "./components/TimeCell.js";

import { useSelector } from "react-redux";

import daysJson from "./components/days.json";
import agendaConfigJson from "./components/agendaConfig.json";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";

import ToolTipComponent from "./components/Tooltip";

import { index, update, show, store, destroy } from "~/controllers/controller";

import DrawerAdd from "./components/Drawers/DrawerAdd";
import DrawerEdit from "./components/Drawers/DrawerEdit";
import DrawerCliente from "./components/Drawers/DrawerAddCliente";
import DrawerEditClient from "./components/Drawers/DrawerEditCliente";

import { Container, ContainerAgendamento, AgendaColor } from "./styles";

import "./styles.css";
import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");

const { confirm } = Modal;

const currentDate = new Date();
const views = ["week", "workWeek", "day"];
const currentView = views[0];

const App = () => {
  const { params, url } = useRouteMatch();
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);

  const [reload, setReload] = useState(false);

  const [agendamentos, setAgendamentos] = useState(undefined);
  const [days, setDays] = useState([]);

  const [startOrEnd, setStartOrEnd] = useState(undefined);
  const [agendaView, setAgendaView] = useState(0);
  const [agendaConfig, setAgendaConfig] = useState(undefined);

  const [selectedDate, setSelectedDate] = useState(undefined);
  const [editDate, setEditDate] = useState(undefined);

  const [addCliente, setAddCliente] = useState(undefined);

  const [updateClientes, setUpdateClientes] = useState(false);

  const [pacientes, setPacientes] = useState([]);
  const [dentistas, setDentistas] = useState([]);

  const [editCliente, setEditCliente] = useState(undefined);

  const [currentWeek, setCurrentWeek] = useState(new Date());

  const [inalteravel, setInalteravel] = useState(true);

  useEffect(() => {
    show(token, "/agenda", selectedClinic.id).then(({ data }) => {
      if (!data) {
        setAgendaConfig({
          start: 8,
          end: 18,
          options: selectionEnd(),
          scale: 30
        });
        setDays(daysJson);
        return;
      }
      setAgendaConfig({
        ...data,
        start: Number(data.start.split(":")[0]),
        end: Number(data.end.split(":")[0]),
        startTime: data.start,
        endTime: data.end,
        options: selectionEnd(data.start, data.end, data.scale)
      });
      setDays(data.days);
    });
  }, [selectedClinic.id, token]);

  useEffect(() => {
    index(
      token,
      `/agendamento?clinica_id=${selectedClinic.id}&week=${moment(
        currentWeek
      ).format("YYYY-MM-DD")}&dentista_id=${params.id}`
    ).then(({ data }) => {
      setAgendamentos(data);
    });
  }, [currentWeek, params.id, reload, selectedClinic.id, token]);

  useEffect(() => {
    index(token, `patient?id=${selectedClinic.id}&name=`).then(({ data }) => {
      setPacientes(data);
    });
    index(token, `users?cargo=dentista&clinica=${selectedClinic.id}`).then(
      ({ data }) => {
        setDentistas(data);
      }
    );
  }, [selectedClinic.id, token, updateClientes]);

  function selectionEnd(start = "08:00", end = "18:00", interval = 30) {
    let startTime = start;
    let endTime = end;

    let selects = [startTime];
    let multiplicador = interval;

    while (startTime != endTime) {
      startTime = moment(startTime, "HH:mm")
        .add(multiplicador, "minutes")
        .format("HH:mm");
      selects.push(startTime);
    }

    return selects;
  }

  function notifyDisableDate() {
    return Notify("error", "Data não permitida", "");
  }

  function renderDataCell(itemData) {
    return <DataCell itemData={itemData} days={days} />;
  }

  function renderDateCell(itemData) {
    return <DateCell itemData={itemData} />;
  }

  function renderTimeCell(itemData) {
    return <TimeCell itemData={itemData} />;
  }

  function toopltipComponent(props) {
    return (
      <div>
        <p>
          <strong>Dentista:</strong>
          {props.data.appointmentData.dentista.name}
        </p>
        <p>
          <strong>Paciente:</strong>
          {props.data.appointmentData.paciente.name}
        </p>
      </div>
    );
  }

  function dataAtual() {
    const data = new Date();
    var dia = data.getDate() <= 9 ? `0${data.getDate()}` : data.getDate();
    var mes =
      data.getMonth() <= 9 ? `0${data.getMonth() + 1}` : data.getMonth() + 1;
    var ano = data.getFullYear();

    return `${ano}-${mes}-${dia}`;
  }

  const ReturnAppointamentClick = props => {
    const { appointmentData } = props;
    console.log(appointmentData);
    return (
      <div
        className="appointament_render"
        style={{
          borderLeftColor: appointmentData.dentista
            ? appointmentData.dentista.color_schedule
            : "white"
        }}
      >
        <div className="appointament_render_name">
          {/* <span>{appointmentData.paciente.name.split(" ")[0]}</span> */}
          <span className="appointament_render_name_hour">
            {moment(appointmentData.startDate).format("HH:mm")} -{" "}
            {moment(appointmentData.endDate).format("HH:mm")}
          </span>
        </div>
        <div
          className="status_circle"
          style={{
            backgroundColor: ReturnStatusColor(appointmentData.status)
          }}
        ></div>
      </div>
    );
  };

  const clicarAgendar = async props => {
    const isValidAppointment = Utils.isValidAppointmentRender(
      props.startDate,
      days
    );

    if (props.id) {
      setEditDate({ ...props, isValidAppointment });
      return;
    }

    if (!isValidAppointment) {
      notifyDisableDate();
      return;
    }

    setSelectedDate(props);
  };

  const ReturnStatus = status => {
    //status
    //Agendado - 0
    //Confirmado - 1
    //Cancelado - 2
    //Atendido - 3
    //Não compareceu - 4
    switch (status) {
      case 0:
        return <strong style={{ color: "rgb(196, 196, 28)" }}>Agendado</strong>;
      case 1:
        return <strong style={{ color: "green" }}>Confirmado</strong>;
      case 2:
        return <strong style={{ color: "orange" }}>Cancelado</strong>;
      case 3:
        return <strong style={{ color: "blue" }}>Atendido</strong>;
      case 4:
        return <strong style={{ color: "yellow" }}>Não compareceu</strong>;
    }
  };

  const ReturnStatusColor = status => {
    //status
    //Agendado - todo - 0
    //Confirmado - working - 1
    //Cancelado - 2
    //Atendido  - done - 3
    switch (status) {
      case 0:
        return "blue";
      case 1:
        return "orange";
      case 2:
        return "red";
      case 3:
        return "green";
      case 4:
        return "yellow";
    }
  };

  const updatingAgendamento = e => {
    const isValidAppointment = Utils.isValidAppointment(
      e.component,
      e.newData,
      days
    );

    if (!isValidAppointment) {
      e.cancel = true;
      notifyDisableDate();

      return;
    }

    if (e.oldData.status === 3) {
      e.cancel = true;
      notifyDisableDate();

      return;
    }

    var change = window.confirm(
      "Deseja alterar agendamento ?",
      "Sim",
      "Cancelar"
    );

    if (!change) {
      e.cancel = true;
      return;
    }

    const dia = moment(e.newData.startDate).format("YYYY-MM-DD");
    const startDate = moment(e.newData.startDate)
      .format("HH:mm:ss")
      .split(":");
    const endDate = moment(e.newData.endDate)
      .format("HH:mm:ss")
      .split(":");

    const current = {
      dia,
      startDate: startDate[0] + ":" + startDate[1],
      endDate: endDate[0] + ":" + endDate[1]
    };

    // updateAgendamento({
    //   id: e.newData.id,
    //   type: 'endDate',
    //   startDate: current.dia + " " + current.startDate,
    //   endDate: current.dia + " " + current.endDate,
    // });
  };

  // const updateAgendamento = (data) => {
  //   update(token, "agendamentos", data.id, data)
  //     .then(() => {
  //       setReloadAgendamentos(!reloadAgendamentos);
  //     })
  //     .catch(() => { });
  // };

  const [modalAppointament, setModalAppointament] = useState(false);
  const [modalAppointamentDatails, setModalAppointamentDetails] = useState(
    false
  );
  const [appointmentData, setAppointmentData] = useState(undefined);

  function changeAppointment(e) {
    if (inalteravel) {
      return;
    }
    confirm({
      title: "Deseja alterar esse agendamento ?",
      cancelText: "Não",
      okText: "Sim",
      onCancel() {
        return;
      },
      onOk() {
        commitChanges(e);
      }
    });
  }

  function commitChanges({ added, changed, deleted }) {
    if (inalteravel) {
      return;
    }
    if (deleted) {
      destroy(token, "/agendamento", deleted).then(() => {
        setReload(!reload);
      });
    }
    if (changed) {
      let obj;
      let agendamento;
      for (var prop in changed) {
        obj = prop;
      }
      agendamento = changed[obj];
      update(token, "agendamento", obj, agendamento).then(({ data }) => {
        setReload(!reload);
      });
    }
  }

  const colorStatus = status => {
    switch (status) {
      case "agendado":
        return "#FDFFCC";
      case "confirmado":
        return "#CCFFD3";
      case "cancelado_paciente":
        return "#FED1D1";
      case "cancelado_dentista":
        return "#D3ABFB";
      case "atendido":
        return "#81F991";
      case "nao_compareceu":
        return "#ff9e6e";
      default:
        return "#fff";
    }
  };

  const handleDelete = e => {
    console.log(e);
    // destroy(token, '/agendamento', id).then(_ => {
    //   update()
    // })
  };

  const returnFirstDayOfWeek = () => {
    let today = new Date().getDay();

    switch (today) {
      case 0:
        return 5;
      case 1:
        return 6;
      case 2:
        return 0;
      case 3:
        return 1;
      case 4:
        return 2;
      case 5:
        return 3;
      case 6:
        return 4;

      default:
        return today;
    }
  };

  return (
    <Card>
      {!agendamentos ? (
        <Skeleton />
      ) : (
        <Container>
          <DrawerAdd
            setEditCliente={setEditCliente}
            selectedDate={selectedDate}
            update={() => setReload(!reload)}
            setAddCliente={setAddCliente}
            updateClientes={updateClientes}
            setUpdateClientes={setUpdateClientes}
            pacientes={pacientes}
            dentistas={dentistas}
          />
          <DrawerEdit
            setEditCliente={setEditCliente}
            appointment={editDate}
            updateData={() => setReload(!reload)}
            pacientes={pacientes}
            dentistas={dentistas}
            close={() => setEditDate(undefined)}
          />
          <DrawerCliente
            addCliente={addCliente}
            setAddCliente={setAddCliente}
            update={() => setReload(!reload)}
            updateClientes={updateClientes}
            setUpdateClientes={setUpdateClientes}
          />
          <DrawerEditClient
            editCliente={editCliente}
            setEditCliente={setEditCliente}
            update={() => setReload(!reload)}
            updateClientes={updateClientes}
            setUpdateClientes={setUpdateClientes}
          />
          <Scheduler
            firstDayOfWeek={returnFirstDayOfWeek()}
            locale="pt-br"
            data={agendamentos}
          >
            <ViewState
              defaultCurrentDate={currentWeek}
              onCurrentDateChange={setCurrentWeek}
            />

            <WeekView
              intervalCount={1}
              startDayHour={agendaConfig ? agendaConfig.start : 8}
              endDayHour={agendaConfig ? agendaConfig.end : 18}
              cellDuration={agendaConfig ? agendaConfig.scale : 30}
            />
            <Toolbar />
            <DateNavigator />
            <TodayButton messages={{ today: "Hoje" }} />
            <Appointments
              appointmentContentComponent={e => {
                const { data } = e;
                // console.log(data)
                return (
                  // <Tooltip title={data.paciente.firstName + ' ' + data.paciente.lastName}>
                  <ContainerAgendamento color={colorStatus(data.status)}>
                    <AgendaColor
                      color={
                        data.dentista
                          ? data.dentista.profile.scheduleColor
                          : "#c4c4c4"
                      }
                      border={
                        data.dentista
                          ? data.dentista.profile.scheduleColor
                          : "#b5b5b5"
                      }
                    />
                    <div
                      style={{
                        padding: 11,
                        display: "flex",
                        flexDirection: "column"
                      }}
                    >
                      <span style={{ color: "black", fontWeight: "bold" }}>
                        {data.paciente.firstName + " " + data.paciente.lastName}
                      </span>
                      <span style={{ color: "black" }}>
                        {moment(data.startDate).format("LT")} -{" "}
                        {moment(data.endDate).format("LT")}
                      </span>
                    </div>
                  </ContainerAgendamento>
                  // </Tooltip>
                );
              }}
            />
            <EditingState onCommitChanges={changeAppointment} />
            <EditRecurrenceMenu />
            <DragDropProvider />
            <CurrentTimeIndicator
              shadePreviousCells={true}
              shadePreviousAppointments={true}
              updateInterval={10000}
            />
            <AppointmentTooltip
              showCloseButton={!inalteravel}
              showOpenButton={!inalteravel}
              showDeleteButton={!inalteravel}
              contentComponent={e => {
                const { appointmentData } = e;
                return <ToolTipComponent data={appointmentData} />;
              }}
            />
            <AppointmentForm
              visible={false}
              onAppointmentDataChange={e => {
                if (inalteravel) {
                  return;
                }
                clicarAgendar(e);
              }}
            />
          </Scheduler>
        </Container>
      )}
    </Card>
  );
};
export default App;

{
  /* <Scheduler
data={agendamentos}
timeZone="America/Sao_Paulo"
dataSource={agendamentos}
views={views}
defaultCurrentView={currentView}
defaultCurrentDate={currentDate}
// height={800}
showAllDayPanel={false}
firstDayOfWeek={1}
startDayHour={agendaConfig ? agendaConfig.start : 8}
endDayHour={agendaConfig ? agendaConfig.end : 18}
dataCellRender={renderDataCell}
dateCellRender={renderDateCell}
timeCellRender={renderTimeCell}
cellDuration={agendaConfig ? agendaConfig.scale : 30}
// cellDuration={agendaConfig ? agendaConfig.scale : 30}
appointmentRender={ReturnAppointamentClick}
editing={{ allowAdding: false, allowUpdating: false }}
onCellClick={(e) => {
// setModalAppointament(e)
clicarAgendar(e);
}}
onAppointmentDblClick={(e) => {
e.cancel = true;
}}
appointmentTooltipComponent={toopltipComponent}
onAppointmentClick={(e) => {
setAppointmentData(e.appointmentData);
setModalAppointamentDetails(true);
e.cancel = true;
}}
onAppointmentUpdating={(e) => {
updatingAgendamento(e);
}}
>
<WeekView startDayHour={0} endDayHour={24} />
<Appointments />
</Scheduler> */
}

// const [horarios, setHorarios] = useState([
//   {
//     id: 0,
//     hora: "08:00",
//     disabled: false,
//   },
//   {
//     id: 1,
//     hora: "08:30",
//     disabled: false,
//   },
//   {
//     id: 2,
//     hora: "09:00",
//     disabled: false,
//   },
//   {
//     id: 3,
//     hora: "09:30",
//     disabled: false,
//   },
//   {
//     id: 4,
//     hora: "10:00",
//     disabled: false,
//   },
//   {
//     id: 5,
//     hora: "10:30",
//     disabled: false,
//   },
//   {
//     id: 6,
//     hora: "11:00",
//     disabled: false,
//   },
//   {
//     id: 7,
//     hora: "11:30",
//     disabled: false,
//   },
//   {
//     id: 8,
//     hora: "12:00",
//     disabled: false,
//   },
//   {
//     id: 9,
//     hora: "12:30",
//     disabled: false,
//   },
//   {
//     id: 10,
//     hora: "13:00",
//     disabled: false,
//   },
//   {
//     id: 11,
//     hora: "13:30",
//     disabled: false,
//   },
//   {
//     id: 12,
//     hora: "14:00",
//     disabled: false,
//   },
//   {
//     id: 13,
//     hora: "14:30",
//     disabled: false,
//   },
//   {
//     id: 14,
//     hora: "15:00",
//     disabled: false,
//   },
//   {
//     id: 15,
//     hora: "15:30",
//     disabled: false,
//   },
//   {
//     id: 16,
//     hora: "16:00",
//     disabled: false,
//   },
//   {
//     id: 17,
//     hora: "16:30",
//     disabled: false,
//   },
//   {
//     id: 18,
//     hora: "17:00",
//     disabled: false,
//   },
//   {
//     id: 19,
//     hora: "17:30",
//     disabled: false,
//   },
//   {
//     id: 20,
//     hora: "18:00",
//     disabled: false,
//   },
// ]);
// const [agendamentos, setAgendamentos] = useState()

// const [horariosSelecionado, setHorariosSelecionado] = useState([]);
// const [reload, setReload] = useState(false);
// const [reloadAgendamentos, setReloadAgendamentos] = useState(false);
// const [currentDate, setCurrentDate] = useState(dataAtual());

// const [pacienteData, setPacienteData] = useState(undefined);
// const [agendamentoData, setAgendamentoData] = useState(undefined);
// const [obs, setObs] = useState("");
// const [clickHorario, setClickHorario] = useState(undefined);
// const [clickHorario2, setClickHorario2] = useState(undefined);
// const [startOrEnd, setStartOrEnd] = useState(undefined);
// const [agendaView, setAgendaView] = useState(0);
// const [agendaConfig, setAgendaConfig] = useState(undefined);
// const [dadosAgendamento, setDadosAgendamento] = useState({ undefined });
// const [days, setDays] = useState([]);
// const [primeiraConsulta, SetPrimeiraConsulta] = useState(0);

// const [enableEdit, setEnableEdit] = useState(false);
