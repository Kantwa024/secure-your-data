import React, { Component } from 'react'
import Form from "./Form"
import firebaseConfig from '../../Config'
import "./Forgot.css"
import firebase from "firebase/app";

if(!firebase.apps.length)
{
    firebase.initializeApp(firebaseConfig);
}

export default class Forgot extends Component {
    state = {
        email: "",
        signupbtn:"Send Email"
    }

    SignUpEmail =  (event) => {
        this.setState({
            email: event.target.value
        });
    }

    SignUp = () =>{
        if(this.state.signupbtn !== "Loading...")
        {
            if(this.state.email === "")
            {
                window.alert("Please enter correct password and email.");
            }
            else
            {
                this.setState({
                    signupbtn: "Loading..."
                });
                firebase
                .auth()
                .sendPasswordResetEmail(this.state.email)
                .then(() => {
                    this.setState({
                        signupbtn: "Send Email"
                    });
                    window.alert("Please Check Your Email. And Reset Your Password.");
                })
                .catch(err => {
                    this.setState({
                        signupbtn: "Send Email"
                    });
                    window.alert(err);
                });
            }
        }   
    }

    render() {
        return (
            <div className="body">
                <div  className="containerf">
               <h1 id="h1">Forgot Password</h1>
               <input id="input" type="email" placeholder="Email" value={this.state.email} onChange = {this.SignUpEmail} required/>
               <button id="btn" onClick = {this.SignUp}>{this.state.signupbtn}</button>
                </div>
            </div>
        )
    }
}
