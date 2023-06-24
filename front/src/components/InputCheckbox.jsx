import './InputCheckbox.css';
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';

export default function InputTime({ id, onChange, state, placeholder }) {
  const [idState, setIdState] = useState(null)
  const [stateValue, setState] = useState(null)
  useEffect(async () => {
    //setState(state || false)
    await setIdState(id || uuid())
    return async () => {
      await setIdState(null)
    }
  }, [])


  return (
    <div className='input-check-container'>
      {placeholder ? <label htmlFor={idState} >{placeholder}</label> : null}
      <input type="checkbox"
        //value={stateValue}
        name={idState}
        id={idState}
        onChange={(event) => {}} />
    </div>

  );
}