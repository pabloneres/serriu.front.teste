import React from "react";

// import { Container } from './styles';

function ContentModal({ type = "add" }) {
  if (type === "add") {
    return (
      <Container>
        <Form layout="vertical">
          <Form.Item label="Paciente">
            <ContainerEdit>
              {/* <Select
              showSearch
              placeholder="Selecione o paciente..."
              optionFilterProp="children"
              filterOption={false}
              onSearch={searchPatient}
              onChange={handleChangePaciente}
            >
              {options}
            </Select> */}
              <Select
                showSearch
                value={paciente}
                placeholder="Buscar paciente"
                // style={this.props.style}
                showArrow={false}
                filterOption={false}
                onSearch={search}
                onChange={handleChange}
                allowClear
                notFoundContent={null}
              >
                {pacientes.map(item => (
                  <Option value={item.id}>
                    {item.firstName} {item.lastName}
                  </Option>
                ))}
                {pacientes.length === 0 && searchText ? (
                  <Option value={0}>
                    <i
                      role="img"
                      class="fas fa-user-plus"
                      style={{ color: "green", marginRight: 5 }}
                    ></i>
                    <span style={{ fontWeight: "bold" }}>{searchText}</span>
                  </Option>
                ) : (
                  <></>
                )}
              </Select>
              <EditButton
                type="primary"
                disabled={!novoAgendamento.paciente_id}
                onClick={e => setEditCliente(novoAgendamento.paciente_id)}
              >
                Editar
              </EditButton>
            </ContainerEdit>
          </Form.Item>
          <Form.Item label="Dentista">
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) => {
                // console.log(option)
                return (
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
              value={novoAgendamento.dentista_id}
              options={dentistas.map(item => ({
                label: `${item.firstName} ${item.lastName}`,
                value: item.id
              }))}
              onChange={e => {
                loadAgenda(e);
                setNovoAgendamento({ ...novoAgendamento, dentista_id: e });
              }}
            />
          </Form.Item>
          <Form.Item label="Tipo">
            <Select
              value={novoAgendamento.tipo}
              placeholder="Selecione o tipo de agendamento..."
              options={[
                {
                  label: "Avaliação",
                  value: "avaliacao"
                },
                {
                  label: "Retorno",
                  value: "retorno"
                }
              ]}
              onChange={e => {
                setNovoAgendamento({ ...novoAgendamento, tipo: e });
              }}
            />
          </Form.Item>
          <Form.Item label="Status">
            <Select
              value={novoAgendamento.status}
              options={[
                {
                  label: "Agendado",
                  value: "agendado"
                },
                {
                  label: "Confirmado",
                  value: "confirmado"
                },
                {
                  label: "Cancelado pelo paciente",
                  value: "cancelado_paciente"
                },
                {
                  label: "Cancelado pelo dentista",
                  value: "cancelado_dentista"
                },
                {
                  label: "Atendido",
                  value: "atendido"
                },
                {
                  label: "Não compareceu",
                  value: "nao_compareceu"
                }
              ]}
              onChange={e => {
                setNovoAgendamento({ ...novoAgendamento, status: e });
              }}
            />
          </Form.Item>
          <Form.Item label="Início">
            <FormRow columns={3}>
              <DatePicker value={moment(novoAgendamento.startDate)} disabled />
              <TimePicker
                value={moment(novoAgendamento.startDate)}
                onChange={e =>
                  setNovoAgendamento({ ...novoAgendamento, startDate: e })
                }
              />
              <TimePicker
                value={moment(novoAgendamento.endDate)}
                onChange={e =>
                  setNovoAgendamento({ ...novoAgendamento, endDate: e })
                }
              />
            </FormRow>
          </Form.Item>
          <Form.Item label="Obs">
            <FormRow columns={1}>
              <TextArea
                onChange={e => {
                  setNovoAgendamento({
                    ...novoAgendamento,
                    obs: e.target.value
                  });
                }}
              />
            </FormRow>
          </Form.Item>
        </Form>
      </Container>
    );
  }
}

export default ContentModal;
