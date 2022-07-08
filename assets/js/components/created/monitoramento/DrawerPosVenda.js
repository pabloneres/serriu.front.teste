import React, { useState, useEffect, useCallback } from "react";

import { ContainerNewNote, ContainerButtonsNewNote } from "./styles";
import { index, store } from "~/services/controller";
import { Button, Drawer, Input } from "antd";
import CardNote from "./CardNote";

const { TextArea } = Input;
function DrawerPos({ searchNota, setSearchNota }) {
  const [notas, setNotas] = useState([]);
  const [newNote, setNewNote] = useState(false);
  const [nota, setNota] = useState();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (searchNota) {
      index("notasPosVenda", { agendamento_id: searchNota }).then(data => {
        setNotas(data);
      });
    }
  }, [searchNota, reload]);

  const handleClose = () => {
    setSearchNota(undefined);
  };

  const handleSaveNote = () => {
    store("notasPosVenda", {
      nota,
      agendamento_id: searchNota
    }).then(_ => {
      setNotas([]);
      setNota();
      setNewNote(false);
      setReload(!reload);
    });
  };

  return (
    <Drawer
      extra={
        <Button type="primary" onClick={() => setNewNote(true)}>
          Nova
        </Button>
      }
      width={500}
      visible={searchNota ? true : false}
      onClose={handleClose}
      destroyOnClose
      title="Notas"
    >
      {newNote ? (
        <ContainerNewNote>
          <TextArea
            onChange={e => setNota(e.target.value)}
            value={nota}
            style={{ marginBottom: 5 }}
          />
          <ContainerButtonsNewNote>
            <Button type="primary" onClick={handleSaveNote}>
              Salvar
            </Button>
            <Button
              style={{ marginLeft: 5 }}
              onClick={() => {
                setNota();
                setNewNote(false);
              }}
            >
              Cancelar
            </Button>
          </ContainerButtonsNewNote>
        </ContainerNewNote>
      ) : (
        ""
      )}
      {notas.map((item, index) => (
        <CardNote key={index} data={item} />
      ))}
    </Drawer>
  );
}

export default DrawerPos;
