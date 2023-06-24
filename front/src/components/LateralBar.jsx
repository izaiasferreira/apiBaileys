import './LateralBar.css';
import React from 'react'

export default function LateralBar({ open, onClose, title, children, side, noOverlap }) {
    return (
        <div className={open === true ? `lateralbar-container-${side && side === 'left' ? 'left' : 'right'}` : 'page-closed'} style={noOverlap ? {position:'relative'} : null}>
            <div className="lateralbar-header">
                <i className='bx bx-x' onClick={() => { onClose() }}></i>
                <h1>{title}</h1>
            </div>
            <div className="lateralbar-content">
                {children}
            </div>
        </div>
    )
}