import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_helpers";

export function Brand() {

	return (
		<>

			<div
				className={`brand flex-column-auto`}
				id="kt_brand"
			>
				<Link to="/dashboard">
					<SVG src="images/logos/logo.svg" style={{ width: 30 }} />
				</Link>


				{/* <button className="brand-toggle btn btn-sm px-0" id="kt_aside_toggle">
					<span className="svg-icon svg-icon-xl">
						<SVG src={toAbsoluteUrl("/media/logos/logo.svg")} />
					</span>
				</button> */}
			</div>

		</>
	);
}
