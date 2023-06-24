import './InputRounded.css';
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';

export default function InputRounded({ children, row, minWidth }) {
  const [idGroup, setId] = useState(null)


  useEffect(async () => {
    await setId(uuid())
    return async () => {
      await setId(null)
    }
  }, [])

  return (
    <div className='input-rounded-container' id={idGroup} style={
      !row ?
        { display: 'flex', flexDirection: 'column'}
        :
        { display: 'flex', alignItems: 'flex-end', flexDirection: 'row', flexWrap:'wrap', height:'auto', maxWidth: minWidth ? (minWidth * 20) + 'rem' : '20rem' }}>
      {children}
    </div>

  );
}