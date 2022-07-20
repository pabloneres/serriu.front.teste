import React, { useCallback } from "react";

// import { Container } from './styles';

function Input({ ...props }) {
  const handleKeyUp = useCallback(e => {
    e.currentTarget.maxLength = 11;
    let value = e.currentTarget.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/()/);
  });

  return <input {...props} onKeyUp={handleKeyUp} />;
}

export default Input;
