import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
`;
export const MetodosContainer = styled.div`
  width: 30%;
  display: flex;
`;

export const ACard = styled.div`
  border: 1px solid #c9c9c9;
  width: 100%;
`;
export const ACardTitle = styled.div`
  border-bottom: 1px solid #c9c9c9;
  padding: 5px;
`;
export const ACardContent = styled.div`
  padding: 5px;
`;

export const SetValorContainer = styled.div`
  width: 65%;
  display: flex;
`;
export const ContainerButtons = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const InfoMetodo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
`;
export const InfoMetodoTitle = styled.span`
  font-weight: bold;
`;
export const InfoMetodoSubTitle = styled.span`
  font-weight: bold;
`;

export const ContainerMetodo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  background-color: ${props => (props.active ? "#007fff60" : "")};

  &:hover {
    background-color: #007fff50;
  }
`;
export const MetodoName = styled.span``;
export const MetodoValue = styled.span``;
