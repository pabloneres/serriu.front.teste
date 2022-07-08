import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import {
  ToolOutlined,
  MenuOutlined,
  CalendarOutlined,
  SmileOutlined,
  DollarOutlined,
  UserOutlined,
  InfoCircleOutlined,
  RobotOutlined
} from "@ant-design/icons";

import Dentista from "~/components/created/usuarios/dentistas/EditarDentistaPage";
import Recepcionista from "~/components/created/usuarios/recepcionista/EditarRecepcionistaPage";

function Profile() {
  const { selectedClinic } = useSelector(state => state.clinic);
  const { user } = useSelector(state => state.auth);

  switch (user.department_id) {
    case "dentista":
      return <Dentista id={user.id} />;
      break;
    case "recepcionista":
      return <Recepcionista id={user.id} />;
      break;

    default:
      break;
  }

  return <span>teste</span>;
}

export default Profile;
