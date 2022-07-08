import * as React from "react"

function SvgComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 35.885 46.715"
      {...props}
    >
      <path
        d="M17.942 25.123c3.279 0 4.8 2.487 5.118 6.02a24.276 24.276 0 01-.111 3.5c-.368 4.741-.791 10.566 2.364 10.566 2.672 0 4.041-5.122 4.834-10.961.764-5.78-.047-8.656.353-11.223.759-4.863 5-9.223 3.692-15.423-.727-3.44-2.622-5.057-4.5-5.738-4.317-1.567-7.109 1.463-11.75 1.463S10.512.297 6.189 1.869c-1.874.68-3.77 2.3-4.5 5.738-1.308 6.2 2.935 10.559 3.7 15.423.4 2.566-.41 5.443.353 11.223.791 5.839 2.163 10.961 4.832 10.961 3.153 0 2.733-5.825 2.365-10.566a24.45 24.45 0 01-.112-3.506c.317-3.532 1.859-6.019 5.115-6.019z"
        fill="none"
        stroke="#707070"
        strokeWidth={3}
      />
    </svg>
  )
}

export default SvgComponent
