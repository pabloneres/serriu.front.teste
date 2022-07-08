import React, { useState, useEffect } from "react";

import { Container, ButtonsFilter, ButtonText } from "./styles";
import { Button, Dropdown } from "antd";
// import TextField from "@mui/material/TextField";
// import DateRangePicker from "@mui/lab/DateRangePicker";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import Box from "@mui/material/Box";
// import DateFnsUtils from "@date-io/date-fns";
// import { ptBR } from "date-fns/locale";
import moment from "moment";
import "./styles.css";

function Filters({ show, setShow, setFilter }) {
  const [date, setDate] = useState([null, null]);
  const [query, setQuery] = useState({});

  useEffect(() => {
    let data = {
      startDate: moment(date[0]).format("YYYY-MM-DD"),
      endDate: moment(date[1]).format("YYYY-MM-DD")
    };

    changeQuery(data);
  }, [changeQuery, date]);

  const changeQuery = data => {
    setQuery({ ...query, ...data });
  };

  const handleFilter = () => {
    let filter = new URLSearchParams(query).toString();
    setFilter(filter);
  };

  const handleClear = () => {
    setFilter();
    setQuery({});
  };

  return (
    <Dropdown
      overlay={
        <Container>
          <ButtonsFilter>
            <ButtonText onClick={() => handleClear()}>Limpar</ButtonText>
            <ButtonText onClick={handleFilter}>Filtrar</ButtonText>
          </ButtonsFilter>

          {/* <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
            <DateRangePicker
              startText="Início"
              endText="Término"
              value={date}
              onChange={newValue => {
                setDate(newValue);
              }}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField {...startProps} />
                  <Box sx={{ mx: 1 }}> até </Box>
                  <TextField {...endProps} />
                </React.Fragment>
              )}
            />
          </LocalizationProvider> */}
        </Container>
      }
      trigger={["click"]}
      visible={show}
      onVisibleChange={setShow}
    >
      <Button style={{ marginRight: 10 }} type="primary">
        Filtros
      </Button>
    </Dropdown>
  );
}

export default Filters;
