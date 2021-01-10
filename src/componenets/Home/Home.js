import React, { Component } from 'react'
import { Link,Route } from 'react-router-dom'
import './Home.css'
import Password from '../Passwords/Password'
import Pass from '../Passwords/Pass'
import { Redirect } from 'react-router-dom'
import firebaseConfig from '../../Config'
import firebase from "firebase";

if(!firebase.apps.length)
{
    firebase.initializeApp(firebaseConfig);
}

export default class Home extends Component {
    state = {
        ok:null,
        logout:false
    }
    componentDidMount(){
        if(this.props.location.state.pass !== undefined)
        {
            this.setState({
                ok:true
            })
        }
        else{
            this.setState({
                ok:false
            })
        }

    }

    Logout = () =>{
        firebase
        .auth()
        .onAuthStateChanged(user => {
            if(user !== null)
            {
                firebase
                .auth()
                .signOut()
                .then(() => {
                    localStorage.clear()
                    this.setState({
                        logout:true
                    })
                })
                .catch(err => {
                    window.alert(err)
                })
            }
        });
    }

    render() {
        if(this.state.ok === true)
            {
                if(this.state.logout)
                {
                    <Redirect to="/"/>
                }
                else{
                    return (
                        <div className="bodyh">
                            <header>
                                <nav>
                                    <ul>
                                        <li><Link to="/" id="ah" onClick={this.Logout}>Logout</Link></li>
                                        <li><Link to={{pathname:"/addpass",state:{pass:this.props.location.state.pass}}} id="ah" >Add Password</Link></li>
                                        <li><Link to="/home" id="ah" >Passwords</Link></li>
                                    </ul>
                                </nav>
                            </header>
                            <div className="data">
                                <Route path="/addpass" exact render={() => <Pass pass={this.props.location.state.pass}/>}/>
                                <Route path="/home" exact render={() => <Password pass={this.props.location.state.pass}/>}/>
                            </div>
                        </div>        
                    )
                }
            }
            else if(this.state.ok === false){
                return <Redirect to="/enterpass"/>
            }
            else{
                return (
                    <div>
                        <h1>Loading...</h1>
                    </div>
                )
            }
        
    }
}
