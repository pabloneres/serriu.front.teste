import * as React from "react"

function SvgComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 40 40"
      {...props}
    >
      <path
        d="M39.98 4A4 4 0 0036 0H4a4.012 4.012 0 00-4 4v24a4.012 4.012 0 004 4h28l8 8zM32 24H8v-4h24zm0-6H8v-4h24zm0-6H8V8h24z"
        fill="#707070"
      />
    </svg>
  )
}

export default SvgComponent
