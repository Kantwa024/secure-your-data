import React from 'react'


export default function Form(props) {
    var p = props.forgot?<a id="a" href="/forgot">Forgot your password?</a>:null;
    var con = props.con?<input id="inputl" type="password" placeholder="Confirm Password" value={props.confirm} onChange = {props.ConSignUpPass} required/>:null;
    var pass = props.Pass?<input id="inputl" type="password" placeholder="Password" value={props.pass} onChange = {props.SignUpPass} required/>:null;
    return (
        <div className={props.className}>
            <form action="#">
                <h1>{props.heading}</h1>
                <br/>
                <input id="inputl" type="email" placeholder="Email" value={props.email} onChange = {props.SignUpEmail} required/>
                {pass}
                {p}
                {con}
                <button id = "btnl" onClick = {props.SignUp}>{props.btnname}</button>
            </form>
        </div>
    )
}
