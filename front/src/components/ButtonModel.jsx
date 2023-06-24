
import './ButtonModel.css'
import React from 'react'


export default function ButtonModel({ onClick, children, type, align, disabled }) {
    return (
        <div className='button-container-model'  >
            <button
                disabled={disabled ? true : false}
                style={align ? align === 'left' ? { display: 'flex', justifyContent: 'flex-start' } : { display: 'flex', justifyContent: 'flex-end' } : null}
                onClick={() => { onClick() }} className={type || 'primary'}>{children}</button>
        </div >
    )
}