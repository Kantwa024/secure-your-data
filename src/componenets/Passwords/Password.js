import React, { Component } from 'react'
import firebaseConfig from '../../Config'
import firebase from "firebase";
import { Redirect} from 'react-router-dom'
import 'firebase/database'
import md5 from 'md5'
import ShowPass from './ShowPass'
import './Password.css'

var CryptoJS = require("crypto-js");


if(!firebase.apps.length)
{
    firebase.initializeApp(firebaseConfig);
}

export default class Password extends Component {
    state = {
        data: [],
        load:false,
        click:false,
        indx:0
    }

    componentDidMount(){

        window.onscroll = function(ev) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {

            }
          };
          
        firebase
        .firestore()
        .collection(localStorage.getItem('Uid'))
        .doc('Password')
        .get()
        .then(doc1 => {
            firebase
            .firestore()
            .collection(localStorage.getItem('Uid'))
            .doc('Data')
            .collection('data')
            .get()
            .then(querySnapshot => {
                var newdata = []
                querySnapshot.forEach(doc => {
                    newdata.push({
                        short: CryptoJS.AES.decrypt(doc.data().short, doc.data().start + md5(doc1.data().start + this.props.pass + doc1.data().end) + doc.data().end).toString(CryptoJS.enc.Utf8),
                        long: CryptoJS.AES.decrypt(doc.data().long, doc.data().start + md5(doc1.data().start + this.props.pass + doc1.data().end) + doc.data().end).toString(CryptoJS.enc.Utf8),
                        pass: CryptoJS.AES.decrypt(doc.data().pass, doc.data().start + md5(doc1.data().start + this.props.pass + doc1.data().end) + doc.data().end).toString(CryptoJS.enc.Utf8),
                        id:doc.id
                    })
                });
                this.setState({
                    data: newdata,
                    load:true
                })
            })
            .catch(err => {
                window.alert(err);
            });
        })
        .catch(err => {
            window.alert(err);
        });
    }

    Click = (key) => {
        this.setState({
            click:true,
            indx:key
        })
    }

    render() {
            if(this.state.click)
            {
               return <Redirect to={{
                    pathname:"/addpass",
                    state:{
                        short:this.state.data[this.state.indx].short,
                        Pass:this.state.data[this.state.indx].pass,
                        long:this.state.data[this.state.indx].long,
                        id:this.state.data[this.state.indx].id,
                        pass:this.props.pass
                    }
                }}/>
            }
            else
            {
                if(this.state.load)
                {
                    var RenderData = null;
                    RenderData = this.state.data.map((value,index) => {
                        return (
                            <div onClick={() => this.Click(index)} key={index}>
                                <ShowPass short={value.short}/>
                            </div>
                        )
                    });
                    return (
                        <div className="pass">
                            {RenderData}
                        </div>
                    )
                }
                else
                {
                    return (
                        <div className="hclass">
                            <h1>Loading...</h1>
                        </div>
                    )
                }
            }
    }
}
