# **AcademicGPT** 📚
## An AI companion for students - developed by a fellow student

# Introduction 

### Have you ever come across answers from ChatGPT that you just know isn't true? 
### Have you ever wished ChatGPT could take a look at your notes and help you like a teacher?
### Well! Here is **AcademicGPT** to help you in your academic journey. 
### Specifically tailored to Computer Science students in Nanyang Technological University, AcademicGPT will not only be able to answer your questions more reliably, but will also be able to point you to the relevant lecture materials for you to explore further. 

# Motivation 💡

### Interested in AI with a hunger for engineering new things, this idea came to me throughout my university years. Me and my friends use ChatGPT extensively but always come across times where it generates answers we know are wrong and we would have to either Google or ask our professors which, as all university students know, take too long... 
### That's when this project idea came to me. An AI chat application based off a RAG concept. 
### Students would be able to finally get more reliable answers and would even know which lecture materials to look at, provided by the application. 
### Spawned from a needs and wants of me and my friends, I was able to come up with a webpage that achieves this idea that spawned in my head a few months ago. 
### It is completely free of charge so any NTU students are more than welcome to use it. However, it being free of charge, the response time might suffer a bit despite all my engineering efforts to provide a smooth user experience. If the user base grows in the future, investing money into this project could definitely become a possibility. 

# Usage

### Please login with your NTU student email, and enter the verification code that will be sent to the email address you have entered.
### Once verified, you will be able to access the chatting feature. 
### You can chat and ask any questions related to the courses mentioned in the website (more courses will be introduced in the future).
### The AI is equipped with memory feature so it remembers the previous conversations it had with you. Also, all your conversations will be stored so you can always come back to the website to continue on the conversation.
### The AI model will also provide some lecture material sources it consulted to give you the answer so that you can look into the materials if you wish to dive deeper.
![alt text](front/public/sources.png)

# Open Source

### I have purposefully made this website only applicable for NTU students. This is because the data that the AI model will base off its answers from are NTU lecture notes and they are intellectual property solely for NTU students. 
### However, I do not believe this should stop students from other universities creating a similar website for their own needs. Therefore, I am **open sourcing** all my code for anyone with some technical expertise to utilize. All you need is the determination to look through the code and change whatever is necessary to suit your needs. 
### All you would is a HuggingFace API, MongoDB database and a cloud server to host it, preferably. 
### In order to populate the MongoDB vector database with materials, simply add the pdf documents into the 'data' folder in the 'backend' folder and run `python3 populate_mongoDB.py`.
### This will embed all your documents and store it in MongoDB, minimizing computational resources needed on your local computer.

# Local run

### You are also to `git clone` my project and run it locally.
### Make sure to install both the python packages and node modules for the frontend and backend to run without any issues. 

## Contact:

### If you have any queries, problems, or suggestions please do reach out to me via my email below.
##### KIMH0004@e.ntu.edu.sg