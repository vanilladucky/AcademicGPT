import React, { useState } from 'react';

function TextBox({convo, setConvo, setConvoID, setHistoryList}){
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);

    const handleKeyDown = async (event) => {
        if (event.key === 'Enter' && question != '') {
          event.preventDefault(); // Prevent form submission or page refresh
          setLoading(true); // Set loading to true to disable further input
          setConvo((prevData)=>[...prevData, ...[{"text": question, "user": "User"}, {"text": "Thinking...", "user": "Thinking"}]]);
          // Make GET request when Enter is pressed
          try {
            const response = await fetch(`http://127.0.0.1:8000/LLM_response/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  query_text: question,
                  convo: convo
              }),
            });
            const data = await response.json();
            console.log(data);  // Handle the response data
            if (data.response == "Error!") {
              window.location.href="/error"
              throw new Error("HF API not working!"); 
            }
            let childdata = [{"text":data.response, "user": "LLM"}]
            //console.log(childdata)
            // create convo in MongoDB
            if (convo.length == 0) {
              const convoID = await fetch('http://127.0.0.1:8000/convo/', {
              method:"POST",
              headers: {"content-type": "application/json",'Access-Control-Allow-Origin':'*'},
              body: JSON.stringify({
                user: localStorage.getItem('userID'),
                convo: [{"text": question, "user": "User"}, {"text":data.response, "user": "LLM"}] 
              })
              }).then(response => response.json())
              .then(data => {
                setConvoID(data._id);
                let historyItem = [{'convoID':data._id, 'display': question, 'userID': localStorage.getItem('userID')}]
                setHistoryList((prev)=>[...prev, ...historyItem])
              })
            }
            setConvo((prevData)=>[...prevData.slice(0, -1), ...childdata]);
            setQuestion("");
            } catch (error) {
            console.log('Error fetching data:', error);
            } finally {
            setLoading(false); // Set loading to false once the request completes
            }
        }
    };

    return (
                <div style={{width:'55%'}}>
                    <input type="question"
                            class="form-control rounded border-dark" 
                            id="question_asked" 
                            placeholder='Message AcademicLLM'
                            value={loading ? "Please wait..." : question}
                            onChange={(e) => setQuestion(e.target.value)} // Update the state with input value
                            onKeyDown={handleKeyDown} // Handle Enter key press
                            disabled={loading} // Disable input when loading
                    />
                </div>
    )
}

export default TextBox