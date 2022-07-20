export function reload() {
  return {
      type: 'RELOAD',
  }
}

export function selected_date(data) {
  return {
    type: "SELECTED_DATE",
    payload: data
  }
}
