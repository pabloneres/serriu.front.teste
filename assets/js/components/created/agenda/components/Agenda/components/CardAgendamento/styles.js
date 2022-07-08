import styled from "styled-components";

export const Container = styled.div`
  padding: 30px;
  border: 1px solid #e3e3e3;
  border-radius: 16px;
  margin: 10px 0;
  background-color: ${props => (props.disabled ? "#d1d1d1" : "#fff")};
`;

export const Row = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
`;

export const NameDentista = styled.span`
  color: #707070;
  font-size: 18px;
  font-weight: bold;
  margin: 0 10px;
`;

export const DataText = styled.span`
  color: #707070;
  font-size: 14px;
  margin: 0 10px;
`;
