
import './Bar.css'
import React from 'react'

export default function Bar({ type, size }) {

    return (
        <div className={`bar-container-${type || 'horizontal'}`}>
            <div className={type === 'vertical' ? "vertical-bar" : 'horizontal-bar'} style={size ? size === 'fullW' ? { width: '100%' } : { height: '100%' } : null}>
            </div >
        </div>
    )
}