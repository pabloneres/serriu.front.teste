import React, { useState, useEffect } from "react";
import {
  Card,
  Skeleton,
  Select,
  Table,
  Space,
  Tooltip,
  Button,
  Input,
  Form as FormNew
} from "antd";
import { index, destroy, store, update } from "~/services/controller";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
// import { Container } from './styles';
import { useHistory, useRouteMatch } from "react-router-dom";
import { FormRow, Notify } from "~/modules/global";
import {
  FolderOpenOutlined,
  DeleteOutlined,
  EditOutlined,
  DollarCircleOutlined
} from "@ant-design/icons";

const { Option } = Select;

export function Especialidades({ id }) {
  const { params, url } = useRouteMatch();
  const { selectedClinic } = useSelector(state => state.clinic);
  const [especialidade, setEspecialidade] = useState(undefined);
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadesOptions, setEspecialidadesOptions] = useState(undefined);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);

  const [comissaoVista, setComissaoVista] = useState(undefined);
  const [comissaoBoleto, setComissaoBoleto] = useState(undefined);

  useEffect(() => {
    index("especialidade").then(({ data }) => {
      setEspecialidadesOptions(
        data.map(item => ({
          label: item.name,
          value: item.id
        }))
      );

      setLoading(false);
    });
  }, [reload]);

  useEffect(() => {
    index(
      `especialidade_config?clinica_id=${selectedClinic.id}&dentista_id=${id ||
        params.id}`
    ).then(({ data }) => {
      setEspecialidades(data);
    });
  }, [id, params.id, selectedClinic.id, reload]);

  const handleCreate = () => {
    store(`/especialidade_config/${params.id}`, {
      clinica_id: selectedClinic.id,
      especialidade_id: especialidade,
      vista: comissaoVista,
      boleto: comissaoBoleto
    }).then(({ data }) => {
      setComissaoBoleto();
      setComissaoVista();
      setEspecialidade();
      setReload(!reload);
      return Notify("success", "Sucesso", "Atualizado com sucesso");
    });
  };

  const handleDelete = id => {
    destroy("especialidade_config", id).then(_ => {
      setEspecialidade();
      setReload(!reload);
      return Notify("success", "Sucesso", "Especialidade excluida");
    });
  };

  if (loading) {
    return (
      <Card>
        <Skeleton active={true} />
      </Card>
    );
  }

  const returnEspecialidadesOpt = () => {
    let options = especialidadesOptions;

    const filtered = value => {
      return !especialidades.find(
        item => item.especialidade_id === value.value
      );
    };

    let newOptions = options.filter(filtered);
    return newOptions;
  };

  return (
    <Card title="Especialidades">
      <div className="container-especialidades">
        <div
          className="select-especialidades"
          style={{ alignSelf: "self-start" }}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Selecione as Especialidades"
            options={returnEspecialidadesOpt()}
            value={especialidade}
            onChange={e => {
              setEspecialidade(e);
            }}
          />
          <div className="selected">
            <div className="config-select-especialidade">
              <FormRow columns={2}>
                <FormNew.Item label="A vista">
                  <Input
                    type="number"
                    placeholder="Ex: 50 => 50%"
                    onChange={e => setComissaoVista(e.target.value)}
                    value={comissaoVista}
                    disabled={!especialidade}
                    suffix="%"
                  />
                </FormNew.Item>
                {selectedClinic.config.workBoletos ? (
                  <FormNew.Item label="Boleto">
                    <Input
                      type="number"
                      placeholder="Ex: 50 => 50%"
                      onChange={e => setComissaoBoleto(e.target.value)}
                      value={comissaoBoleto}
                      disabled={!especialidade}
                      suffix="%"
                    />
                  </FormNew.Item>
                ) : (
                  <></>
                )}
              </FormRow>
            </div>
            <Button onClick={() => handleCreate()} disabled={!especialidade}>
              Selecionar
            </Button>
          </div>
        </div>
        <div className="selected-especialidades">
          <Table
            rowKey="id"
            columns={[
              {
                title: "Especialidade",
                dataIndex: "especialidade",
                render: data => <span>{data.name}</span>
              },
              {
                title: "% - À vista",
                dataIndex: "vista",
                render: data => <span>{data}%</span>
              },
              {
                title: "% - Boleto",
                dataIndex: "boleto",
                render: data => <span>{data}%</span>
              },
              {
                title: "Ações",
                classes: "text-right pr-0",
                render: data => (
                  <Space size="middle">
                    <Tooltip placement="top" title="Excluir">
                      <span
                        onClick={() => handleDelete(data.id)}
                        style={{ cursor: "pointer" }}
                        className="svg-icon menu-icon"
                      >
                        <DeleteOutlined twoToneColor="#eb2f96" />
                      </span>
                    </Tooltip>
                  </Space>
                )
              }
            ]}
            dataSource={especialidades}
          />
        </div>
      </div>
    </Card>
  );
}
