import styled from "styled-components";

export const Container = styled.div``;

export const ContainerAgendamento = styled.div`
  height: 100%;
  display: flex;
  background-color: ${props => (props.color ? props.color : "#007fff")};
  /* border-radius: 5px;
  border: 1px solid white; */
  overflow: hidden;
  color: white;
  cursor: pointer;
`;

export const AgendaColor = styled.div`
  height: 100%;
  background-color: ${props => (props.color ? props.color : "#fff")};
  border: 1px solid;
  border-color: ${props => (props.border ? props.border : "#000")};
  overflow: hidden;
  color: white;
  cursor: pointer;
  padding: 4px;
  width: 10px;
`;
