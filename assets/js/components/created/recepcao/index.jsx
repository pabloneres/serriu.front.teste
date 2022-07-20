import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Tooltip,
  Tag,
  Card,
  Select,
  DatePicker
} from "antd";
import { index, update, store } from "~/services/controller";
import { useSelector } from "react-redux";
import { Container, ContainerColumns, TitleContainer } from './styles';

import ColumnComponent from "./components/Column";
import CardComponent from "./components/Card";

import moment from "moment";
import "moment/locale/pt-br";
import "./styles.css";
moment.locale("pt-br");

const { RangePicker } = DatePicker;

function Monitoramento() {
  const { selectedClinic } = useSelector(state => state.clinic);

  const [data, setData] = useState([])
  const [reload, setRelaod] = useState(false)


  useEffect(() => {
    index('recepcao', {
      clinica_id: selectedClinic.id,
      status_recepcao: 'presente'
    }).then(({ data }) => {
      setData(data)
    })
  }, [reload])

  const handleReload = () => {
    setRelaod(!reload)
  }

  return (
    <Container>
      <TitleContainer>Recepção Virtual</TitleContainer>
      <ContainerColumns>
        <ColumnComponent title="Em espera" background="#f6f6d4">
          {data.filter(item => item.recepcao.status_recepcao === 'presente').map((item, index) => (
            <CardComponent
              nextStep="atendimento"
              key={index}
              data={item}
              handleReload={handleReload}
            />
          ))}
        </ColumnComponent>
        <ColumnComponent title="Em atendimento" background="#dafcd0">
          {data.filter(item => item.recepcao.status_recepcao === 'atendimento').map((item, index) => (
            <CardComponent
              nextStep="concluido"
              key={index}
              data={item}
              handleReload={handleReload}
            />
          ))}
        </ColumnComponent>
        <ColumnComponent title="Concluido" background="#c0c0ff">
          {data.filter(item => item.recepcao.status_recepcao === 'concluido').map((item, index) => (
            <CardComponent
              nextStep=""
              key={index}
              data={item}
              handleReload={handleReload}
            />
          ))}
        </ColumnComponent>
      </ContainerColumns>
    </Container>
  );
}

export default Monitoramento;
