import React from "react";

import { Container, Row, NameDentista, DataText } from "./styles";

import { Tag } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import { PacienteIcon, DentistaIcon, CommentIcon } from "~/icons";
import { PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";

function Tooltip({ data }) {
  const { selectedClinic } = useSelector(state => state.clinic);
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

  const returnWhatsApi = () => {
    const text = `Olá, aqui é da ${
      selectedClinic.name_fantasy
    }, não esqueça do seu horário agendado para hoje às ${moment(
      data.startDate
    ).format("LT")}. Se acontecer algum imprevisto nos avise, ligue no ${
      selectedClinic.tel
    } ou responda essa mensagem, até mais.`;
    const link = `https://api.whatsapp.com/send?phone=55${encodeURI(
      data.paciente.tel
    )}&text=${encodeURI(text)}`;
    window.open(link, "_blank");
  };

  return (
    <Container>
      <Row>
        <PacienteIcon size={20} />
        <div>
          <div>
            <NameDentista>
              {data.paciente.firstName} {data.paciente.lastName}
            </NameDentista>
            <Tag style={{ color: "#000" }} color={colorStatus(data.status)}>
              {returnTag(data.tipo).text}
            </Tag>
          </div>
          <DataText>
            {moment(data.startDate).format("llll")} -{" "}
            {moment(data.endDate).format("LT")}
          </DataText>
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
      {data.paciente.tel ? (
        <Row>
          <PhoneOutlined style={{ fontSize: 20, color: "#707070" }} />
          <DataText>{data.paciente.tel}</DataText>
          <WhatsAppOutlined
            onClick={() => returnWhatsApi()}
            style={{ fontSize: 20, color: "green", cursor: "pointer" }}
          />
        </Row>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default Tooltip;
