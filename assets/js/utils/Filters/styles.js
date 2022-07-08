import styled from "styled-components";

export const Container = styled.div`
  background-color: #fff;
  padding: 10px 15px;
  border: 1px solid #c4c4c4;
  border-radius: 10px;
`;

export const ButtonsFilter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
`;

export const ButtonText = styled.span`
  color: #007fff;
  cursor: pointer;

  &&hover {
    color: #4b7cf3;
  }
`;
