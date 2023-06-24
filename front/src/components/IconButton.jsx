
import './IconButton.css'
import React from 'react'
export default function IconButton({ onClick, children, color, size, type, disable }) {

    if (disable) {
        return (
            <div style={{ color: color }} className={`icon-button-container-${type || 'normal'} disable-icon-button`} >
                <div className={`body ${size || 'normal'}`}>
                    {children}
                </div>
            </div >
        )
    } else {
        return (
            <div style={{ color: color }} className={`icon-button-container-${type || 'normal'}`} onClick={onClick} >
                <div className={`body ${size || 'normal'}`}>
                    {children}
                </div>
            </div >
        )
    }
}