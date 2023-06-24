import './DialogBox.css';
import React, { useEffect } from 'react'
import SecoundaryButton from './SecoundaryButton';
import PrimaryButton from './PrimaryButton';
import { useState } from 'react';

export default function DialogBox({ open, text, buttonOneText, buttonTwoText, onClose, onButtonOne, onButtonTwo, children }) {
    const [openState, setOpen] = useState(false)
    useEffect((() => {
        setOpen(open || false)
    }), [])

    useEffect((() => {
        setOpen(open)
    }), [open])
    return (
        <div className={openState ? "dialog-box" : "dialog-box-disable"} >
            <div className='dialog-box-container'>
                <div className="dialog-box-content">
                    <div className='text'>
                        {text || 'Deseja realizar esta ação?'}
                    </div>
                    <div className='buttons'>
                        {buttonTwoText ? <SecoundaryButton onChange={() => { onButtonTwo() }}>{buttonTwoText || 'Cancelar'}</SecoundaryButton> : null}
                        {buttonOneText ? <PrimaryButton onChange={() => { onButtonOne() }}>{buttonOneText || 'Confirmar'}</PrimaryButton> :
                            <PrimaryButton onChange={() => { onClose() }}>{'Ok'}</PrimaryButton>}
                    </div>

                </div>
            </div>
            <div onClick={() => { onClose() }} className="dialog-box-back"></div>
        </div>
    )
}