import { format } from 'crypto-js'
import React from 'react'
import './ShowPass.css'

export default function ShowPass(props) {
    return (
        <div className="showpass">
            <div className="card">
                <div className="containersp">
                    <p>{props.short}</p>
                </div>
            </div>  
        </div>         
    )
}
