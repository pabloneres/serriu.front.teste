import React, { useEffect, useState, useCallback, Component } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import SVG from "react-inlinesvg";
import { Link } from "react-router-dom";
import { index, destroy } from "~/services/controller";
import { Table, Space, Tooltip, Input } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import {
    Card,
    CardHeader,
    CardHeaderToolbar,
    CardBody
} from "~/_metronic/_partials/controls";
import { Notify } from "~/modules/global";

// function PacientePage() {
//     const { token } = useSelector(state => state.auth);
//     const { selectedClinic } = useSelector(state => state.clinic);
//     const [patients, setPatients] = useState([]);
//     const [logout, setLogout] = useState(false);
//     const [search, setSearch] = useState("");
//     const [awaitingTyping, setAwaitingTyping] = useState(null);

//     const [loading, setLoading] = useState(false);

//     const history = useHistory();

//     const [pagination, setPagination] = useState({
//         lastPage: undefined,
//         page: 1,
//         perPage: 10,
//         total: undefined
//     });

//     useEffect(() => {
//         loadPatients("");
//     }, [loadPatients]);

//     const searchPatient = () => {
//         if (awaitingTyping) {
//             clearTimeout(awaitingTyping);
//             setAwaitingTyping(null);
//         }
//         setAwaitingTyping(
//             setTimeout(() => {
//                 loadPatients(search);
//             }, 500)
//         );
//     };

//     const loadPatients = useCallback((search, pagination = {}) => {
//         setLoading(true);


//         index(
//             token,
//             `/patient?id=${selectedClinic.id
//             }&name=${search}&page=${pagination.current || pagination.page}`
//         )
//             .then(({ data }) => {
//                 setPagination({ page: data.page, total: data.total });
//                 setPatients(data.data);
//                 setLoading(false);
//             })
//             .catch(err => {
//                 if (err.response.status === 401) {
//                     setLogout(true);
//                 }
//             });
//     });

//     if (logout) {
//         return <Redirect to="/logout" />;
//     }

//     handleDelete = (id) => {
//         destroy(token, "/patient", id).then(() => {
//             loadPatients("");
//         });
//     }

//     handleEdit = (id) => {
//         destroy(token, id).then(() => {
//             index(token)
//                 .then(({ data }) => {
//                     setPatients(data);
//                 })
//                 .catch(err => {
//                     if (err.response.status === 401) {
//                         setLogout(true);
//                     }
//                 });
//         });
//     }

//     tableChange = data => {
//         loadPatients("", data);
//     };



// }

// export default PacientePage;


class PacientePage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            patients: [],
            search: "",
            pagination: {
                lastPage: undefined,
                page: 1,
                perPage: 10,
                total: undefined
            },
            columns: [
                {
                    title: "Id",
                    render: data => <Link to={"/paciente/editar/" + data.id}>{data.id}</Link>
                },
                {
                    title: "Nome",
                    render: data => (
                        <Link to={"/paciente/editar/" + data.id}>
                            {data.firstName} {data.lastName}
                        </Link>
                    )
                },
                {
                    title: "CPF",
                    dataIndex: "cpf"
                },
                {
                    title: "Email",
                    dataIndex: "email"
                },
                {
                    title: "Celular",
                    dataIndex: "tel"
                },
                {
                    title: "Ações",
                    render: data => (
                        <Space size="middle">
                            <Tooltip placement="top" title="Editar">
                                <span
                                    onClick={() => this.props.history.push("/paciente/editar/" + data.id)}
                                    style={{ cursor: "pointer" }}
                                    className="svg-icon menu-icon"
                                >
                                    <EditOutlined />
                                </span>
                            </Tooltip>
                            <Tooltip placement="top" title="Excluir">
                                <span
                                    onClick={() => {
                                        this.handleDelete(data.id);
                                    }}
                                    style={{ cursor: "pointer" }}
                                    className="svg-icon menu-icon"
                                >
                                    <DeleteOutlined />
                                </span>
                            </Tooltip>
                        </Space>
                    )
                }
            ]
        }
    }

    componentDidMount() {
        this.loadPatients()
    }

    loadPatients = () => {
        this.setState({
            isLoading: true
        })

        index("patient", {
            id: this.props.clinic.id,
            name: this.state.search,
            page: this.state.pagination.current || this.state.pagination.page
        }).then((response) => {
            this.setState({
                isLoading: false,
                pagination: { page: response.data.page, total: response.data.total },
                patients: response.data.data
            })
        }).catch(err => {
            Notify("error", "Erro ao carregar pacientes")
        });
    }


    handleDelete = (id) => {
        destroy("patient", id).then(() => {
            this.loadPatients("");
        });
    }

    handleEdit = (id) => {
        destroy("patient", id).then(() => {
            this.loadPatients()
        });
    }

    tableChange = (data) => {
        this.setState({
            pagination: data
        }, () => {
            this.loadPatients()
        })
    };


    _onKeyDown = (e) => {
        this.setState({ search: e.target.value })
        this.loadPatients()
    }

    render() {
        const { columns, patients, search, isLoading, pagination } = this.state

        return (
            <Card>
                <CardHeader title="Pacientes">
                    <CardHeaderToolbar>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => this.props.history.push("/paciente/adicionar")}
                        >
                            Adicionar paciente
                        </button>
                    </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                    <Input
                        style={{ marginBottom: 10 }}
                        onChange={this._onKeyDown}
                        onKeyUp={this.loadPatients}
                        value={search}
                        placeholder="Buscar paciente"
                    />
                    <Table
                        size="small"
                        rowKey="id"
                        columns={columns}
                        dataSource={patients}
                        onChange={this.tableChange}
                        loading={isLoading}
                        pagination={{
                            defaultCurrent: 1,
                            pageSize: pagination.perPage,
                            showSizeChanger: false,
                            total: pagination.total
                        }}
                    />
                </CardBody>
            </Card>
        );
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        isAdmin: state.auth.userData.department_id === "administrador",
        token: state.auth.access_token,
        user: state.auth.userData,
        clinic: state.clinic.selectedClinic,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PacientePage)