import React from "react";

// import { Container } from './styles';
import { Modal } from "antd";

import DrawerAdd from "./DrawerAdd";

function DrawerDefault(props) {
  return (
    <Modal {...props}>
      <DrawerAdd />
    </Modal>
  );
}

export default DrawerDefault;
