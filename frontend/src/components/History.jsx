function History({convoID, question, setConvo, setConvoID}) {

    const retrieve = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/retrieve/${convoID}`, {
              method: 'GET',
              headers: {"content-type": "application/json",'Access-Control-Allow-Origin':'*'},
            })
            const repsonse_json = await response.json()
            console.log(repsonse_json)
            setConvoID(repsonse_json._id)
            setConvo(repsonse_json.convo)
        } catch (error) {
            console.log("Error fetching data for chat history")
        }
    }

    return (
        <button className='border border-white justify-content-center text-white my-3 p-2 rounded mw-100'
        style={{ 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            width: '100%'
        }}
        onClick={retrieve}>
         {question}
     </button>
    )
}

export default History