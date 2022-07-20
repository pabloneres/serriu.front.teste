export default function scheduler(
    state = {
      currentWeek: new Date(),
      agendamentos: [],
      agendaConfig: {},
      days: [],
      dentistas: [],
      recepcionistas: [],
      loading: true,
      reload: false,
      selectedDate: undefined,
      editCliente: undefined,
      appointment: undefined,
      chatData: undefined,
      filters: {},
    },
    action
  ) {
    switch (action.type) {
      case "UPDATE_APPOINTMENT": 
        let agendamentosList = state.agendamentos
  
        let id = agendamentosList.findIndex(item => item.id === Number(action.payload.id))
        
        let newAgendamento = {
          ...agendamentosList[id],
          ...action.payload
        }
  
        agendamentosList[id] = newAgendamento
      
        return {...state, agendamentos: agendamentosList}
      case "FIRST_LOAD":
        return {
          ...state,
          agendamentos: action.payload.agendamentos,
          dentistas:action.payload.dentistas,
          recepcionistas:action.payload.recepcionistas,
          loading: false
        }
      case "CHANGE_CURRENT":
        return { ...state, currentWeek: action.payload };
      case "CHANGE_CONFIG":
        return { ...state, agendaConfig: action.payload };
      case "CHANGE_DAYS":
        return { ...state, days: action.payload };
      case "CHANGE_AGENDAMENTOS":
        return { ...state, agendamentos: action.payload };
      case "CHANGE_DENTISTAS":
        return { ...state, dentistas: action.payload };
      case "CHANGE_RECEPCIONISTAS":
        return { ...state, recepcionistas: action.payload };
      case "CHANGE_LOADING":
        return { ...state, loading: action.payload };
      case "CHANGE_RELOAD":
        return { ...state, reload: !state.reload };
      case "RELOAD":
        return { ...state, reload: !state.reload };
      case "SELECTED_DATE":
        return { ...state, selectedDate: action.payload };
      case "EDIT_CLIENT":
        return { ...state, editCliente: action.payload };
      case "ADD_CLIENT":
        return { ...state, addCliente: action.payload };
      case "CHANGE_APPOINTMENT":
        return { ...state, appointment: action.payload };
      case "CHANGE_FILTERS":
        return { ...state, filters: action.payload };
      case "OPEN_CHAT":
        return { ...state, chatData: action.payload };
      default:
        return state;
    }
  }
  