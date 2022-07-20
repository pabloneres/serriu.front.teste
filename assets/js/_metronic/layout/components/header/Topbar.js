import React, { useMemo } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { QuickUserToggler } from "../extras/QuiclUserToggler";
import { Select as SelectHtml } from 'antd'

import { useSelector, useDispatch } from 'react-redux'

export function Topbar({ history }) {
  const { clinics, selectedClinic } = useSelector(state => state.clinic)
  const { dentists } = useSelector(state => state.dentist)
  const { token } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      viewSearchDisplay: objectPath.get(
        uiService.config,
        "extras.search.display"
      ),
      viewNotificationsDisplay: objectPath.get(
        uiService.config,
        "extras.notifications.display"
      ),
      viewQuickActionsDisplay: objectPath.get(
        uiService.config,
        "extras.quick-actions.display"
      ),
      viewCartDisplay: objectPath.get(uiService.config, "extras.cart.display"),
      viewQuickPanelDisplay: objectPath.get(
        uiService.config,
        "extras.quick-panel.display"
      ),
      viewLanguagesDisplay: objectPath.get(
        uiService.config,
        "extras.languages.display"
      ),
      viewUserDisplay: objectPath.get(uiService.config, "extras.user.display"),
    };
  }, [uiService]);


  // const handleChangeFilial = async (e) => {
  //   index(token, `users?cargo=dentista&clinica=${e}`).then(({data}) => {
  //     dispatch(Dentists(data))
  //   })

  //   let indexOf = clinics.findIndex(item => item.id === e)


  //   await dispatch(Select(clinics[indexOf]))
  //   return history.push('/dashboard')
  // }

  return (
    <div className="topbar" style={{ display: 'flex', alignItems: 'center' }}>
      {layoutProps.viewSearchDisplay}

      {layoutProps.viewQuickActionsDisplay}

      {layoutProps.viewQuickPanelDisplay}

      {layoutProps.viewUserDisplay && <QuickUserToggler />}
    </div>
  );
}
