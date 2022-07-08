import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  notification,
  Space
} from "antd";
import { convertMoney } from "~/modules/Util";
import {
  DatabaseOutlined,
  DeleteOutlined,
  FolderOutlined
} from "@ant-design/icons";

import { Notify } from "~/modules/global";
import { destroy } from "~/controllers/controller";
import { useSelector } from "react-redux";
import "./styles.css";

import InputCurrency from "~/utils/Currency";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    // if (editing) {
    //   inputRef.current.focus();
    // }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`
          }
        ]}
      >
        <InputCurrency ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

function EditableTable({
  data,
  setDesconto,
  desconto,
  setSelecionado,
  update
}) {
  // const [selecionado, setSelecionado] = useState([]);
  const { token, user } = useSelector(state => state.auth);
  const [selectionType, setSelectionType] = useState("checkbox");

  const returnFaces = data => {
    if (data.length === 0) {
      return "";
    }

    return (
      <>
        {data.map(item => (
          <span style={{ color: "red", marginRight: 5 }}>{item.label}</span>
        ))}
      </>
    );
  };

  const columns = [
    {
      title: "Proc.",
      align: "center",
      dataIndex: "procedimento",
      render: data => <span>{data.name}</span>
    },
    {
      title: "Dente",
      align: "center",
      render: data => (
        <span>
          {data.dente ? data.dente : "Geral"}{" "}
          {data.faces ? returnFaces(data.faces) : <></>}
        </span>
      )
    },
    {
      title: "Valor un",
      align: "center",
      render: data => <span>{data.valor ? convertMoney(data.valor) : ""}</span>
    },
    {
      title: "Desc. (+)(-)",
      align: "center",
      editable: true,
      dataIndex: "desconto",
      render: data => (
        // <span>{convertMoney(data.valorTotal)}  (<span>{((data.valor - data.desconto) * 100 / data.valor).toFixed(2)}%</span>)</span>
        <span>{convertMoney(data)}</span>
      )
    },
    {
      title: "Fatura",
      align: "center",
      dataIndex: "negociacao_id"
    },
    {
      title: "Exec.",
      align: "center",
      dataIndex: "status_execucao",
      render: data => <span>{data}</span>
    },
    {
      title: "",
      align: "center",
      render: data => {
        if (data.negociacao_id) {
          return <></>;
        }
        return (
          <Space>
            <Popconfirm
              title="Deseja remover o procedimento ?"
              onConfirm={() => handleRemoveItem(data.id)}
            >
              <DeleteOutlined />
            </Popconfirm>
            {/* <FolderOutlined /> */}
          </Space>
        );
      }
    }
  ];

  const handleRemoveItem = id => {
    destroy(token, "procedimentoExecucao", id).then(_ => {
      update();
    });
  };

  const handleSave = row => {
    if (row.valorTotal > row.valor) {
      Notify("error", "Erro geral", "erro geral test");
      return;
    }

    console.log(row);

    setDesconto(row);
    // const newData = data;
    // const index = newData.findIndex((item) => row.key === item.id);
    // const item = newData[index];
    // newData.splice(index, 1, { ...item, ...row });
    // this.setState({
    //   dataSource: newData,
    // });
  };

  // const { dataSource } = this.state;
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  };
  const columnsNew = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave
      })
    };
  });

  const rowSelection = {
    onChange: (rowKey, selectedRows) => {
      setSelecionado(selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.negociacao_id
    })
  };

  const rowClassName = (row, index) => {
    if (row.status_pagamento === "pago") return "row-color-green";

    if (row.status_pagamento === "parcial") return "row-color-orange";
  };

  return (
    <Table
      size="small"
      pagination={false}
      components={components}
      // rowClassName={() => "editable-row"}
      dataSource={data.map(item => ({
        ...item,
        valorTotal: item.desconto === 0 ? item.valor : item.desconto,
        key: item.id
      }))}
      columns={columnsNew}
      rowClassName={rowClassName}
      rowSelection={
        setSelecionado
          ? {
            type: selectionType,
            ...rowSelection
          }
          : false
      }
    />
  );
}

export default EditableTable;

// components={componentsNew}
// columns={columnsNew}
// dataSource={data.procedimentos.map((item) => ({
//   ...item,
//   key: item.id,
// }))}
