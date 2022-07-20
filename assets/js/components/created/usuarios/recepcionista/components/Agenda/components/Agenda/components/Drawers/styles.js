import { Button } from "antd";
import CreatableSelect, { makeCreatableSelect } from "react-select/creatable";

import styled from "styled-components";

export const Container = styled.div``;

export const ContainerEdit = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const EditButton = styled(Button)`
  padding: 3px;
  margin-left: 5px;
`;

export const CreateSelect = styled(CreatableSelect)`
  width: 100%;
`;
