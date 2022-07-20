export const colorStatus = status => {
    switch (status) {
        case "agendado":
            return "#FDFFCC";
        case "confirmado":
            return "#CCFFD3";
        case "cancelado_paciente":
            return "#FED1D1";
        case "cancelado_dentista":
            return "#D3ABFB";
        case "atendido":
            return "#81F991";
        case "nao_compareceu":
            return "#ff9e6e";
        default:
            return "#fff";
    }
};

export const returnTag = tipo => {
    switch (tipo) {
        case "retorno":
            return { color: "orange", text: "Retorno" };
        case "avaliacao":
            return { color: "green", text: "Avaliação" };
        default:
            return { color: "#fff", text: "" };
    }
};
