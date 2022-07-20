import React, { useEffect, useState } from "react";
import { index, show, update } from "~/controllers/controller";
import { useSelector } from "react-redux";
import { Table, Card, Checkbox, Modal, Button } from "antd";

function Permissions({ id, data, returnViewButton }) {
  console.log(data);
  const { token } = useSelector(store => store.auth);
  const [cargos, setCargos] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departmentRoles, setDepartmentRoles] = useState([]);
  const [editDepartment, setEditDepartment] = useState({});

  useEffect(() => {
    index(token, "/department").then(({ data }) => {
      setCargos(data);
    });
    index(token, "/roles").then(({ data }) => {
      setRoles(data);
    });
    show(token, "/departmentRoles", data.id).then(({ data }) => {
      setDepartmentRoles(data);
    });
  }, [data.id, id, token]);

  const updateRole = e => {
    console.log(e);
    // update(token, "departmentRole", data.id, {}).then(({ data }) => {});
  };

  const columnsPermissions = [
    {
      title: "Cargo",
      dataIndex: "name"
    },
    {
      title: "Visualizar",
      dataIndex: "view",
      render: data => (
        <span>
          <Checkbox onChange={e => updateRole(e, data)} />
        </span>
      )
    },
    {
      title: "Criar",
      dataIndex: "add",
      render: data => (
        <span>
          <Checkbox />
        </span>
      )
    },
    {
      title: "Editar",
      dataIndex: "edit",
      render: data => (
        <span>
          <Checkbox />
        </span>
      )
    },
    {
      title: "Deletar",
      dataIndex: "delete",
      render: data => (
        <span>
          <Checkbox />
        </span>
      )
    }
    // {
    //   title: 'Ação',
    //   render: data => <span>Deletar</span>
    // }
  ];

  const returnView = () => {
    return (
      <Button type="primary" onClick={() => returnViewButton()}>
        Voltar
      </Button>
    );
  };

  return (
    <Card title={"Permissões de " + data.name} extra={returnView()}>
      <Table
        size="small"
        pagination={false}
        dataSource={roles}
        columns={columnsPermissions}
      />
    </Card>
  );
}

export default Permissions;
