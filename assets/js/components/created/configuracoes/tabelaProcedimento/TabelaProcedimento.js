import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { index, destroy, store, update } from '~/controllers/controller'
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { useFormik } from "formik";
// import Select from 'react-select';
import * as Yup from "yup";
import { Form, Input, Radio, Select, Row, Card, Button, Modal, Table, Space, Popconfirm } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { RowForm } from './styles'
import InputCurrency from '~/utils/Currency'
import { convertMoney } from '~/modules/Util'

function TabelaProcedimento() {
  const { params, url } = useRouteMatch()
  const { token } = useSelector((state) => state.auth);
  const { selectedClinic } = useSelector((state) => state.clinic);
  const [name, setName] = useState('')
  const [logout, setLogout] = useState(false)
  const [show, setShow] = useState(false);
  const [reload, setReload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [labs, setLabs] = useState([]);
  const [tableEdit, setTableEdit] = useState(undefined);
  const history = useHistory();
  const [tabelas, setTabelas] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [procedimentos, setProcedimentos] = useState([])
  const [reqLab, setReqLab] = useState(undefined)
  const [labId, setLabId] = useState(undefined)
  const [services, setServices] = useState([])

  const [loading, setLoading] = useState(true)

  const [fields, setFields] = useState(undefined)


  const handleSubmit = () => {
    if (fields.requerLab === 0) {
      fields.labsService = null
    }

    if (fields.id) {
      update(token, '/procedimento', fields.id, fields)
        .then(() => {
          setFields(undefined)
          setReload(!reload)
        })
        .catch((err) => {
        })
    } else {
      fields.tabela_id = params.id
      store(token, '/procedimento', fields)
        .then(() => {
          setFields(undefined)
          setReload(!reload)
        })
        .catch((err) => {
          return
        })
    }
  }

  useEffect(() => {
    setLoading(true)
    index(token, `/preco?id=${selectedClinic.id}`)
      .then(({ data }) => {
        const serialiazedItems = data.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
        setTabelas(serialiazedItems)
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setLogout(true)
        }
      })
    index(token, '/especialidade')
      .then(({ data }) => {
        const serialiazedItems = data.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
        setEspecialidades(serialiazedItems)
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setLogout(true)
        }
      })

    index(token, `/procedimento?id=${params.id}`)
      .then(({ data }) => {
        setProcedimentos(data)
      })
    index(token, `/laboratorio?clinic_id=${selectedClinic.id}`).then(({ data }) => {
      setLabs(data)
    })
    setLoading(false)
  }, [show, reload])

  useEffect(() => {
    if (labId) {
      index(token, `laboratorioServicos?laboratorio_id=${labId}`).then(({ data }) => {
        setServices(data)
      })
    }
  }, [labId])

  if (logout) {
    return <Redirect to="/logout" />
  }

  function handleDelete(id) {
    destroy(token, '/procedimento', id).then(() => {
      setReload(!reload)
    })
  }

  function handleEdit(data) {
    console.log(data)
    setFields(data)
  }

  return (
    <Card
      title="Procedimentos"
      extra={
        <Button
          type="primary"
          onClick={() => setFields({
            name: undefined,
            valor: undefined,
            geral: undefined,
            especialidade_id: undefined,
            requerLab: undefined,
            lab_id: undefined,
            labsService: undefined,
          })}
        >Adicionar procedimento</Button>
      }
    >
      <Modal
        onCancel={() => {
          setFields(undefined)
          setShow(false)
        }}
        cancelButtonProps={{
          onClick: () => {
            setFields(undefined)
          }
        }}
        okButtonProps={{
          onClick: () => handleSubmit()
        }}
        title="Cadastrar procedimento"
        visible={fields ? true : false}
        width={1000}
      >
        {
          fields ?
            <Form layout="vertical">
              <RowForm columns={2}>
                <Form.Item label="Nome" required>
                  <Input
                    value={fields.name}
                    onChange={e => setFields({ ...fields, name: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label="Valor" required>
                  <InputCurrency
                    value={fields.valor}
                    onChange={e => setFields({ ...fields, valor: e })}
                  />
                </Form.Item>
              </RowForm>

              <RowForm columns={2}>
                <Form.Item label="Geral" required>
                  <Radio.Group
                    value={fields.geral}
                    onChange={e => setFields({ ...fields, geral: e.target.value })}
                    options={[
                      {
                        label: 'Sim',
                        value: 1
                      },
                      {
                        label: 'Não',
                        value: 0
                      }
                    ]}
                  />
                </Form.Item>
                <Form.Item label="Especialidade" required>
                  <Select
                    value={fields.especialidade_id}
                    onChange={e => setFields({ ...fields, especialidade_id: e })}
                    options={especialidades}
                  />
                </Form.Item>
              </RowForm>

              <RowForm columns={2}>
                <Form.Item label="Requer Laboratorio" required>
                  <Radio.Group
                    value={fields.requerLab}
                    onChange={e => setFields({ ...fields, requerLab: e.target.value })}
                    options={[
                      {
                        label: 'Sim',
                        value: 1
                      },
                      {
                        label: 'Não',
                        value: 0
                      }
                    ]}
                  />
                </Form.Item>
                <Form.Item label="Laboratório" required>
                  <Select
                    disabled={!fields.requerLab}
                    value={fields.lab_id}
                    onChange={e => {
                      setFields({ ...fields, lab_id: e })
                      setLabId(e)
                    }}
                    options={labs.map(item => ({
                      label: item.name,
                      value: item.id
                    }))}
                  />
                </Form.Item>
              </RowForm>

              <RowForm columns={2} >
                <Form.Item label="Serviços" required>
                  <Select
                    disabled={!fields.requerLab}
                    value={fields.labsService}
                    onChange={e => setFields({ ...fields, labsService: e })}
                    options={services.map(item => ({
                      label: item.name,
                      value: item.id
                    }))}
                  />
                </Form.Item>
              </RowForm>
            </Form> : <></>
        }
        {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            //     <Button htmlType="submit" type="primary" >Enviar</Button>
            //     <Button onClick={() => {
            //       setTableEdit(undefined)
            //       setShow(false)
            //     }} type="secundary" style={{ marginLeft: 10 }} >Cancelar</Button>
            //   </div> */}
      </Modal>
      <Table
        loading={loading}
        bordered
        size="small"
        rowKey="id"
        columns={[
          {
            title: 'Nome',
            dataIndex: 'name',
          },
          {
            title: 'Especialidade',
            dataIndex: 'especialidade',
            render: data => <span>{data.name}</span>
          },
          {
            title: 'Valor',
            dataIndex: 'valor',
            render: data => <span>{convertMoney(data)}</span>
          },
          {
            title: 'Ações',
            width: 80,
            render: data => (
              <Space>
                <span onClick={() => { handleEdit(data) }} style={{ "cursor": "pointer" }} className="svg-icon menu-icon">
                  <EditOutlined />
                </span>
                <Popconfirm title="Deseja excluir ?" onConfirm={() => handleDelete(data.id)}>
                  <span style={{ "cursor": "pointer" }} className="svg-icon menu-icon">
                    <DeleteOutlined />
                  </span>
                </Popconfirm>
              </Space>
            )
          }
        ]}
        dataSource={procedimentos}
      />
    </Card >
  );
}

export default TabelaProcedimento