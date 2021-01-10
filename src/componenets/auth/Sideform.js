import React from 'react'


export default function Sideform(props) {
    return (
        <div>
            <div className={props.className}>
                <h1>{props.heading}</h1>
                <p>{props.pra}</p>
                <button  class="ghost" id={props.id} onClick={props.signIn}>{props.btnname}</button>
            </div>
        </div>
    )
}
