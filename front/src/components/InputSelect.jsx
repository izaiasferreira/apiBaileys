import './InputSelect.css';
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';

export default function InputSelect({ id, onChange, placeholder, data }) {
  const [dataState, setDataState] = useState(null)
  const [idState, setIdState] = useState(null)
  useEffect(() => {
    setDataState(data)
    setIdState(id || uuid())
    return () => {
      setDataState(null)
      setIdState(null)
    }
  }, [])
  function setData(value) {
    var data = dataState
    for (let index = 0; index < data.length; index++) {
      if (data[index].value === value) data[index].selected = true
      else data[index].selected = false
    }
    setDataState(data)
    if (onChange) onChange(value)
  }

  function verifyDefaultValue(data) {
    var response = true
    for (let index = 0; index < data.length; index++) {
      if (data[index].selected) {
        response = false
        break;
      }
    }
    return response
  }
  return (
    <div className='input-select-container'>
      <select name={idState} id={idState}
        onChange={(event) => {
          setData(event.target.value)
        }}
      >
        {verifyDefaultValue(data) ? <option value="none" selected disabled hidden>{placeholder}</option> : null}
        {dataState?.map(dataState => {
          return dataState.selected ?
            <option key={uuid()} selected value={dataState.value} > {dataState.name}</option> :
            <option key={uuid()} value={dataState.value} > {dataState.name}</option>
        })}
      </select>
    </div >

  );
}