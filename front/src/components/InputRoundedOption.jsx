import './InputRoundedOption.css';
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';

export default function InputRoundedOption({ id, name, value, onChange, label, checked, disabled }) {
  const [idInput, setIdInput] = useState(null)
  useEffect(() => {
    setIdInput(id || uuid())
    return () => {
      setIdInput(null)
    }
  }, [])


  return (
    <div className="option-from-input-rounded">
      <label className='label' htmlFor={idInput}>
        <input disabled={disabled ? true : false} checked={checked ? true : false} onChange={(event) => { onChange(event.target.value) }} type="radio" name={name} id={idInput} value={value || idInput} />{label}
      </label>
    </div>

  );
}