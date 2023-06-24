import './Modal.css';
import React, { useContext } from 'react'

export default function Modal({ status, title, children, onClose }) {
    return (
        <div className={status === true ? "modal" : 'modal-close'} id='modal'>
            <div className='modal-container'>
                <div className="modal-header">
                    <div className="modal-header-left">
                        <i className='bx bx-left-arrow-alt' onClick={() => { onClose() }}></i>
                        <h1>{title}</h1>
                    </div>
                </div>
                <div className="modal-content">
                    {children}
                </div>
            </div>
            <div onClick={() => { onClose()}} className="modal-back"></div>
        </div>
    )
}