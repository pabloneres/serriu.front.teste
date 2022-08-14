import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import AsideMenuListFilial from "./AsideMenuListFilial";
import { NavLink, Link } from "react-router-dom";
import { authActions } from "~/redux/actions";
import { Avatar, Tooltip } from "antd";
import { PoweroffOutlined, UserOutlined } from "@ant-design/icons";

export function AsideMenu({disableScroll, onSelectMenu, history}) {
	const {user}   = useSelector(state => state.auth);
	const dispatch = useDispatch();

	const logoutClick = () => {
		dispatch(authActions.silentLogout());
	};

	return (
		<>
			{/* begin::Menu Container */}
			<div
				id="kt_aside_menu"
				data-menu-vertical="1"
				className={`aside-menu my-4`}
				style={{
					display       : "flex",
					flexDirection : "column",
					justifyContent: "space-between",
					height        : "80%"
				}}
			>
				<AsideMenuListFilial onSelectMenu={onSelectMenu} />

				<Tooltip title="Sair" placement="left">
					<a onClick={logoutClick}>
						<div className="menu-nav">
							<li
								className="menu-item menu-item-submenu"
								style={{
									display       : "flex",
									alignItems    : "center",
									justifyContent: "center",
									width         : "100%",
									cursor        : "pointer"
								}}
								aria-haspopup="true"
								data-menu-toggle="hover"
							>
								<PoweroffOutlined style={{color: "#fff", fontSize: 20}} />
							</li>
						</div>
					</a>
				</Tooltip>
			</div>
			{/* end::Menu Container */}
		</>
	);
}
