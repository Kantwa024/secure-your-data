import './Pass.css'
import React, { Component } from 'react'
import firebaseConfig from '../../Config'
import firebase from "firebase";
import { Keys } from '../../GenratePass'
import md5 from 'md5'
import { Redirect} from 'react-router-dom'

if(!firebase.apps.length)
{
    firebase.initializeApp(firebaseConfig);
}

var CryptoJS = require("crypto-js");

export default class Pass extends Component {
    state={
        short:"",
        pass:"",
        long:"",
        btnname:"Add",
        id:Date.now().toString(),
        update:false
    }

    componentDidMount(){
        console.log(this.props.location.state.long)
        if(this.props.location.state.long !== undefined)
        {
            this.setState({
                short:this.props.location.state.short,
                pass:this.props.location.state.Pass,
                long:this.props.location.state.long,
                id:this.props.location.state.id,
                btnname:"Update",
                update:true
            })
        }
    }
    BtnClick = () =>{
        this.setState({
            btnname:"Loading..."
        })

        firebase
        .firestore()
        .collection(localStorage.getItem('Uid'))
        .doc('Password')
        .get()
        .then(doc1 => {
            var start = Keys(1028);
            var end = Keys(1028);
            var key = this.props.location.state.pass;
    
            var enshort = CryptoJS.AES.encrypt(this.state.short, start+md5(doc1.data().start + key + doc1.data().end)+end).toString()
            var enpass = CryptoJS.AES.encrypt(this.state.pass, start+md5(doc1.data().start + key + doc1.data().end)+end).toString()
            var enlong = CryptoJS.AES.encrypt(this.state.long, start+md5(doc1.data().start + key + doc1.data().end)+end).toString()

            firebase
            .firestore()
            .collection(localStorage.getItem('Uid'))
            .doc('Data')
            .collection('data')
            .doc(this.state.id)
            .set({
                short:enshort,
                pass:enpass,
                long:enlong,
                start:start,
                end:end
            })
            .then(() => {
                if(this.state.update)
                {
                    this.setState({
                        btnname:"Update"
                    })
                }
                else
                {
                    this.setState({
                        btnname:"Add"
                    })
                }
            })
            .catch(err => {
                if(this.state.update)
                {
                    this.setState({
                        btnname:"Update"
                    })
                }
                else
                {
                    this.setState({
                        btnname:"Add"
                    })
                }
                window.alert(err);
            });
        })
        .catch(err => {
            if(this.state.update)
            {
                this.setState({
                    btnname:"Update"
                })
            }
            else
            {
                this.setState({
                    btnname:"Add"
                })
            }
            window.alert(err);
        })
    
    }
    render() {
        return (
            <div className="body">
            <div className="containerp">
                <textarea id="inputp" cols="60" rows="5" placeholder="Short Information" value={this.state.short} onChange = {
                    (event) =>{
                        this.setState({
                            short:event.target.value
                        })
                    }
                } required></textarea>
                <textarea id="inputp" cols="60" rows="5" placeholder="Password" value={this.state.pass} onChange = {
                    (event) =>{
                        this.setState({
                            pass:event.target.value
                        })
                    }
                } required></textarea>
                <textarea id="inputp" cols="60" rows="5" placeholder="Full Information" value={this.state.long} onChange = {
                    (event) => {
                        this.setState({
                            long:event.target.value
                        })
                    }
                } required></textarea>
               <button id="btnp" onClick = {this.BtnClick}>{this.state.btnname}</button>
            </div>
            </div>
        )
    }
}

