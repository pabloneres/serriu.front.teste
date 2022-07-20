import { toAbsoluteUrl } from "../../_helpers";

export function getInitLayoutConfig() {
	return {
		demo: "demo1",
		js  : {
			breakpoints: {
				sm : "576",
				md : "768",
				lg : "992",
				xl : "1200",
				xxl: "1200"
			},
			colors     : {
				theme: {
					base   : {
						"white"    : "#ffffff",
						"primary"  : "#6993ff",
						"secondary": "#e5eaee",
						"success"  : "#1bc5bd",
						"info"     : "#8950fc",
						"warning"  : "#ffa800",
						"danger"   : "#f64e60",
						"light"    : "#f3f6f9",
						"dark"     : "#212121"
					},
					light  : {
						"white"    : "#ffffff",
						"primary"  : "#e1e9ff",
						"secondary": "#ecf0f3",
						"success"  : "#c9f7f5",
						"info"     : "#eee5ff",
						"warning"  : "#fff4de",
						"danger"   : "#ffe2e5",
						"light"    : "#f3f6f9",
						"dark"     : "#d6d6e0"
					},
					inverse: {
						"white"    : "#ffffff",
						"primary"  : "#ffffff",
						"secondary": "#212121",
						"success"  : "#ffffff",
						"info"     : "#ffffff",
						"warning"  : "#ffffff",
						"danger"   : "#ffffff",
						"light"    : "#464e5f",
						"dark"     : "#ffffff"
					}
				},
				gray : {
					"gray100": "#f3f6f9",
					"gray200": "#ecf0f3",
					"gray300": "#e5eaee",
					"gray400": "#d6d6e0",
					"gray500": "#b5b5c3",
					"gray600": "#80808f",
					"gray700": "#464e5f",
					"gray800": "#1b283f",
					"gray900": "#212121"
				}
			},
			fontFamily : "Poppins"
		},
		// == Page Splash Screen loading
		loader: {
			enabled: true,
			type   : "spinner-logo", // default|spinner-message|spinner-logo
			logo   : toAbsoluteUrl("/media/logos/serriu_logo.png"),
			message: "Please wait..."
		},
		// page toolbar
		toolbar  : {
			display: true
		},
		header   : {
			self: {
				width: "fluid", // fixed|fluid
				theme: "light", // light|dark
				fixed: {
					desktop: true,
					mobile : true
				}
			},
			menu: {
				self   : {
					display     : true,
					layout      : "default", // tab/default
					"root-arrow": false,
					"icon-style": "duotone" // duotone, line, bold, solid
				},
				desktop: {
					arrow  : true,
					toggle : "click",
					submenu: {
						theme: "light", // light|dark
						arrow: true
					}
				},
				mobile : {
					submenu: {
						theme    : "dark",
						accordion: true
					}
				}
			}
		},
		subheader: {
			display               : false,
			displayDesc           : false,
			displayDaterangepicker: true,
			layout                : "subheader-v1",
			fixed                 : true,
			width                 : "fluid", // fixed/fluid,
			clear                 : true,
			style                 : "transparent" // solid/transparent
		},
		content  : {
			width: "fluid" // fluid|fixed
		},
		brand    : {
			self: {
				theme: "dark" // light/dark
			}
		},
		aside    : {
			self  : {
				theme   : "light", // light/dark
				display : true,
				fixed   : true,
				minimize: {
					toggle   : false, // allow toggle
					default  : true, // default state
					hoverable: false // allow hover
				}
			},
			footer: {
				self: {
					display: true
				}
			},
			menu  : {
				dropdown    : false, // ok
				scroll      : true, // ok
				"icon-style": "duotone", // duotone, line, bold, solid
				submenu     : {
					accordion: true,
					dropdown : {
						arrow          : true,
						"hover-timeout": 500 // in milliseconds
					}
				}
			}
		},
		footer   : {
			self: {
				fixed: true,
				width: "fluid"
			}
		},
		extras   : {
			search         : {
				display  : true,
				layout   : "dropdown", // offcanvas, dropdown
				offcanvas: {
					direction: "right"
				}
			},
			notifications  : {
				display  : true,
				layout   : "dropdown", // offcanvas, dropdown
				dropdown : {
					style: "dark" // light, dark
				},
				offcanvas: {
					directions: "right"
				}
			},
			"quick-actions": {
				display  : true,
				layout   : "dropdown", // offcanvas, dropdown,
				dropdown : {
					style: "dark", // light, dark
				},
				offcanvas: {
					directions: "right"
				}
			},
			user           : {
				display  : true,
				layout   : "offcanvas", // offcanvas, dropdown
				dropdown : {
					style: "dark"
				},
				offcanvas: {
					directions: "right"
				}
			},
			languages      : {
				display: true
			},
			cart           : {
				display : true,
				dropdown: {
					style: "dark", // ligth, dark
				}
			},
			"quick-panel"  : {
				display  : true,
				offcanvas: {
					directions: "right"
				}
			},
			chat           : {
				display: true
			},
			toolbar        : {
				display: true
			},
			scrolltop      : {
				display: true
			}
		}
	};
}
