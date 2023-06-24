import './InputRoundedOptionChildren.css';
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';

export default function InputRoundedOptionChildren({ id, name, value, onChange, children, balls }) {
  const [idInput, setIdInput] = useState(null)
  const [valueState, setValueState] = useState(null)
  useEffect(() => {
    setIdInput(id || uuid())
    setValueState(value)
    return () => {
      setIdInput(null)
      setValueState(null)
    }
  }, [])
  return (
    <div className="option-from-input-rounded-children">
      <input type="radio" name={name} id={idInput} style={!balls ? { appearance: 'none', visibility: 'hidden', display:'none' } : null}
        onClick={(e) => {
          onChange(valueState)
        }} /> <label htmlFor={idInput} className='label'>{children}</label>
    </div>

  );
}

// onClick={() => {
//   var radio = document.getElementById(idInput)
//   radio.ariaChecked = 'Checked'
// }}

/*   <label htmlFor={idInput} className='label'>
        <input
          // style={!balls ? { appearance: 'none', visibility: 'hidden' } : null}
          
          type="radio"
          name={name}
          id={idInput} /> {
          children
        }</label> */