import React, { useEffect, useState, useRef, useContext } from 'react';
import {
  Container,
  AList,
  ListContainer,
  Span,
  AInputNumber,
  ContainerAll,
  AButton
} from './styles';


import { Table, Form, Input, InputNumber, Popconfirm, Typography } from 'antd'

import { index, store } from '~/controllers/controller'
import { useSelector } from 'react-redux'
import { relativeTimeRounding } from 'moment';

function Descontos(props) {
  const { token } = useSelector(state => state.auth)
  const { selectedClinic } = useSelector(state => state.clinic)
  const [form] = Form.useForm();
  const [cargos, setCargos] = useState([])
  const [values, setValues] = useState({})
  const [editingKey, setEditingKey] = useState('');

  const [reload, setReload] = useState(false)

  const isEditing = (record) => record.id === editingKey;

  useEffect(() => {
    index(token, '/department').then(({ data }) => {
      let departments = data.map(item => ({ ...item, discount: 0 }))

      index(token, `/departmento_desconto?clinic_id=${selectedClinic.id}`).then(({ data }) => {
        departments.forEach(department => {
          data.forEach(item => {
            const index = departments.findIndex(dep => dep.id === item.department_id)

            if (index === -1) {
              return
            }

            departments[index] = {
              name: departments[index].name,
              id: item.department_id,
              discount: item.discount
            }

          })
        })
        setCargos(departments)
      })
    })
  }, [reload])

  useEffect(() => {
    console.log(values)
  }, [values])

  const handleSave = (row, key) => {
    const dataSend = {
      discount: row.discount,
      department_id: key,
    }

    store(token, `/departmento_desconto/${selectedClinic.id}`, dataSend).then(() => {
      setReload(!relativeTimeRounding)
    })
  }

  const send = () => {
    console.log(values)
  }

  const columns = [
    {
      title: 'Cargo',
      dataIndex: 'name',
    },
    {
      title: 'Desconto máximo',
      dataIndex: 'discount',
      editable: true,
      render: data => <span>{data} %</span>
    },
    {
      title: 'Ações',
      width: '250px',
      render: (data) => {
        const editable = isEditing(data);
        return editable ? (
          <span>
            <Popconfirm title="Deseja salvar ?" onConfirm={() => save(data.id)}>
              <AButton type="primary" style={{ marginRight: 10 }}>Salvar</AButton>
            </Popconfirm>
            <Popconfirm title="Deseja cancelar ?" onConfirm={cancel}>
              <AButton>Cancelar</AButton>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(data)}>
            Editar
          </Typography.Link>
        );
      },
    },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'discount' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...cargos];
      const index = newData.findIndex((item) => key === item.id);

      handleSave(row, key)

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        console.log(newData)
        setCargos(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        console.log(newData)
        setCargos(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const edit = (data) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...data,
    });
    setEditingKey(data.id);
  };

  return (
    <Container title="Descontos">
      <ContainerAll>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={cargos}
            columns={mergedColumns}
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
      </ContainerAll>
    </Container>
  )
}

export default Descontos;

const Extra = (props) => {
  return (
    <AButton onClick={() => props.send()} type="primary">Salvar</AButton>
  )
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber max={100} /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};