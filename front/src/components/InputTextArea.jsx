import './InputTextArea.css';
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';
import EmojiComponent from './EmojiComponent'

export default function InputTextArea({ id, onFocus, onChange, placeholder, style, value, columns, rows }) {
  const [focusState, setFocusState] = useState(null)
  const [idState, setIdState] = useState(null)
  useEffect(() => {
    setFocusState(onFocus || false)
    setIdState(id || uuid())
    return async () => {
      setFocusState(null)
      setIdState(null)
    }
  }, [])

  useEffect(() => {
    if (focusState) {
      var elementFocus = document?.getElementById(idState)
      elementFocus?.focus()
    }
  }, [idState])

  return (
    <div className='input-text-area-container'>
      <textarea
        value={value}
        cols={columns || "25"}
        rows={rows || "2"}
        id={idState}
        type="text"
        className={style || 'normal'}
        placeholder={placeholder || 'Digite aqui'}
        onChange={(event) => {
          if (onChange) {
            onChange(event.target.value)
          }
        }}></textarea>
    </div>

  );
}