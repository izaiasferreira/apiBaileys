import './DialogBoxChildren.css';
import React, { useEffect } from 'react'
import { useState } from 'react';

export default function DialogBoxChildren({ open, onClose, children }) {
    const [openState, setOpen] = useState(false)
    useEffect((() => {
        setOpen(open || false)
    }), [])

    useEffect((() => {
        setOpen(open)
    }), [open])
    return (
        <div className={openState ? "dialog-box-children" : "dialog-box-children-disable"} >
            <div className='dialog-box-container'>
                <div className="dialog-box-content">
                    {children}
                </div>
            </div>
            <div onClick={() => { onClose() }} className="dialog-box-back"></div>
        </div>
    )
}