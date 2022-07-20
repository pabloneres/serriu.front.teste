/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { NavLink } from "react-router-dom";
import { checkIsActive } from "../../../../_helpers";

export function HeaderMenu({ layoutProps }) {

  return (
    <div
      id="kt_header_menu"
      className={`header-menu header-menu-mobile ${layoutProps.ktMenuClasses}`}
      {...layoutProps.headerMenuAttributes}
    >
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        <li>
          <NavLink className="menu-link" to="/dashboard">
            <span className="menu-text">Início</span>
            {layoutProps.rootArrowEnabled && <i className="menu-arrow" />}
          </NavLink>
        </li>
      </ul>
      {/*end::Header Nav*/}
    </div>
  );
}
