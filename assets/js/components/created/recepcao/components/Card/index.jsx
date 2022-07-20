import React, { useEffect } from "react";

import { Card, Container, Row, NameDentista, DataText, RowCenter } from "../../styles";

import { Tag, Select, Button } from "antd";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { PacienteIcon, DentistaIcon, CommentIcon } from "~/icons";
import { PhoneOutlined, WhatsAppOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { index, store, update } from "~/services/controller";
import { useState } from "react";

function CardComponent({ data, handleReload, nextStep }) {
  const dispatch = useDispatch()
  const { selectedClinic } = useSelector(state => state.clinic);
  const { token } = useSelector(state => state.auth);
  const [time, setTime] = useState('')
  const [status, setStatus] = useState();

  useEffect(() => {
   relaodTimer()
  }, [])

  const returnButtonText = () => {
    switch (nextStep) {
      case 'atendimento':
        return 'Chamar'
      case 'concluido':
        return 'Finalizar'
      default:
        return 'Chamar'
    }
  }

  function relaodTimer () {
    if (nextStep === "atendimento") {
      if (data.recepcao?.data_chegada) {
        setInterval(() => {
          setTime(returnEspera(data.recepcao?.data_chegada))
        }, 100);
      }
    }

    if (nextStep === "concluido") {
      if (data.recepcao?.data_chamada) {
        setInterval(() => {
          setTime(returnEspera(data.recepcao?.data_chamada))
        }, 100);
      }
    }
   
  }

  const returnTag = tipo => {
    switch (tipo) {
      case "retorno":
        return { color: "orange", text: "Retorno" };
      case "avaliacao":
        return { color: "green", text: "Avaliação" };
      default:
        return { color: "#fff", text: "" };
    }
  };

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

  const returnDay = startDate => {
    let hoje = moment().format("l");
    let agendamento = moment(startDate).format("l");

    if (hoje === agendamento) {
      return `*HOJE* (${moment(startDate).format("LLLL")}`;
    }

    if (
      agendamento ===
      moment()
        .add(1, "d")
        .format("l")
    ) {
      return `*AMANHÃ* (${moment(startDate).format("LLLL")})`;
    }

    return `${moment(startDate).format("LLLL")}`;
  };

  useEffect(() => {
    setStatus(data.status);
  }, [data]);

  if (!data) {
    return <></>;
  }

  const returnEspera = (chegada) => {
    var duration = moment(moment().diff(chegada)).format('mm[m] ss[s]')
    return duration
  }

  const handleChamar = () => {
    let dataUpdate = {
      status_recepcao: nextStep,
    }

    if (nextStep === 'concluido') {
      dataUpdate.status_recepcao = 'concluido'
      dataUpdate.tempo_atendimento = time
    }

    if (nextStep === 'atendimento') {
      dataUpdate.tempo_espera = time
      dataUpdate.data_chamada = new Date()
    }

    update('recepcao', data.id, dataUpdate).then(_ => {
      handleReload()
    })
  }
  return (
    <Card>
      <Row>
        <PacienteIcon size={20} />
        <div>
          <div>
            {data.paciente ? (
              <NameDentista>
                {data.paciente.firstName} {data.paciente.lastName}
              </NameDentista>
            ) : (
              <></>
            )}
            {data.status ? (
              <Tag style={{ color: "#000" }} color="green">
              {returnTag(data.status).text}
              </Tag>
            ) : (
              <></>
            )}
          </div>
          <DataText>
            {moment(data.startDate).format("llll")} -{" "}
            {moment(data.endDate).format("LT")}
          </DataText>
          {data.agendador ? (
            <div>
              <DataText>
                Agendado por <strong>{data.agendador.firstName}</strong>
              </DataText>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Row>
      {data.dentista ? (
        <Row>
          <DentistaIcon size={20} />
          {data.dentista ? (
            <DataText>
              {data.dentista.firstName} {data.dentista.lastName}
            </DataText>
          ) : (
            <></>
          )}
        </Row>
      ) : (
        <></>
      )}
      {data.obs ? (
        <Row>
          <CommentIcon size={20} />
          <DataText>{data.obs}</DataText>
        </Row>
      ) : (
        <></>
      )}
      {data.recepcao?.data_chegada && data.recepcao?.status_recepcao !== 'concluido' ? (
        <RowCenter justify="space-between">
          <div>
            <span>
              <ClockCircleOutlined />
            </span>
            <DataText>{time}</DataText>
          </div>
          {data.recepcao?.status_recepcao !== 'concluido' ? <Button type="primary" onClick={handleChamar}>{returnButtonText()}</Button> : <></>}
        </RowCenter>
      ) : (
        <></>
        )}
    </Card>
  );
}

export default CardComponent;
