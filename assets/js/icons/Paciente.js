import * as React from "react"

function SvgComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 39 43.5"
      {...props}
    >
      <g
        fill="none"
        stroke="#707070"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
      >
        <path
          data-name="Caminho 5"
          d="M37.5 42v-4.5a9 9 0 00-9-9h-18a9 9 0 00-9 9V42"
        />
        <path data-name="Caminho 6" d="M28.5 10.5a9 9 0 11-9-9 9 9 0 019 9z" />
      </g>
    </svg>
  )
}

export default SvgComponent
