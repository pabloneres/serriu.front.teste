import React, { useEffect, useState } from "react";

import {
  Container,
  MetodosContainer,
  ACard,
  ACardContent,
  ACardTitle,
  SetValorContainer,
  InfoMetodo,
  InfoMetodoTitle,
  InfoMetodoSubTitle,
  ContainerButtons,
  ContainerMetodo,
  MetodoName,
  MetodoValue
} from "./styles";
import { Button, Card, Form } from "antd";
import InputCurrency from "~/utils/Currency";
import { useStore } from "react-redux";
import { convertMoney } from "~/modules/Util";

function Fechamento({ utils, send }) {
  const [metodoSelecionado, setMetodoSelecionado] = useState(0);
  const [metodos, setMetodos] = useState([]);
  const [valor, setValor] = useState();

  useEffect(() => {
    setMetodos(
      utils.metodos.map(item => ({
        ...item,
        valor: 0,
        ok: false
      }))
    );
  }, [utils.metodos]);

  const handleChangeValue = e => {
    let mets = metodos;
    mets.splice(metodoSelecionado, 1, {
      ...metodos[metodoSelecionado],
      valor,
      ok: true
    });
    setMetodos(mets);
    if (metodoSelecionado !== metodos.length - 1) {
      setMetodoSelecionado(metodoSelecionado + 1);
    }
    setValor();
  };

  const disabledFechar = () => {
    let ok = metodos.filter(item => item.ok === true);
    let notOk = metodos.filter(item => item.ok === false);

    if (notOk.length > 0) {
      return true;
    }

    return false;
  };

  return (
    <Container>
      <MetodosContainer>
        <ACard>
          <ACardTitle>
            <span>Métodos de Pagamento</span>
          </ACardTitle>
          <ACardContent>
            {metodos.map((item, index) => (
              <ContainerMetodo
                onClick={() => setMetodoSelecionado(index)}
                active={metodoSelecionado === index}
              >
                <MetodoName>{item.name}</MetodoName>
                <MetodoValue>{convertMoney(item.valor)}</MetodoValue>
              </ContainerMetodo>
            ))}
          </ACardContent>
        </ACard>
      </MetodosContainer>
      <SetValorContainer>
        <ACard>
          <ACardTitle>
            <span>Informar o valor</span>
          </ACardTitle>
          <ACardContent>
            <InfoMetodo>
              <Form layout="horizontal">
                <Form.Item label="Método Selecionado">
                  <InfoMetodoSubTitle>
                    {utils.metodos[metodoSelecionado].name}
                  </InfoMetodoSubTitle>
                </Form.Item>
                <Form.Item label="Valor">
                  <InputCurrency onChange={setValor} value={valor} />
                </Form.Item>
              </Form>
              <ContainerButtons>
                <Button onClick={handleChangeValue} type="primary">
                  Adicionar Valor
                </Button>
                <Button
                  onClick={() => send(metodos)}
                  disabled={disabledFechar()}
                  type="primary"
                >
                  Fechar Caixa
                </Button>
              </ContainerButtons>
            </InfoMetodo>
          </ACardContent>
        </ACard>
      </SetValorContainer>
    </Container>
  );
}

export default Fechamento;
