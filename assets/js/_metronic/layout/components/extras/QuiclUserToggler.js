/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { useMemo } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import objectPath from "object-path";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { UserProfileDropdown } from "./dropdowns/UserProfileDropdown";

import { Image } from 'antd'

export function QuickUserToggler() {
  const { user } = useSelector(state => state.auth);
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      offcanvas: objectPath.get(uiService.config, "extras.user.layout") === "offcanvas",
    };
  }, [uiService]);

  return (<>
    {layoutProps.offcanvas && (<OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id="quick-user-tooltip">View user</Tooltip>}
    >
      <div className="topbar-item">
        <div className="btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2"
          id="kt_quick_user_toggle">
          <>

            <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">Olá,</span>
            <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">
              {user.firstName}
            </span>
            <Image
              preview={false}
              src={'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=100'}
              width={40}
              style={{ borderRadius: 8 }}
            />
          </>
        </div>
      </div>
    </OverlayTrigger>)}

    {!layoutProps.offcanvas && (<UserProfileDropdown />)}
  </>
  );
}
