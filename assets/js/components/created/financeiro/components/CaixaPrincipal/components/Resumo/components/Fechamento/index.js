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
  MetodoValue,
  Row
} from "./styles";
import { Button, Card, Form, Table, Statistic } from "antd";
import InputCurrency from "~/utils/Currency";
import { useStore } from "react-redux";
import { convertMoney } from "~/modules/Util";

function Fechamento({ utils, send, data }) {
  const [metodoSelecionado, setMetodoSelecionado] = useState(0);
  const [metodos, setMetodos] = useState([]);
  const [valor, setValor] = useState();

  useEffect(() => {
    let metodos = utils.metodos.map(item => {
      return {
        ...item,
        valor: utils.valores[item.value] ? utils.valores[item.value] : 0,
        ok: false
      };
    });
    console.log(metodos);
    setMetodos(metodos);
  }, [utils.metodos, utils.valores]);

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

  const firstLetter = e => {
    return e[0].toUpperCase() + e.substr(1);
  };

  const columns = [
    {
      title: "Método",
      dataIndex: "name"
    },
    {
      title: "Entrada",
      dataIndex: "valorEntrada",
      render: data => (
        <span style={{ color: "green" }}>{convertMoney(data)}</span>
      )
    },
    {
      title: "Saida",
      dataIndex: "valorSaida",
      render: data => <span style={{ color: "red" }}>{convertMoney(data)}</span>
    },
    {
      title: "Saldo",
      dataIndex: "saldo",
      render: data => <span style={{ color: "red" }}>{convertMoney(data)}</span>
    },
    {
      title: "Valor informado",
      dataIndex: "valorInformado",
      render: data => (
        <span style={{ color: "orange" }}>{convertMoney(data)}</span>
      )
    }
  ];

  return (
    <Container>
      <Row>
        {/* <MetodosContainer>
          <ACard>
            <ACardTitle>
              <span>Valores informados</span>
            </ACardTitle>
            <ACardContent>
              {metodos.map((item, index) => (
                <ContainerMetodo key={index}>
                  <MetodoName>{item.name}</MetodoName>
                  <MetodoValue>{convertMoney(item.valor)}</MetodoValue>
                </ContainerMetodo>
              ))}
            </ACardContent>
          </ACard>
        </MetodosContainer> */}

        {/* <MetodosContainer>
          <ACard>
            <ACardTitle>
              <span>Valores Reais</span>
            </ACardTitle>
            <ACardContent>
              {Object.keys(utils.valoresReais).map(key => (
                <ContainerMetodo key={key}>
                  <MetodoName>{firstLetter(key)}</MetodoName>
                  <MetodoValue>
                    {convertMoney(utils.valoresReais[key])}
                  </MetodoValue>
                </ContainerMetodo>
              ))}
            </ACardContent>
          </ACard>
        </MetodosContainer> */}
      </Row>
      <div>
        <ACard>
          <ACardTitle>
            <span>Fechamento</span>
          </ACardTitle>
          <Table
            pagination={false}
            size="small"
            columns={columns}
            // dataSource={Object.keys(utils.byType).map(key => ({
            //   name: firstLetter(key),
            //   entrada: utils.byType[key][0],
            //   saida: utils.byType[key][1]
            // }))}
            dataSource={metodos.map(item => {
              return {
                valorInformado: item.valor,
                valorEntrada: utils.byType[item.value]
                  ? utils.byType[item.value][0]
                  : 0,
                valorSaida: utils.byType[item.value]
                  ? utils.byType[item.value][1]
                  : 0,
                saldo: utils.byType[item.value]
                  ? utils.byType[item.value][0] - utils.byType[item.value][1]
                  : 0,
                ...item
              };
            })}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              margin: 20
            }}
          >
            <div></div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Statistic
                style={{ marginRight: 20 }}
                valueStyle={{ fontSize: 15 }}
                loading={!data}
                title="Total real"
                value={convertMoney(
                  Object.keys(data.valores_reais).reduce(function(
                    previous,
                    key
                  ) {
                    return previous + data.valores_reais[key];
                  },
                  0)
                )}
              />
              <Statistic
                valueStyle={{ fontSize: 15 }}
                loading={!data}
                title="Total informado"
                value={convertMoney(
                  Object.keys(data.valores_informados).reduce(function(
                    previous,
                    key
                  ) {
                    return previous + data.valores_informados[key];
                  },
                  0)
                )}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end"
              }}
            >
              <Button type="primary" onClick={send}>
                Confirmar
              </Button>
            </div>
          </div>
        </ACard>
      </div>
    </Container>
  );
}

export default Fechamento;
