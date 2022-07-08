import React, { useEffect, useState } from "react";

// import { Container } from './styles';
import { useSelector } from "react-redux";
import { Table, Tag } from "antd";
import { index } from "~/controllers/controller";
import moment from "moment";

import colorAgendamento from "~/utils/colorAgendamento.js";
import { convertMoney, convertDate } from "~/modules/Util";

function Agendamentos() {
  const { token } = useSelector(state => state.auth);
  const { params } = useRouteMatch();

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    index(token, `log_agendamento?paciente_id=${params.id}`).then(
      ({ data }) => {
        setLogs(data);
      }
    );
  }, [params.id, token]);

  const returnDiff = (start, end) => {
    let startDate = moment(start);
    let endDate = moment(end);

    var duration = moment.duration(endDate.diff(startDate)).asMinutes();
    return duration;
  };

  const returnAction = action => {
    switch (action) {
      case "create":
        return "Criar";
      case "edit":
        return "Editar";
      case "delete":
        return "Delete ";
    }
  };

  const columns = [
    {
      title: "Agendamento ID",
      dataIndex: "id"
    },
    {
      title: "Agendador",
      dataIndex: "agendador",
      render: data => (
        <span>
          {data.firstName} {data.lastName}
        </span>
      )
    },
    {
      title: "Dentista",
      dataIndex: "dentista",
      render: data => (
        <span>
          {data.firstName} {data.lastName}
        </span>
      )
    },
    {
      title: "Inicio",
      render: data => <span>{convertDate(data.startDate)}</span>
    },
    {
      title: "Término",
      render: data => <span>{convertDate(data.endDate)}</span>
    },
    {
      title: "Duração",
      render: data => <span>{returnDiff(data.startDate, data.endDate)}m</span>
    },
    {
      title: "Status",
      dataIndex: "status",
      render: data => (
        <Tag color={colorAgendamento(data).color}>
          {colorAgendamento(data).label}
        </Tag>
      )
    },
    {
      title: "Ação",
      dataIndex: "action"
    }
  ];

  const innerColumns = [
    {
      title: "Editado por",
      dataIndex: "usuario",
      render: data => (
        <span>
          {data.firstName} {data.lastName}
        </span>
      )
    },
    {
      title: "Açao",
      dataIndex: "action",
      render: data => <span>{returnAction(data)}</span>
    },
    {
      title: "Inicio",
      dataIndex: "new",
      render: data => <span>{convertDate(data.startDate)}</span>
    },
    {
      title: "Término",
      dataIndex: "new",
      render: data => <span>{convertDate(data.endDate)}</span>
    },
    {
      title: "Duração",
      dataIndex: "new",
      render: data => <span>{returnDiff(data.startDate, data.endDate)}m</span>
    },
    {
      title: "Status",
      dataIndex: "new",
      render: data =>
        data.status ? (
          <Tag color={colorAgendamento(data.status).color}>
            {colorAgendamento(data.status).label}
          </Tag>
        ) : (
          "-"
        )
    }
  ];

  return (
    <Table
      rowKey="id"
      size="small"
      columns={columns}
      dataSource={logs}
      expandable={{
        rowExpandable: record => record.logs.length > 0,
        expandedRowRender: (record, index, indent, expanded) => (
          <Table
            rowKey="id"
            size="small"
            columns={innerColumns}
            dataSource={record.logs}
            pagination={false}
          />
        )
      }}
    />
  );
}

export default Agendamentos;
