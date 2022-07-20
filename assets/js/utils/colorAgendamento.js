export default function(status) {
  switch (status) {
    case "agendado":
      return { color: "#FDFFCC", label: "Agendado" };
    case "confirmado":
      return { color: "#67D7FD", label: "Confirmado" };
    case "cancelado_paciente":
      return { color: "#FED1D1", label: "C. pelo paciente" };
    case "cancelado_dentista":
      return { color: "#D3ABFB", label: "C. pelo dentista" };
    case "atendido":
      return { color: "#65EDC1", label: "Atendido" };
    case "nao_compareceu":
      return { color: "#ff9e6e", label: "Não compareceu" };
    default:
      return { color: "#fff", label: "" };
  }
}
