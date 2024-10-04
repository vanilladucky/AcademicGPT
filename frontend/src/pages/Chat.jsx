import { useState, useEffect } from 'react'
import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import ChatArea from '../components/ChatArea'
import ChatHistory from '../components/ChatHistory'

function Chat() {
  const [historyList, setHistoryList] = useState([]);
  const [convo, setConvo] = useState([]);
  const [convoID, setConvoID] = useState('')

  //[{'convoID':data._id, 'display': question, 'userID': localStorage.getItem('userID')}]
  useEffect(()=>{
    const fetchchats = async() => {
      try{
        const chats = await fetch(`${import.meta.env.VITE_SERVER_PORT}/api/retrieve_all_chat/${localStorage.getItem("userID")}`, {
          method: "GET",
          headers: {"content-type": "application/json",'Access-Control-Allow-Origin':'*'},
        }).then(response=>response.json())
        const newHistoryItems = chats.map(chat => ({
          'convoID': chat._id,
          'display': chat.convo[0].text,
          'userID': chat.user
        }));
        // Update the state once with all new history items
        setHistoryList((prev) => [...prev, ...newHistoryItems]);
      }catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchchats()
  }, [])

  return (
    <div className="container-fluid" style={{ fontFamily: 'Poppins', color: 'white'}}>
      <div className="row flex-nowrap">
          <div className="d-none d-md-block col-auto col-md-3 col-xl-2 bg-dark" style={{ height: '100vh' }}>
            <ChatHistory setConvo={setConvo} historyList={historyList} setConvoID={setConvoID}/>
          </div>
          <div className="col m-0 p-0">
            <ChatArea convo = {convo} setConvo={setConvo} setHistoryList={setHistoryList} convoID={convoID} setConvoID={setConvoID}/>
          </div>
      </div>
  </div>
  )
}

export default Chat