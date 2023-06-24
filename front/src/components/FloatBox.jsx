import './FloatBox.css';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { v4 as uuid } from 'uuid';

export default function FloatBox({ children, open, anchorElement, onClose, direction }) {
    const [id] = useState(uuid())
    const [state, setState] = useState(false)
    const [anchor, setAnchor] = useState(null)
    useEffect( () => {
        setAnchor(anchorElement)
        setState(open)
        setPosition(anchor)
    }, [anchorElement])


    const setPosition = () => {
        if (anchorElement) {
            var target = anchorElement.target.getBoundingClientRect()
            var box = document.getElementById(id)

            if ((target.x + 400) > window.screen.width && (target.y - 200) < 0 && (target.y + 400) < window.screen.height) {
               
                box.style.top = (target.y + 30) + 'px'
                box.style.right = (window.screen.width - target.x) + 'px'
            }

            if ((target.x + 400) < window.screen.width && (target.y - 200) < 0 && (target.y + 400) < window.screen.height) {
                box.style.top = (target.y + 30) + 'px'
                box.style.left = target.x + 'px'
            }

            if ((target.x + 400) < window.screen.width && (target.y - 200) > 0 && (target.y + 400) > window.screen.height) {
                box.style.bottom = (window.screen.height - target.y - 140) + 'px'
                box.style.left = target.x + 'px'
            }

        }
    }

    function close() {
        setState(false)
        setAnchor(null)
    }
    return (
        <>
            <div className={state ? "float-box-container" : 'disable'} onClose={onClose} id={id}>
                <div id={`children${id}`} style={{ flexDirection: direction || 'row' }} className="children">
                    {children}
                </div>
            </div>
            <div className={state ? "background" : 'disable'} onClick={close}></div>
        </>
    )
}