import React from "react";

import { Container, MetodoName, MetodoValue } from "./styles";
import { convertMoney } from "~/modules/Util";

function Metodos({ data, click, active }) {
  return (
    <Container onClick={() => click(data)} active={active === data.index}>
      <MetodoName>{data.name}</MetodoName>
      <MetodoValue>{convertMoney(data.valor)}</MetodoValue>
    </Container>
  );
}

export default Metodos;
