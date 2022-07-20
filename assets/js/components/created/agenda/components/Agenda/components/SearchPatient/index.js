import React, { useState, useEffect } from "react";

// import { Container } from './styles';
import { index } from "~/services/controller";
import { Empty, Select } from "antd";
import { useSelector } from "react-redux";

const { Option } = Select;

function SearchPatient({ setSearchPaciente }) {
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);

  const [pacientes, setPacientes] = useState([]);
  const [paciente, setPaciente] = useState();

  function search(e) {
    index("patient", { id: selectedClinic.id, name: e })
      .then(({ data }) => {
        setPacientes(data);
      })
      .catch(err => { });
  }

  function handleChange(e) {
    setPaciente(e);
    setSearchPaciente(e);
  }

  return (
    <Select
      style={{ width: "200px" }}
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
      {pacientes.map((item, index) => (
        <Option key={index} value={item.id}>
          {item.firstName} {item.lastName}
        </Option>
      ))}
    </Select>
  );
}

export default SearchPatient;
