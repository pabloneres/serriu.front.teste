import React, { useEffect, useState } from "react";

// import { Container } from './styles';
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Table, Tag } from "antd";
import { index } from "~/services/controller";
import moment from "moment";

import colorAgendamento from "~/utils/colorAgendamento.js";
import { convertMoney, convertDate } from "~/modules/Util";

function Agendamentos() {
  const { params } = useRouteMatch();

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    index("log_agendamento", {
      paciente_id: params.id
    }).then(
      ({ data }) => {
        setLogs(data);
      }
    );
  }, [params.id]);

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
      dataIndex: "agendamento_id"
    },
    {
      title: "Alterado por",
      dataIndex: "usuario",
      render: data => (
        <span>
          {data.firstName} {data.lastName}
        </span>
      )
    },
    {
      title: "Antes",
      dataIndex: "old",
      render: data => (
        <span>
          {data && data.startDate ? convertDate(data.startDate) : "-"}
        </span>
      )
    },
    {
      title: "Depois",
      dataIndex: "new",
      render: data => (
        <span>
          {data && data.startDate ? convertDate(data.startDate) : "-"}
        </span>
      )
    },

    {
      title: "Ação",
      dataIndex: "action",
      render: data => <span>{returnAction(data)}</span>
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

  return <Table rowKey="id" size="small" columns={columns} dataSource={logs} />;
}

export default Agendamentos;
