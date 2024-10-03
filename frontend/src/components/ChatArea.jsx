import ChatComponent from "./ChatComponent"
import TextBox from "./TextBox"
import Logo from "./Logo";
import React, { useState } from 'react';

function ChatArea({convo, setConvo, setHistoryList, convoID, setConvoID}){
    // const [convo, setConvo] = useState([]);
    //const [convoID, setConvoID] = useState('')

    return(
        <div class='container-fluid bg-secondary text-white' style={{ height: '100vh' }}>
            <div class='row justify-content-center align-items-center' style={{ height: '10%' }}>
                <Logo/>
            </div>
            <div class='row justify-content-center align-items-center pt-3' style={{ height: '80%' }}>
                <ChatComponent chatconversation={convo} convoID={convoID}/>
            </div>
            <div class='row d-flex justify-content-center align-items-center shadow-lg' style={{ height: '10%' }}>
                <TextBox  convo={convo} setConvo={setConvo} setConvoID={setConvoID} setHistoryList={setHistoryList}/>
            </div>
        </div>
    )
}

export default ChatArea