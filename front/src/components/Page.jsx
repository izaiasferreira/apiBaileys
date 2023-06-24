import './Page.css';
import React from 'react'

export default function Page({ open, onClose, title, children }) {
    return (
        <div className={open === true? 'page-container' : 'page-closed'}>
            <div className="page-header">
                <i className='bx bx-left-arrow-alt' onClick={() => { onClose() }}></i>
                <h1>{title}</h1>
            </div>
            <div className="page-content">
                {children}
            </div>
        </div>
    )
}