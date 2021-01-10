import React, { Component } from 'react'
import firebaseConfig from '../../Config'
import firebase from "firebase"
import md5 from 'md5'
import { Redirect } from 'react-router-dom'

var CryptoJS = require("crypto-js");

if(!firebase.apps.length)
{
    firebase.initializeApp(firebaseConfig);
}

export default class EnterPass extends Component {

    state = {
        pass:"",
        signupbtn:"Next",
        next:false
    }

    Pass = (event) => {
        this.setState({
            pass: event.target.value
        });
    }


    SignUp = () =>{
        if(this.state.signupbtn !== "Loading...")
        {
            if(this.state.pass === "")
            {
                window.alert("Please enter password.");
            }
            else
            {
                this.setState({
                    signupbtn: "Loading..."
                });
                
                firebase
                .firestore()
                .collection(localStorage.getItem('Uid'))
                .doc('Password')
                .get()
                .then(doc => {
                    this.setState({
                        signupbtn: "Next"
                    });
                    var bytes  = CryptoJS.AES.decrypt(doc.data().pass, doc.data().start + md5(this.state.pass) + doc.data().end);
                    var originalText = bytes.toString(CryptoJS.enc.Utf8);
                    if(originalText === this.state.pass)
                    {
                        this.setState({
                            next:true
                        })
                    }
                    else
                    {
                        window.alert("Password Mismatch");
                    }
                })
                .catch(err => {
                    this.setState({
                        signupbtn: "Next"
                    });
                    window.alert(err);
                });
            }
        }   
    }

    render() {
        if(this.state.next)
        {
            return <Redirect to={{
                pathname:'/home',
                state:{pass:this.state.pass}
            }}
            />
        }
        else
        {
            return (
                <div className="body">
                    <div  className="containerf">
                        <h1 id="h1">Master Password</h1>
                        <input id="input" type="password" placeholder="Master Password" value={this.state.pass} onChange = {this.Pass} required/>
                        <button id="btn" onClick = {this.SignUp}>{this.state.signupbtn}</button>
                    </div>
                </div>
            )
        } 
    }
}
