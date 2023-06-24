import './InputText.css';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
export default function InputText({ id, onFocus, onChange, placeholder, style, value, size }) {
  const [idState, setIdState] = useState(null)
  useEffect(() => {
    setIdState(id || uuidv4())
  }, [])


  function setSize(size) {
    if (size === 'large') { return 'large-size' }
    if (size === 'normal') { return 'normal-size' }
  }

  return (
    <div className='input-text-container'>
      <input
        style={{ padding: '.5rem' }}
        id={idState}
        autoComplete="off"
        type="text"
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