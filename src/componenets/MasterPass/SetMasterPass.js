import React, { Component } from 'react'
import firebaseConfig from '../../Config'
import './SetMasterPass.css'
import firebase from "firebase";
import { Keys } from '../../GenratePass'
import md5 from 'md5'
import { Redirect} from 'react-router-dom'
import { Crypt, RSA } from 'hybrid-crypto-js';

var CryptoJS = require("crypto-js");




var crypt = new Crypt();
var rsa = new RSA();
// Increase amount of entropy
var entropy = 'Random string, integer or float';
var crypt = new Crypt({ entropy: entropy });
var rsa = new RSA({ entropy: entropy });

// Select default message digest
var crypt = new Crypt({ md: 'sha512' });

// Select AES or RSA standard
var crypt = new Crypt({
    // Default AES standard is AES-CBC. Options are:
    // AES-ECB, AES-CBC, AES-CFB, AES-OFB, AES-CTR, AES-GCM, 3DES-ECB, 3DES-CBC, DES-ECB, DES-CBC
    aesStandard: 'AES-CBC',
    // Default RSA standard is RSA-OAEP. Options are:
    // RSA-OAEP, RSAES-PKCS1-V1_5
    rsaStandard: 'RSA-OAEP',
});

// Alternate AES keysize (some AES algorithms requires specific key size)
var crypt = new Crypt({
    aesKeySize: 192, // Defaults to 256
});

var publicKey = null;
var privateKey = null;
// Generate RSA key pair, default key size is 4096 bit
rsa.generateKeyPair(function(keyPair) {
    // Callback function receives new key pair as a first argument
    publicKey = keyPair.publicKey;
    privateKey = keyPair.privateKey;
});





if(!firebase.apps.length)
{
    firebase.initializeApp(firebaseConfig);
}


export default class SetMasterPass extends Component {
    state = {
        pass:"",
        conpass:"",
        signupbtn:"Next",
        next:false
    }

    Pass = (event) => {
        this.setState({
            pass: event.target.value
        });
    }

    ConPass = (event) => {
        this.setState({
            conpass: event.target.value
        });
    }

    SignUp = () =>{
        var message = 'Hello world!';
        var signature = crypt.signature(privateKey, message);
        // Encryption with one public RSA key
        var encrypted = crypt.encrypt(publicKey, message,signature);
        console.log(encrypted);

        // var decrypted = crypt.decrypt(privateKey, encrypted);
        // console.log(decrypted);

        // var verified = crypt.verify(
        //     publicKey,
        //     decrypted.signature,
        //     decrypted.message,
        // );

        // console.log(verified);
        
        if(this.state.signupbtn !== "Loading...")
        {
            if(this.state.pass === "" || this.state.conpass === "" || this.state.pass !== this.state.conpass)
            {
                window.alert("Please enter correct passwords.");
            }
            else
            {
            
                this.setState({
                    signupbtn: "Loading..."
                });
                
                var start = Keys(1028);
                var end = Keys(1028);
                var startm = Keys(1028);
                var endm = Keys(1028);
                firebase
                .firestore()
                .collection(localStorage.getItem('Uid'))
                .doc('Password')
                .set({
                    pass:CryptoJS.AES.encrypt(this.state.pass, start+md5(this.state.pass)+end).toString(),
                    start:start,
                    end:end
                })
                .then(() => {
                    this.setState({
                        signupbtn: "Next",
                        next:true
                    });

                    firebase
                    .firestore()
                    .collection(localStorage.getItem('Uid'))
                    .doc('Public Key')
                    .set({
                        key:publicKey
                    });

                    
                    firebase
                    .firestore()
                    .collection(localStorage.getItem('Uid'))
                    .doc('Private Key')
                    .set({
                        key:CryptoJS.AES.encrypt(privateKey, startm+md5(this.state.pass)+endm).toString(),
                        start:startm,
                        end:endm
                    });

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
            return <Redirect to="/enterpass"/>
        }
        else
        {
            return (
                <div className="body">
                    <div  className="containerm">
                        <h1 id="h1m">Create Master Password</h1>
                        <input id="inputm" type="password" placeholder="Master Password" value={this.state.pass} onChange = {this.Pass} required/>
                        <input id="inputm1" type="password" placeholder="Confirm Master Password" value={this.state.conpass} onChange = {this.ConPass} required/>
                        <button id="btn" onClick = {this.SignUp}>{this.state.signupbtn}</button>
                    </div>
                </div>
            )
        }
    }
}
