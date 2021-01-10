import React, { Component } from 'react'
import './Chatroom.css'
import ChatRight from './ChatRight'

export default class Chatroom extends Component {
    render() {
        return (
            <div className="chatroom">
                <div className="chats">
                <ChatRight/>
                <ChatRight/>
                <ChatRight/>
                <ChatRight/>
                <ChatRight/>
                <ChatRight/>
                </div>
            </div>
        )
    }
}
