import api from '../services/api'

// DEFINIR AS ROTAS DAS CLINICAS
const INDEX_CLINICS_URL = "/orcamento/data";

const GET_ORCAMENTOS_URL = "/list_orcamentos";

const GET_ORCAMENTOS_APROVADOS = "/list_orcamentos_aprovados";
const GET_ORCAMENTOS_EXECUTADOS = "/list_orcamentos_executados";
const GET_ORCAMENTOS_ABERTO = "/list_orcamentos_aberto";

const GET_PROCEDIMENTOS_URL = "/procedimento";

const SHOW_CLINIC_URL = "/orcamentos";

const SHOW_EDIT = "/orcamento_edit";

const STORE_CLINIC_URL = "/orcamentos";

const UPDATE_CLINIC_URL = "/orcamentos";

const UPDATE_APROVAR = "/orcamento_aprovar";

const DESTROY_CLINIC_URL = "/orcamentos";

const UPDATE_APROVADO = "orcamento_aprovado"

export function index(authToken) {
  return api.get(`${INDEX_CLINICS_URL}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function indexAprovados(authToken, id) {
  return api.get(`${GET_ORCAMENTOS_APROVADOS}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}
export function indexExecutados(authToken, id) {
  return api.get(`${GET_ORCAMENTOS_EXECUTADOS}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function indexOrcamentosAbertos(authToken) {
  return api.get(`${GET_ORCAMENTOS_ABERTO}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function getProcedimentos(authToken, id) {
  return api.get(`${GET_PROCEDIMENTOS_URL}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function orcamento(authToken, id) {
  return api.get(`${GET_ORCAMENTOS_URL}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function show(authToken, id) {
  return api.get(`${SHOW_CLINIC_URL}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function show_edit(authToken, id) {
  return api.get(`${SHOW_EDIT}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}

export function store(authToken, data) {
  return api.post(STORE_CLINIC_URL, data, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  });
}

export function update(authToken, id, data) {
  return api.put(`${UPDATE_CLINIC_URL}/${id}`, data, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  });
}

export function updateAprovado(authToken, id, data) {
  return api.put(`${UPDATE_APROVADO}/${id}`, data, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  });
}

export function aprovar(authToken, id, data) {

  return api.get(`${UPDATE_APROVAR}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  });
}

export function destroy(authToken, id) {
  // Authorization head should be fulfilled in interceptor.
  return api.delete(`${DESTROY_CLINIC_URL}/${id}`, {
    headers: {
      Authorization: 'Bearer ' + authToken
    }
  })
}