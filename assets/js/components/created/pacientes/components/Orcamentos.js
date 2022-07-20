import React, { useEffect, useState, useRef, createRef } from "react";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import AdicionarOrcamentoPage from "~/components/created/pacientes/components/orcamento/AdicionarOrcamentoPage";
import EditarOrcamento from "~/components/created/pacientes/components/orcamento/EditarOrcamentoPage";
import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import { useSelector } from "react-redux";
import {
    FolderOpenOutlined,
    DeleteOutlined,
    EditOutlined,
    DollarCircleOutlined
} from "@ant-design/icons";
import {
    Table as TableNew,
    Modal as ModalNew,
    Tag,
    Space,
    Tooltip,
    Input,
    notification,
    Tabs,
    Checkbox,
    Popconfirm
} from "antd";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import {
    Card,
    CardHeader,
    CardHeaderToolbar,
    CardBody
} from "~/_metronic/_partials/controls";

import { Modal, Button, Form, Col, InputGroup, Table } from "react-bootstrap";
import { set } from "lodash";
import {
    store,
    getProcedimentos,
    orcamento,
    destroy,
    aprovar
} from "~/controllers/orcamentoController";
import { update, index, show } from "~/services/controller";
import moment, { locale } from "moment";
import "moment/locale/pt-br";
import OrcamentoPdf from "../../Pdf/Orcamento";
moment.locale("pt-br");

// import moment from "moment-timezone";
// moment().tz("America/Los_Angeles").format();

const { TabPane } = Tabs;

export function Orcamentos(props) {
    const docRef = createRef()

    const { token } = useSelector(state => state.auth);
    const { params, url } = useRouteMatch();
    const [showForm, setShowForm] = useState(false);
    const [showFormEdit, setShowFormEdit] = useState(false);
    const [showAddSaldo, setShowAddSaldo] = useState(false);
    const [saldo, setSaldo] = useState({ undefined });
    const [enviarComissao, setEnviarComissao] = useState(true);
    const [logout, setLogout] = useState(false);
    const [orcamentos, setOrcamentos] = useState([]);
    const [orcamentoSelecionado, setOrcamentoSelecionado] = useState([]);
    const [getOrcamento, setGetOrcamento] = useState([]);
    const [showOrcamento, setShowOrcamento] = useState(false);
    const [reload, setReload] = useState(false);
    const [activeKey, setActiveKey] = useState("0");
    const history = useHistory();

    notification.config({
        placement: "bottomRight",
        duration: 3
    });

    useEffect(() => {
        index("orcamentos", {
            paciente_id: params.id
        })
            .then((response) => {
                setOrcamentos(response.data);
            })
            .catch(err => {
                if (err.response.status === 401) {
                    setLogout(true);
                }
            });
    }, [reload, activeKey, token, params.id]);

    function handleDelete(id) {
        destroy(token, id)
            .then(() => {
                setReload(!reload);
            })
            .catch(err => console.log(err));
    }

    function handleEdit(orcamento) {
        setOrcamentoSelecionado(orcamento);
        setShowFormEdit(true);
    }

    function handleShow(id) {
        setShowOrcamento(id);
    }

    function handleAprovar(id) {
        aprovar(token, id).then(() => {
            setReload(!reload);
            setShowOrcamento(false);
            setGetOrcamento([]);
        });
    }

    function ReturnStatus(status) {
        switch (status) {
            case "salvo":
                return <strong style={{ color: "red" }}>Salvo</strong>;
            case "aprovado":
                return <strong style={{ color: "green" }}>Aprovado</strong>;
            case "andamento":
                return <strong style={{ color: "orange" }}>Em andamento</strong>;
            case "finalizado":
                return <strong style={{ color: "blue" }}>Executado</strong>;
            default:
                return status;
        }
    }

    const convertMoney = value => {
        return value.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL"
        });
    };

    const returnSaldo = value => {
        if (value < 0) {
            return <span style={{ color: "red" }}> {convertMoney(value)} </span>;
        }
        return <span style={{ color: "green" }}> {convertMoney(value)} </span>;
    };

    const convertDate = data => {
        return moment(data).format("l") + " - " + moment(data).format("LT");
    };

    const convertTime = data => {
        var d = new Date(data); /* midnight in China on April 13th */
        return d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    };

    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "Criado em",
            key: "created_at",
            render: data => (
                <span>
                    {convertTime(data.created_at)}{" "}
                    {data.criador
                        ? ` por ${data.criador.firstName} ${data.criador.lastName}`
                        : ""}
                </span>
            )
        },
        {
            title: "Total orçamento",
            dataIndex: "valor",
            key: "valor",
            render: data => <span>{convertMoney(data)}</span>
        },
        {
            title: "Qnt. procedimentos",
            dataIndex: "__meta__",
            render: data => <span>{data.total_procedimentos}</span>
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: data => <span>{ReturnStatus(data)}</span>
        },
        {
            title: "Ações",
            key: "acoes",
            render: data => (
                <Space size="middle">
                    {orcamento.status !== 3 ? (
                        <Tooltip placement="top" title="Excluir">
                            <Popconfirm
                                title="Deseja excluir esse orçamento ?"
                                onConfirm={() => handleDelete(data.id)}
                                onCancel={() => { }}
                                okText="Sim"
                                cancelText="Cancelar"
                            >
                                <span
                                    style={{ cursor: "pointer" }}
                                    className="svg-icon menu-icon"
                                >
                                    <DeleteOutlined />
                                </span>
                            </Popconfirm>
                        </Tooltip>
                    ) : (
                        ""
                    )}
                    <Tooltip placement="top" title="Visualizar">
                        <span onClick={() => handleShow(data.id)} style={{ "cursor": "pointer" }} className="svg-icon menu-icon">
                            <FolderOpenOutlined twoToneColor="#eb2f96" />
                        </span>
                    </Tooltip>
                    <Tooltip placement="top" title="Editar">
                        <span
                            onClick={() => handleEdit(data)}
                            style={{ cursor: "pointer" }}
                            className="svg-icon menu-icon"
                        >
                            <EditOutlined />
                        </span>
                    </Tooltip>
                </Space>
            )
        }
    ];

    const handleAddSaldo = () => {
        update("/paciente/saldo", saldo.id, {
            valor: saldo.value,
            tipo: 0,
            enviarComissao
        }).then(_ => {
            setSaldo({ undefined });
            setShowAddSaldo(false);
            setReload(!reload);

            return notification.success({
                message: `Saldo Adicionado!`,
                description: "O saldo foi adicionado ao orçamento."
            });
        });
    };

    const onFinish = () => {
        setShowFormEdit(false);
        setShowForm(false);
        setReload(!reload);
    };

    function HandleOrcamento() {
        if (showFormEdit) {
            return (
                <EditarOrcamento
                    onFinish={_ => onFinish()}
                    id={orcamentoSelecionado.id}
                    alterar={orcamentoSelecionado !== undefined}
                />
            );
        }

        if (showForm) {
            return (
                <AdicionarOrcamentoPage
                    onFinish={_ => onFinish()}
                    orcamento={orcamentoSelecionado}
                    alterar={orcamentoSelecionado !== undefined}
                />
            );
        }

        if (!showForm) {
            return (
                <Card>
                    <CardHeader title="Orçamentos">
                        <CardHeaderToolbar>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    setShowForm(true);
                                    setOrcamentoSelecionado(undefined);
                                }}
                            >
                                Adicionar Orcamento
                            </button>
                        </CardHeaderToolbar>
                    </CardHeader>
                    <CardBody>
                        <div style={{ display: "flex", flex: 1 }}>
                            {/* <Tabs
              size="small"
              tabPosition="left"
              defaultActiveKey="0"
              activeKey={activeKey}
              onChange={(e) => setActiveKey(e)}
            >
            <TabPane tab="Salvos" key="salvo" />
          
            <TabPane tab="Aprovados" key="aprovado" />

            <TabPane tab="Em andamento" key="andamento" />
    
            <TabPane tab="Finalizados" key="finalizado" />

            <TabPane tab="Todos" key="0" />
           </Tabs> */}
                            <TableNew
                                rowKey="id"
                                dataSource={orcamentos}
                                columns={columns}
                                style={{ width: "100%", paddingLeft: 10 }}
                            />
                        </div>
                    </CardBody>
                </Card>
            );
        }
        return;
    }

    const returnFormaCobranca = forma => {
        switch (forma) {
            case "procedimento":
                return "Procedimento";

            case "parcial":
                return "Parcial";

            default:
                return forma;
        }
    };

    return (
        <>
            <ModalNew
                title="Adicionar Saldo"
                visible={showAddSaldo}
                onOk={() => handleAddSaldo()}
                onCancel={() => {
                    setShowAddSaldo(false);
                    setSaldo({ undefined });
                }}
            >
                <Input
                    value={saldo.value}
                    onChange={e => setSaldo({ ...saldo, value: e.target.value })}
                    placeholder="100,00"
                    prefix="R$"
                />

                <Checkbox
                    style={{ marginTop: 15 }}
                    defaultChecked={enviarComissao}
                    onChange={e => {
                        setEnviarComissao(e.target.checked);
                    }}
                >
                    {" "}
                    Enviar comissão ao dentista {saldo.dentista} ?
                </Checkbox>
            </ModalNew>
            <Modal show={false} size="lg">
                <Modal.Header>Orçamento</Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Informações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* <tr>
                <td>
                  Dentista
                </td>
                <td>
                  {getOrcamento.dentistas ? getOrcamento.dentista.name : ''}
                </td>
              </tr> */}
                            <tr>
                                <td>Data criação</td>
                                <td>{convertDate(getOrcamento.created_at)}</td>
                            </tr>
                            <tr>
                                <td>Data aprovação</td>
                                <td>{convertDate(getOrcamento.data_aprovacao)}</td>
                            </tr>
                            <tr>
                                <td>Status</td>
                                <td>{ReturnStatus(getOrcamento.status)}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Procedimentos</th>
                                <th>Dentista</th>
                                <th>Dente</th>
                                <th>Faces</th>
                                <th>Valor</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getOrcamento.procedimentos
                                ? getOrcamento.procedimentos.map(orcamento => (
                                    <tr key={orcamento.id}>
                                        <td>{orcamento.id}</td>
                                        <td>{orcamento.procedimento.name}</td>
                                        <td>{orcamento.dentista.name}</td>
                                        <td>{orcamento.dente ? orcamento.dente : "Geral"}</td>
                                        <td>
                                            {orcamento.faces
                                                ? JSON.parse(orcamento.faces).map(face => (
                                                    <span style={{ color: "red" }}>
                                                        {face.label}{" "}
                                                    </span>
                                                ))
                                                : "Geral"}
                                        </td>
                                        <td>{convertMoney(orcamento.valor)}</td>
                                        <td>{orcamento.status}</td>
                                    </tr>
                                ))
                                : ""}
                        </tbody>
                    </Table>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Forma de pagamento</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Forma Cobrança</td>
                                <td>
                                    {getOrcamento.pagamento
                                        ? getOrcamento.pagamento.cobranca
                                        : ""}
                                </td>
                            </tr>
                            <tr>
                                <td>Condição de Pagamento</td>
                                <td>
                                    {getOrcamento.pagamento
                                        ? getOrcamento.pagamento.condicao
                                        : ""}
                                </td>
                            </tr>

                            {getOrcamento.pagamento ? (
                                <>
                                    {getOrcamento.pagamento.condicao === "parcelado" ? (
                                        <tr>
                                            <td>Parcelamento</td>
                                            <td>
                                                Entrada de{" "}
                                                {convertMoney(getOrcamento.pagamento.entrada)}
                                                <span style={{ color: "red" }}>
                                                    {" + "}
                                                    {`${getOrcamento.pagamento.parcelas} X ${convertMoney(
                                                        (getOrcamento.valor -
                                                            getOrcamento.pagamento.entrada) /
                                                        getOrcamento.pagamento.parcelas
                                                    )}`}
                                                </span>
                                            </td>
                                        </tr>
                                    ) : (
                                        ""
                                    )}
                                </>
                            ) : (
                                ""
                            )}
                        </tbody>
                    </Table>
                    <div
                        className="text-right"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <span>
                            Total{" "}
                            <strong>
                                {getOrcamento.valor ? convertMoney(getOrcamento.valor) : ""}
                            </strong>
                        </span>
                        <div>
                            {getOrcamento.status === "salvo" ? (
                                <Button
                                    onClick={() => {
                                        handleAprovar(getOrcamento.id);
                                    }}
                                    className="mr-2"
                                    variant="primary"
                                >
                                    Aprovar
                                </Button>
                            ) : (
                                ""
                            )}
                            <Button
                                onClick={() => {
                                    setShowOrcamento(false);
                                }}
                                className="mr-2"
                                variant="danger"
                            >
                                Fechar
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <ModalNew closable={false} footer={null} onCancel={() => setShowOrcamento(undefined)} visible={showOrcamento ? true : false} width={950} >
                <OrcamentoPdf id={showOrcamento} ref={docRef} />
            </ModalNew>
            <HandleOrcamento />
        </>
    );
}
