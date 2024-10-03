import History from "./History"

function ChatHistory({setConvo, historyList, setConvoID}) {

    const handleClick = () => {
        setConvo([])
    }

    return (
        <>
            <div className='d-flex column container justify-content-center w-100 text-white my-4 pb-3 border-bottom'>
                <button type="button" class="btn btn-secondary" onClick={handleClick}>New Chat</button>
            </div>
            <div className='container justify-content-center w-100 text-white m-0 p-0'>
                    {
                        historyList.slice().reverse().map((item, i) => (
                        <History key = {item.convoID} convoID = {item.convoID} question={item.display} setConvo={setConvo} setConvoID={setConvoID}/>
                        ))  
                    }
            </div>
        </>
    )
}

export default ChatHistory