
import './Space.css'
import React from 'react'

export default function Space({ size, type, children }) {

    return (
        <section className={`space-container space-container-${size || 'normal'}-${type || 'horizontal'}`}>
            {children}
        </section>
    )
}