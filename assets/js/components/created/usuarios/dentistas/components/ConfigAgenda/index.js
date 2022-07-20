import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from "react-inlinesvg";
import { Link } from "react-router-dom";
import { index, destroy, store, update, show } from "~/controllers/controller";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { Modal, Button, Form, Col, InputGroup } from "react-bootstrap";
import { useFormik } from "formik";
import api from "~/services/api";
import * as Yup from "yup";


import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody
} from "~/_metronic/_partials/controls";

import { DropdownMenu1 } from "~/_metronic/_partials/dropdowns";

import "./styles.css";
import daysJson from "./days.json";

const labelsDay = {
  0: "Domingo",
  1: "Segunda",
  2: "Terça",
  3: "Quarta",
  4: "Quinta",
  5: "Sexta",
  6: "Sabádo",
  almoco: "Almoço"
};

export default function ConfigurarAgenda({ id }) {
  const { params } = useRouteMatch();
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);
  const history = useHistory();
  const [days, setDays] = useState([]);
  const [agendaConfig, setAgendaConfig] = useState(undefined);
  const [reload, setReload] = useState(false);
  const [needCreate, setNeedCreate] = useState(undefined);
  const [showCreate, setShowCreate] = useState(undefined);
  const [selectMenu, setSelectMenu] = useState("horarios");

  useEffect(() => {
    show(token, "/agendaDentista", id || params.id).then(({ data }) => {
      if (!data) {
        setNeedCreate(true);
        setShowCreate(true);
        setDays([]);
        return;
      }

      setNeedCreate(false);
      setShowCreate(false);
      setDays(data.days);
      setAgendaConfig(data);
    });
  }, [id, params.id, reload, selectedClinic.id, token]);

  const changeDay = (element, e, item) => {
    let daysNew = days;
    let scale = null;
    let data;
    let teste = daysNew.indexOf(item);

    console.log(daysNew);
    console.log(scale);
    console.log(data);
    console.log(teste);

    if (teste === -1 && element !== "scale") {
      console.log("error");
      return;
    }

    if (element === "check") {
      data = e.target.checked;
      daysNew[teste] = { ...daysNew[teste], enable: data };
    }
    if (element === "start") {
      data = e.target.value;
      daysNew[teste] = { ...daysNew[teste], start: data };
    }
    if (element === "end") {
      data = e.target.value;
      daysNew[teste] = { ...daysNew[teste], end: data };
    }
    if (element === "scale") {
      data = e.target.value;
      daysNew = null;
      scale = data;
    }

    update(token, "agendaDentista", params.id, {
      days: daysNew,
      scale
    }).then(() => {
      notify("Agenda alterada", "success", 1000);
      setReload(!reload);
    });
  };

  const createAgenda = () => {
    setShowCreate(false);
    store(token, "/agendaDentista", {
      days: daysJson,
      user_id: params.id
    }).then(() => {
      notify("Agenda Criada", "success", 1000);
      setReload(!reload);
    });
  };

  return (
    <Card>
      <CardBody className="card-body-agenda">
        <div className="container-all">
          <div className="container">
            <Card>
              <CardHeader title="Opções">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              {needCreate && showCreate ? (
                <CardBody>
                  <h6>Você ainda não tem uma configuração de agenda!</h6>

                  <div>
                    <Button onClick={() => createAgenda()}>Criar</Button>
                  </div>
                </CardBody>
              ) : (
                <></>
              )}

              {!needCreate ? (
                <ul className="ul_button_config">
                  <li
                    className={`button_config ${selectMenu === "horarios" ? "active_button" : ""
                      }`}
                    onClick={() => setSelectMenu("horarios")}
                  >
                    Horarios
                  </li>
                  <li
                    className={`button_config ${selectMenu === "escala" ? "active_button" : ""
                      }`}
                    onClick={() => setSelectMenu("escala")}
                  >
                    Escala
                  </li>
                </ul>
              ) : (
                <></>
              )}
            </Card>
          </div>
          <div className="container">
            <Card>
              <CardHeader title="Seleção de Horarios">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {!needCreate && selectMenu === "horarios" ? (
                  <div className="container-select-days">
                    {days.map(item => (
                      <div className="select-day" key={item.day}>
                        <div className="day-of-week">
                          <Form.Check
                            type="checkbox"
                            className="select-day-check"
                            defaultChecked={item.enable}
                            onChange={e => {
                              changeDay("check", e, item);
                            }}
                          />
                          <span>{labelsDay[item.day]}</span>
                        </div>

                        <div className="hours-of-day">
                          <div className="startHour">
                            <div className="containerHour">
                              <Form.Control
                                type="time"
                                className="form-control-hour-agenda"
                                defaultValue={item.start}
                                onChange={e => {
                                  changeDay("start", e, item);
                                }}
                              />
                            </div>
                          </div>
                          <span className="separator-hours"> ás </span>
                          <div className="endHour">
                            <div className="containerHour">
                              <Form.Control
                                className="form-control-hour-agenda"
                                type="time"
                                defaultValue={item.end}
                                onChange={e => {
                                  changeDay("end", e, item);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : selectMenu === "escala" ? (
                  <div className="select-day">
                    <Form.Group as={Col} controlId="formGridAddress1">
                      <Form.Label>Escala de Hórario</Form.Label>
                      <Form.Control
                        as="select"
                        placeholder="Selecione a escala em minutos"
                        aria-describedby="inputGroupPrepend"
                        onChange={e => {
                          changeDay("scale", e);
                        }}
                        defaultValue={
                          agendaConfig ? agendaConfig.scale : undefined
                        }
                      >
                        <option value={15}>15 Minutos</option>
                        <option value={30}>30 Minutos</option>
                        {/* <option value={45}>45 Minutos</option> */}
                        <option value={60}>60 Minutos</option>
                      </Form.Control>
                    </Form.Group>
                  </div>
                ) : (
                  <></>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
