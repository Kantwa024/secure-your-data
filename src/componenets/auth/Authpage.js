import React, { Component } from 'react'
import './Authpage.css'
import Form from "./Form"
import Sideform from './Sideform'
import firebaseConfig from '../../Config'
import firebase from "firebase/app"
import { Redirect } from 'react-router-dom'

if(!firebase.apps.length)
{
    firebase.initializeApp(firebaseConfig);
}


export default class authpage extends Component {
    state = {
        state: false,
        email: "",
        pass: "",
        confirm: "",
        signinbtn: "Sign In",
        signupbtn: "Sign Up",
        next:false,
        next2:false,
        main:false
    }

    State = () => {
        this.setState({
            state: this.state.state?false:true
        });
    }

    SignUpPass =  (event) => {
        this.setState({
            pass: event.target.value
        });
    }

    ConSignUpPass =  (event) => {
        this.setState({
            confirm: event.target.value
        });
    }

    SignUpEmail =  (event) => {
        this.setState({
            email: event.target.value
        });
    }

    componentDidMount() {
        if(localStorage.getItem('Uid') !== null)
        {
            this.setState({
                next:true
            });

            firebase
            .firestore()
            .collection(localStorage.getItem('Uid'))
            .doc("Password")
            .get()
            .then(doc => {
                if(doc.exists)
                {
                    this.setState({
                        next2:true
                    })
                }
                this.setState({
                    main:true
                })
            })
            .catch(err => {
                this.setState({
                    main:true
                })
                window.alert(err);
            });
        }
        else
        {
            this.setState({
                main:true
            })
        }
    }

    SignUp = () =>{
        if(this.state.signupbtn !== "Loading...")
        {
            if(this.state.confirm !== this.state.pass ||  this.state.pass === "" || this.state.confirm === "" || this.state.email === "")
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
                .createUserWithEmailAndPassword(this.state.email, this.state.pass)
                .then(({ user }) => {
                    localStorage.setItem('Uid',user.uid);
                    return user.sendEmailVerification()
                    .then(msg => {
                        window.alert("Please Verify Your Email.");
                        this.setState({
                            next: true
                        });
                    })
                    .catch(err => {
                        window.alert(err);
                    });
                })
                .then(() => {
                    this.setState({
                        signupbtn: "Sign Up"
                    });
                })
                .catch(err => {
                    this.setState({
                        signupbtn: "Sign Up"
                    });
                    window.alert(err);
                });
            }
        }   
    }


    LogIn = () => {
        if(this.state.signinbtn !== "Loading...")
        {
            if( this.state.pass === "" ||  this.state.email === "")
            {
                window.alert("Please enter correct password and email.");
            }
            else
            {
                this.setState({
                    signinbtn: "Loading..."
                });
                firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.pass)
                .then(({ user }) => {
                    this.setState({
                        signinbtn: "Sign In"
                    });
                    this.setState({
                        next: true
                    });
                    firebase
                    .firestore()
                    .collection(user.uid)
                    .doc("Password")
                    .get()
                    .then(doc => {
                        localStorage.setItem('Uid',user.uid);
                        if(doc.exists)
                        {
                            this.setState({
                                next2:true
                            })
                        }
                    })
                    .catch(err => {
                        window.alert(err);
                    });
                })
                .catch(err => {
                    this.setState({
                        signinbtn: "Sign In"
                    });
                    window.alert(err);
                });
            }
        }
    }

    render() {
        if(this.state.main) 
        {
            if(this.state.next)
            {
                if(this.state.next2)
                {
                    return <Redirect to="/enterpass"/>
                }
                else
                {
                    return <Redirect to="/setmasterpass"/>
                }
            }
            else
            {
                var p = "container";
                if(this.state.state)
                {
                    p += " right-panel-active"
                }
                return (
                    <div className="body">
                        <div className={p} id="container"> 
                            <Form
                            Pass={true}
                            forgot={false}
                            con={true}
                            confirm={this.state.confirm}
                            ConSignUpPass={this.ConSignUpPass}
                            className="form-container sign-up-container"
                            heading="Create Account"
                            email={this.state.email}
                            SignUpEmail={this.SignUpEmail}
                            pass={this.state.pass}
                            SignUpPass={this.SignUpPass}
                            SignUp={this.SignUp}
                            btnname={this.state.signupbtn}/>
        
                            <Form
                            Pass={true}
                            forgot={true}
                            con={false}
                            confirm={this.state.confirm}
                            ConSignUpPass={this.ConSignUpPass}
                            className="form-container sign-in-container"
                            heading="Sign In"
                            email={this.state.email}
                            SignUpEmail={this.SignUpEmail}
                            pass={this.state.pass}
                            SignUpPass={this.SignUpPass}
                            SignUp={this.LogIn}
                            btnname={this.state.signinbtn}/>
                    
                            <div className="overlay-container">
                                <div className="overlay">
                                    <Sideform
                                    className="overlay-panel overlay-left"
                                    heading="Welcome Back!"
                                    pra="To keep connected with us please login with your personal info"
                                    id="signIn"
                                    signIn={this.State}
                                    btnname="Sign In"/>
                                    
                                    <Sideform
                                    className="overlay-panel overlay-right"
                                    heading="Hello, Friend!"
                                    pra="Enter your personal details and start journey with us"
                                    id="signUp"
                                    signIn={this.State}
                                    btnname="Sign Up"/>
                                </div>
                            </div>   
                    </div>
                </div>
                )
            }
        }
        else
        {
            return (
                <div className="body">
                    <h1>Loading...</h1>
                </div>
            )
        }
    }
}
