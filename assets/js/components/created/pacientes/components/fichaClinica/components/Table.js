import React, { useState, useEffect } from "react";

import { Table, Button } from "antd";

import { convertMoney } from "~/modules/Util";

import TableTotal from "./TableTotal";
// import { Container } from './styles';

function ReturnTable({
  orcamento,
  fichaClinica,
  executarProcedimento,
  update
}) {
  if (!orcamento) {
    return <></>;
  }

  return (
    <TableTotal
      orcamento={orcamento}
      update={update}
      executarProcedimento={executarProcedimento}
    />
  );
}

export default ReturnTable;
