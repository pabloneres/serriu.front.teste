import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import AsideMenuListFilial from "./AsideMenuListFilial";
import { NavLink, Link } from "react-router-dom";
import { LogoutUser } from "~/store/modules/auth/Auth.actions";
import { Avatar, Tooltip } from "antd";
import { PoweroffOutlined, UserOutlined } from "@ant-design/icons";

export function AsideMenu({ disableScroll, onSelectMenu, history }) {
	const { user } = useSelector(state => state.auth);
	const dispatch = useDispatch();

	const logoutClick = () => {
		const toggle = document.getElementById("kt_quick_user_toggle");
		if (toggle) {
			toggle.click();
		}
		dispatch(LogoutUser());
		history.push("/logout");
	};

	return (
		<>
			{/* begin::Menu Container */}
			<div
				id="kt_aside_menu"
				data-menu-vertical="1"
				className={`aside-menu my-4`}
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					height: "80%"
				}}
			>
				<AsideMenuListFilial onSelectMenu={onSelectMenu} />



				<Tooltip title="Sair" placement="left">
					<Link to="/logout" onClick={logoutClick}>
						<div className="menu-nav">
							<li
								className="menu-item menu-item-submenu"
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: "100%",
									cursor: "pointer"
								}}
								aria-haspopup="true"
								data-menu-toggle="hover"
							>
								<PoweroffOutlined style={{ color: "#fff", fontSize: 20 }} />
							</li>
						</div>
					</Link>
				</Tooltip>
			</div>
			{/* end::Menu Container */}
		</>
	);
}
