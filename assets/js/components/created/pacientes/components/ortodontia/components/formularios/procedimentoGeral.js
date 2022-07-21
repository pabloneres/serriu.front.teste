import React, { useState } from "react";

import { Form, Col, Button } from "react-bootstrap";

import { convertMoney } from '~/modules/Util'

function ProcedimentoGeral({ onFinish, procedimento, dentista }) {
  procedimento.dentes = [];
  procedimento.valorTotal = procedimento.valor;
  procedimento.dentista_id = dentista.value

  return (
    <>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridAddress1">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            disabled
            type="text"
            name="nome"
            value={procedimento.label}
          ></Form.Control>
        </Form.Group>
        <Form.Group as={Col} controlId="formGridAddress1">
          <Form.Label>Valor</Form.Label>
          <Form.Control
            disabled
            type="text"
            name="valor"
            value={convertMoney(procedimento.valor)}
          ></Form.Control>
        </Form.Group>
      </Form.Row>

      <div className="text-right">
        <Button variant="primary" onClick={(e) => onFinish(e, procedimento)}>
          Adicionar
        </Button>
      </div>
    </>
  );
}

export default ProcedimentoGeral;
