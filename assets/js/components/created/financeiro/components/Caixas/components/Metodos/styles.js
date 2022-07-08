import styled from "styled-components";

export const Container = styled.div`
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
