
import './CentralArea.css'
import React from 'react'

export default function CentralArea({ children }) {

    return (
        <div className='centralarea-container'>
           {children}
        </div>
    )
}