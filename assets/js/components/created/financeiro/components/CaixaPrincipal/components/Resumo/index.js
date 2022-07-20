import React, { useEffect, useState } from "react";

import { Container } from "./styles";
import { Tabs, Modal, Table, Button } from "antd";
import {
  show as showController,
  index,
  update
} from "~/controllers/controller";
import { useSelector } from "react-redux";
import { convertMoney, convertDate } from "~/modules/Util";
import Fechamento from "./components/Fechamento";

const { TabPane } = Tabs;

function Resumo({ show, reload }) {
  const { token } = useSelector(state => state.auth);

  const [key, setKey] = useState("entrada");
  const [entradas, setEntradas] = useState([]);
  const [saidas, setSaidas] = useState([]);
  const [metodos, setMetodos] = useState([]);
  const [valores, setValoresInformados] = useState();
  const [valoresReais, setValoresReais] = useState();
  const [byType, setByType] = useState([]);
  const [data, setData] = useState();

  useEffect(() => {
    if (show.showModalResumo) {
      showController(token, "abertura", show.showModalResumo).then(
        ({ data }) => {
          setData(data);
          let movimentacoes = data.movimentacoes;
          setValoresInformados(data.valores_informados);
          setValoresReais(data.valores_reais);
          if (movimentacoes) {
            let entradas = movimentacoes.filter(a => a.tipo === 1);
            let saidas = movimentacoes.filter(a => a.tipo === 0);

            setEntradas(entradas);
            setSaidas(saidas);
          }
          setByType(data.byType);
        }
      );
    }
  }, [show, token]);

  useEffect(() => {
    index(token, "metodosPagamento").then(({ data }) => {
      setMetodos(data);
    });
  }, [token]);

  const firstLetter = e => {
    return e[0].toUpperCase() + e.substr(1);
  };

  const columns = [
    {
      title: "Data",
      dataIndex: "created_at",
      render: data => <span>{convertDate(data)}</span>
    },
    {
      title: "Descrição",
      dataIndex: "descricao"
    },
    {
      title: "Forma Pagamento",
      dataIndex: "metodoPagamento",
      render: data => <span>{firstLetter(data)}</span>
    },
    {
      title: "Valor",
      dataIndex: "valor",
      render: data => <span>{convertMoney(data)}</span>
    }
  ];

  const rowClass = e => {
    switch (e.tipo) {
      case 1:
        return "entrada-color";
      case 0:
        return "saida-color";
      default:
        break;
    }
  };

  const updateFechamento = () => {
    update(token, "caixa_principal/updateDivergente", show.showModalResumo, {
      status: "ok"
    }).then(() => {
      reload();
      show.setShowModalResumo(undefined);
    });
  };

  return (
    <Modal
      width={1200}
      visible={show.showModalResumo}
      footer={null}
      closable={false}
      onCancel={() => show.setShowModalResumo(undefined)}
    >
      <Container>
        <Tabs
          defaultActiveKey="entrada"
          activeKey={key}
          onChange={e => setKey(e)}
        >
          <TabPane tab="Entrada" key="entrada">
            <Table
              columns={columns}
              dataSource={entradas}
              size="small"
              rowClassName={rowClass}
            />
          </TabPane>
          <TabPane tab="Saída" key="saida">
            <Table
              columns={columns}
              dataSource={saidas}
              size="small"
              rowClassName={rowClass}
            />
          </TabPane>
          <TabPane tab="Resumo" key="resumo">
            <Fechamento
              data={data}
              send={updateFechamento}
              utils={{
                metodos,
                valores,
                valoresReais,
                byType
              }}
            />
          </TabPane>
        </Tabs>
      </Container>
    </Modal>
  );
}

export default Resumo;
