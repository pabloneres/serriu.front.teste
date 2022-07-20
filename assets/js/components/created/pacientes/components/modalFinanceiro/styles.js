import styled from "styled-components";

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const ContainerSide = styled.div`
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  width: 49%;
  max-height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

export const ContainerSideBody = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  flex-direction: column;
`;

export const ContainerFormRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export const FormRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export const EspecialidadeContainerAll = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin: 20px 0;
`;

export const EspecialidadeContainer = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

export const EspecialidadeRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
`;

export const Especialidades = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ContainerFooter = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ContainerScroll = styled.div`
  flex: 1;
  overflow: auto;
  border: #c4c4c4 ${props => props.border}px;
  border-style: ${props => (props.dashed ? "dashed" : "solid")};
`;

export const ContainerDashed = styled.div`
  margin-top: 10px;
  width: ${props => (props.width ? props.width : "100")}%;
  display: flex;
  justify-content: ${props => (props.centered ? "center" : "space-between")};
  border: 1px dashed #c4c4c4;
  padding: 5px;
  flex-wrap: wrap;
`;

export const FormFixed = styled.div`
  border: #c4c4c4 ${props => props.border}px;
  border-style: ${props => (props.dashed ? "dashed" : "solid")};
  padding: 5px;
  display: flex;
  width: ${props => (props.block ? "100%" : "auto")};
  flex-direction: column;
`;

export const FormFixedLabel = styled.span``;

export const FormFixedValue = styled.span`
  color: green;
  font-weight: bold;
`;

export const TitleH2 = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;
