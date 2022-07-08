import React, { useState, useEffect } from "react";

// import { Container } from './styles';
import { Table, Card, Button, Select, Tag } from "antd";
import { convertMoney } from "~/modules/Util";
import { index, store } from "~/controllers/controller";
import { useSelector } from "react-redux";

function TableTotal({
  orcamento,
  especialidades,
  executarProcedimento,
  update
}) {
  const { token, user } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);
  const [dentistas, setDentistas] = useState([]);
  const changeTitular = e => {
    console.log({ ...e, orcamento_id: orcamento.id });

    store(token, "/fichaClinica/updateTitular", {
      orcamento_id: orcamento.id,
      especialidade_id: e.especialidade_id,
      dentista_id: e.dentista_id
    }).then(_ => {
      update();
    });
  };

  const Extra = data => {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* <span style={{ marginRight: 20 }}>Total: {convertMoney(total)}</span> */}
        <span style={{ color: "green", fontWeight: "bold", marginLeft: 20 }}>
          Total: {convertMoney(data.valor)}
        </span>
        {/* <span style={{ color: 'green', fontWeight: 'bold' }}>: {convertMoney(data.saldo)}</span> */}
        {/* <span style={{ color: "green", fontWeight: "bold", marginLeft: 20 }}>
          Disponível Comissão: {convertMoney(data.saldoComissao)}
        </span> */}
        <span style={{ color: "green", fontWeight: "bold", marginLeft: 20 }}>
          Saldo: {convertMoney(data.saldo)}
        </span>
        {/* <Select onChange={(e) => changeTitular({
          especialidade_id: data.especialidade_id,
          dentista_id: e
        })} options={dentistas} style={{ width: 250, marginLeft: 20 }} /> */}
      </div>
    );
  };

  useEffect(() => {
    index(token, `users?cargo=dentista&clinica=${selectedClinic.id}`)
      .then(({ data }) => {
        setDentistas(
          data.map(item => ({
            ...item,
            label: item.firstName + " " + item.lastName,
            value: item.id
          }))
        );
      })
      .catch(err => {
        if (err.response.status === 401) {
        }
      });
  }, [selectedClinic.id, token]);

  return (
    <div>
      {orcamento.especialidades.map((especi, index) => {
        return (
          <Card
            key={index}
            title={especi.especialidade.name}
            extra={Extra({
              total: especi.total,
              valor: especi.valor,
              restante: especi.restante,
              saldoComissao: especi.saldoComissao,
              saldo: especi.saldo,
              dentistas,
              especialidade_id: especi.especialidade_id
            })}
          >
            <Table
              rowKey="id"
              columns={[
                {
                  title: "Dente",
                  dataIndex: "dente",
                  render: data => <span>{data ? data : "Geral"}</span>
                },
                {
                  title: "Procedimento",
                  dataIndex: "procedimento",
                  render: data => <span>{data.name}</span>
                },
                {
                  title: "Face",
                  dataIndex: "faces",
                  render: data => (
                    <span>
                      {data
                        ? data.map(item => {
                            return (
                              <span style={{ color: "red" }}>{item.label}</span>
                            );
                          })
                        : "-"}
                    </span>
                  )
                },
                // {
                //   title: 'Avaliador',
                //   dataIndex: 'dentista',
                //   render: (data) => <span>{data.firstName} {data.lastName}</span>,
                // },
                {
                  title: "Titular",
                  dataIndex: "titular",
                  render: data =>
                    data ? (
                      <Select
                        disabled
                        value={data}
                        options={dentistas}
                        style={{ width: 250, marginLeft: 20 }}
                      />
                    ) : (
                      <></>
                    )
                },
                {
                  title: "Valor procedimento",
                  render: data => (
                    <span>
                      {convertMoney(data.desconto)}{" "}
                      {data.negociacao &&
                      data.negociacao.formaPagamento === "boleto" ? (
                        <Tag color="purple">Boleto</Tag>
                      ) : (
                        ""
                      )}
                    </span>
                  )
                },
                {
                  width: 120,
                  render: data => (
                    <Button
                      type="primary"
                      disabled={
                        data.status_execucao === "executado" ||
                        !data.negociacao_id
                      }
                      onClick={e => executarProcedimento(e, orcamento, data)}
                    >
                      {data.status_execucao === "executado"
                        ? "Executado"
                        : !data.negociacao_id
                        ? "Aguardando negociação"
                        : "Executar"}
                    </Button>
                  )
                }
              ]}
              dataSource={especi.procedimentos}
              pagination={false}
            />
          </Card>
        );
      })}
    </div>
  );
}

export default TableTotal;

// useEffect(() => {
//   if (orcamento.pagamento) {

//     console.log(orcamento.pagamento)
//     console.log(orcamento.pagamentos)
//     console.log(orcamento.procedimentos)

//     setSelecionado(orcamento.procedimentos.map((item) => ({ ...item, key: item.id })));

//     setPagamentoValue2(orcamento.restante);

//     if (orcamento.pagamentos.length === 0) {
//       let arrEspecialidades = orcamento.procedimentos.map((item) => ({
//         procedimentos: [item],
//         id: item.procedimento.especialidade.id,
//         name: item.procedimento.especialidade.name,
//         valor: item.desconto,
//         restante: item.desconto,
//         valorAplicado: Number(),
//       }))

//       let valores = []

//       console.log(arrEspecialidades)

//       arrEspecialidades.forEach((item) => {
//         if (!valores.some((el, i) => el.id === item.id)) {
//           valores.push(item);
//         } else {
//           var index = valores.findIndex(
//             (current) => item.id === current.id
//           );

//           valores[index].valor = valores[index].valor + item.valor;
//           valores[index].procedimentos = [...valores[index].procedimentos, item.procedimentos[0]]
//         }
//       });

//       const especi = valores.map((item) => ({
//         ...item,
//         restante: item.valor,
//       }))

//       console.log(especi)

//       setEspecialidades(especi);
//       setSaldoDistribuir(especi);

//       return;
//     } else {

//       let especialidadesSemRestante = [];

//       let especialidadesOrcamento = orcamento.procedimentos.map((item) => {
//         return {
//           procedimentos: [item],
//           id: item.procedimento.especialidade.id,
//           name: item.procedimento.especialidade.name,
//           valor: Number(item.desconto),
//           valorAplicado: Number(),
//         }
//       });

//       console.table(especialidadesOrcamento)
//       // console.table()

//       especialidadesOrcamento.forEach((item) => {
//         if (
//           !especialidadesSemRestante.some((el, i) => el.id === item.id)
//         ) {
//           especialidadesSemRestante.push(item);
//         } else {
//           var index = especialidadesSemRestante.findIndex(
//             (current) => item.id === current.id
//           );
//           especialidadesSemRestante[index].valor =
//             especialidadesSemRestante[index].valor + item.valor;

//           especialidadesSemRestante[index].procedimentos = [...especialidadesSemRestante[index].procedimentos, item.procedimentos[0]]
//         }
//       });

//       console.log(especialidadesOrcamento)

//       especialidadesSemRestante = especialidadesSemRestante.map(
//         (item) => ({
//           ...item,
//           restante: item.valor,
//         })
//       );

//       console.log(especialidadesSemRestante)

//       ////////////////////////////////////////////////

//       let especialidadesComRestante = [];

//       let arrEspecialidades = orcamento.pagamentos.map((item) => {
//         console.log(item)
//         return {
//           id: item.especialidades.id,
//           name: item.especialidades.name,
//           valor: Number(item.valor),
//           restante: Number(item.restante),
//           valorAplicado: Number(),
//         }
//       });

//       arrEspecialidades.forEach((item) => {
//         if (
//           !especialidadesComRestante.some((el, i) => el.id === item.id)
//         ) {
//           especialidadesComRestante.push(item);
//         } else {
//           var index = especialidadesComRestante.findIndex(
//             (current) => item.id === current.id
//           );

//           especialidadesComRestante[index] = item;
//         }
//       });

//       console.log(arrEspecialidades)

//       ///////////////////////////////////////////////

//       let especialidadeDiferenca = [];

//       especialidadesSemRestante.forEach((item) => {
//         if (
//           !especialidadesComRestante.some((el, i) => el.id === item.id)
//         ) {
//           especialidadeDiferenca.push(item);
//         } else {
//           return;
//         }
//       });

//       ///////////////////////////////////////////////

//       let especialidadesFinal = [
//         ...especialidadesComRestante,
//         ...especialidadeDiferenca,
//       ];

//       console.table(especialidadesFinal)

//       setEspecialidades(especialidadesFinal);
//       setSaldoDistribuir(especialidadesFinal);
//     }
//   }
// }, [orcamento])
