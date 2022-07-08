import React, { useMemo, useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import objectPath from "object-path";
import { Brand } from "../brand/Brand";
import { AsideMenu } from "./aside-menu/AsideMenu";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import Logo from "../../../../assets/logo.svg"
import { Dropdown, Menu, Space } from 'antd'
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import permissions from "~/services/permissions";

export function Aside() {
	const subMenuRef = useRef()
	const [menuActive, setMenuActive] = useState()
	const uiService = useHtmlClassService();

	// const layoutProps = useMemo(() => {
	// 	return {
	// 		disableScroll          :
	// 			objectPath.get(uiService.config, "aside.menu.dropdown") === "true" ||
	// 			false,
	// 		asideClassesFromConfig : uiService.getClasses("aside", true),
	// 		disableAsideSelfDisplay:
	// 			objectPath.get(uiService.config, "aside.self.display") === false,
	// 		headerLogo             : uiService.getLogo()
	// 	};
	// }, [uiService]);

	const onSelectMenu = (data) => {
		setMenuActive(data)
		if (data.children) {
			document.querySelector(".sub-menu-container").classList.add("active-submenu")
		}
		else {
			hideMenu()
		}
	}

	const hideMenu = () => {
		document.querySelector(".sub-menu-container").classList.remove("active-submenu")
	}

	return (
		<>
			{/* begin::Aside */}
			<div
				style={{ width: 70, height: '100vh', overflow: "hidden", position: "fixed" }}
				id="kt_aside"
				className={`aside aside-left aside-minimize aside-fixed d-flex flex-column flex-row-auto`}>
				<Brand />

				{/* begin::Aside Menu */}
				<div id="kt_aside_menu_wrapper" className="aside-menu-wrapper flex-column-fluid">

					<AsideMenu onSelectMenu={onSelectMenu} />
				</div>
				{/* end::Aside Menu */}
			</div>
			<div
				className={`sub-menu-container`}
				ref={subMenuRef}
			>
				{menuActive?.children && (
					<div className="menu-submenu">
						<i className="menu-arrow"></i>
						<ul className="menu-subnav">
							{menuActive?.children?.map((children, index) => {
								{
									return (
										<NavLink
											onClick={() => {
												hideMenu()
											}}
											className="menu-link menu-toggle"
											to={children.to}
											key={index}
										>
											<li

												className="menu-item menu-item-submenu "
												aria-haspopup="true"
												data-menu-toggle="hover"
											>
												{/*{menuActive.icon}*/}
												<span className="menu-text">{children.title}</span>
											</li>
										</NavLink>
									);
								}
							})}
						</ul>
					</div>
				)}
			</div>
			{/* end::Aside */}
		</>
	);
}
