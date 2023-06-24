import './InputPassword.css';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
export default function InputPassword({ id, onFocus, onChange, onEnter, placeholder, style, size, value }) {
  const [type, setType] = useState(null)
  const [idState, setIdState] = useState(null)
  useEffect( () => {
     setIdState(id || uuidv4())
     setType(true)
  }, [])

  function setSize(size) {
    if (size === 'large') { return 'large-size' }
    if (size === 'normal') { return 'normal-size' }
  }
  return (
    <div className='input-pass-container'>
      <div className="icon-to-input" onClick={() => { setType(!type) }}>
        {type ? <i className='bx bx-show-alt'></i> : <i className='bx bx-low-vision'></i>}
      </div>

      <input
        id={idState}
        autoComplete="off"
        type={type ? 'password' : 'text'}
        className={style || 'normal' + " " + setSize(size) || 'normal-size'}
        placeholder={placeholder || 'Digite aqui'}
        onChange={(event) => {
          if (onChange) { onChange(event.target.value) }
        }}
        defaultValue={value}
      />
    </div>

  );
}