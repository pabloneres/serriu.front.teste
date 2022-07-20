import React, { useEffect, useState, useCallback } from "react";
import { useHistory, Redirect, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { store, index, destroy } from "~/services/controller";
import { Table, Input, Space, Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody
} from "~/_metronic/_partials/controls";
import { id } from "date-fns/locale";

function DentistaPage() {
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);
  const [users, setUsers] = useState([]);
  const [logout, setLogout] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [show, setShow] = useState(false);
  const [reload, setReload] = useState(false);
  const [id, setId] = useState();
  const [deleted, setDeleted] = useState(false);
  const [search, setSearch] = useState("");
  const [awaitingTyping, setAwaitingTyping] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    lastPage: undefined,
    page: 1,
    perPage: 10,
    total: undefined
  });

  const history = useHistory();

  useEffect(() => {
    loadRecepcionist();
  }, [loadRecepcionist, reload]);

  const searchPatient = () => {
    if (awaitingTyping) {
      clearTimeout(awaitingTyping);
      setAwaitingTyping(null);
    }
    setAwaitingTyping(
      setTimeout(() => {
        loadRecepcionist(search);
      }, 500)
    );
  };

  const loadRecepcionist = useCallback((search = "", pagination = {}) => {
    setLoading(true);
    index("users", {
      clinic_id: selectedClinic.id,
      cargo: "recepcionista",
      name: search,
      page: pagination.current || pagination.page
    }).then(({ data }) => {
      setPagination({ page: data.page, total: data.total });
      setUsers(data.data);
      setLoading(false);
    }).catch(err => {
      if (err.response.status === 401) {
        setLogout(true);
      }
    });
  });

  function handleDelete(id) {
    destroy("users", id).then(() => {
      setReload(!reload);
    });
  }

  if (logout) {
    return <Redirect to="/logout" />;
  }

  if (redirect) {
    return <Redirect to={`/dentista/editar/${id}`} />;
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: data => <Link to={`/recepcionista/editar/${data}`}>{data}</Link>
    },
    {
      title: "Nome",
      render: data => (
        <Link to={`/recepcionista/editar/${data.id}`}>
          {data.firstName + " " + data.lastName}
        </Link>
      )
    },
    {
      title: "CPF",
      dataIndex: "profile",
      render: data => <span>{data.cpf}</span>
    },
    {
      title: "Tel",
      dataIndex: "profile",
      render: data => <span>{data.tel}</span>
    },
    {
      title: "Ações",
      render: data => (
        <Space size="middle">
          <Tooltip placement="top" title="Editar">
            <span
              onClick={() => history.push("/recepcionista/editar/" + data.id)}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <EditOutlined />
            </span>
          </Tooltip>

          <Popconfirm
            title="Deseja excluir ?"
            onConfirm={() => handleDelete(data.id)}
            okText="Sim"
            cancelText="Não"
          >
            <span style={{ cursor: "pointer" }} className="svg-icon menu-icon">
              <DeleteOutlined />
            </span>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const tableChange = data => {
    loadRecepcionist("", data);
  };

  return (
    <Card>
      <CardHeader title="Recepcionistas">
        <CardHeaderToolbar>
          {/* <button
            type="button"
            className="btn btn-primary"
            onClick={() => history.push('/dentista/adicionar')}
          >
            Adicionar dentista
          </button> */}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <Input
          style={{ marginBottom: 10 }}
          onChange={e => setSearch(e.target.value)}
          onKeyUp={e => searchPatient()}
          value={search}
          placeholder="Buscar recepcionista"
        />
        <Table
          size="small"
          dataSource={users}
          rowKey="id"
          columns={columns}
          onChange={tableChange}
          loading={loading}
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

export default DentistaPage;
