import React, { useEffect, useState } from "react";
import Permissions from "./components/permissions";
import { index } from "~/services/controller";
import { useSelector } from "react-redux";
import { Table, Card, Checkbox, Modal, Button, Form, Input } from "antd";

import { FormRow } from "~/modules/global";

import { store } from "~/controllers/controller";

import { Container, Aul, Ali } from "./styles";

function Cargos() {
  const [cargos, setCargos] = useState([]);
  const [reload, setReload] = useState(false);
  const [roles, setRoles] = useState([]);
  const [departmentRoles, setDepartmentRoles] = useState([]);
  const [editDepartment, setEditDepartment] = useState(undefined);

  const [newCargoInfo, setNewCargoInfo] = useState({});

  const [modalAdd, setModalAdd] = useState(false);

  useEffect(() => {
    index("/department").then(({ data }) => {
      setCargos(data);
    });
    index("/roles").then(({ data }) => {
      setRoles(data);
    });
    index("/departmentRoles").then(({ data }) => {
      setDepartmentRoles(data);
    });
  }, [reload]);

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
          <Checkbox />
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
    },
    {
      title: "Alterar permissões",
      dataIndex: "permissions",
      render: data => (
        <span>
          <Checkbox />
        </span>
      )
    },
    {
      title: "Ação",
      render: data => <span>Deletar</span>
    }
  ];

  const columnsCargo = [
    {
      title: "Cargo",
      dataIndex: "name"
    },
    {
      title: "Descrição",
      dataIndex: "description"
    },
    {
      title: "Ações",
      render: data => (
        <Button type="primary" onClick={() => setEditDepartment(data)}>
          Editar
        </Button>
      )
    }
  ];

  if (editDepartment) {
    return (
      <Permissions
        data={editDepartment}
        returnViewButton={() => setEditDepartment(undefined)}
      />
    );
  }

  const AddCargoButton = () => {
    return (
      <Button onClick={() => setModalAdd(true)} type="primary">
        Novo
      </Button>
    );
  };

  const handleCreate = () => {
    store("/department", newCargoInfo).then(data => {
      setModalAdd(false);
      setReload(!reload);
    });
  };

  return (
    <Card title="Cargos" extra={AddCargoButton()}>
      <Modal
        title="Adicionar cargo"
        visible={modalAdd}
        onCancel={() => setModalAdd(false)}
        onOk={() => handleCreate()}
      >
        <Form layout="vertical">
          <FormRow>
            <Form.Item label="Nome">
              <Input
                value={newCargoInfo.name}
                onChange={e =>
                  setNewCargoInfo({ ...newCargoInfo, name: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Descrição">
              <Input.TextArea
                value={newCargoInfo.description}
                onChange={e =>
                  setNewCargoInfo({
                    ...newCargoInfo,
                    description: e.target.value
                  })
                }
              />
            </Form.Item>
          </FormRow>
        </Form>
      </Modal>
      <Table size="small" dataSource={cargos} columns={columnsCargo} />
    </Card>
  );
}

export default Cargos;
