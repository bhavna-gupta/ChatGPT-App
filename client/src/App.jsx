import send from "./assets/send.svg";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loader from "./assets/loader.svg";
import { useState } from "react";
import axios from 'axios';
import { useEffect } from "react";

// let arr=[
//     {type:"user", post:"Hello Avatar"},
//     {type:"bot", post:"Hello User"},
// ];

function App() {
    const [input, setInput] = useState("");
    const [posts, setPosts] = useState([]);

    useEffect(()=>{
        document.querySelector(".layout").scrollTop=document.querySelector(".layout").scrollHeight;
    },[posts])
    const fetchBotResponse=async()=>{
        const {data}=await axios.post("https://chatgpt-app-gfas.onrender.com",{input},
        {
            headers:{
                "Content-Type":"application/json",
            },
        });
        return data;
    }
    const onSubmit=()=>{
        if(input.trim()==="") return;
        updatPosts(input);
        updatPosts("Loading...",false,true);
        setInput("");
        fetchBotResponse().then((res)=>{
            console.log(res);
            updatPosts(res.bot.trim(),true);
        }
       
        )
    }

    const autoTypingBotResponse=(text)=>{
        let index=0;
        let interval=setInterval(()=>{
            if(index<text.length){
                setPosts(prevState=>{
                    let lastItem=prevState.pop();
                    if(lastItem.type!=="bot"){
                    prevState.push({
                    type:"bot",
                    post:text.charAt(index-1)
                    })
                    }else{
                        prevState.push({
                            type:"bot",
                            post:lastItem.post + text.charAt(index-1)
                            })
                    }
                    return [...prevState]
                })
                index++;
            }else{
                clearInterval(interval);
            }
        },30)
    }
    const updatPosts=(post,isBot, isLoading)=>{
       if (isBot){
autoTypingBotResponse(post);
       }else{
        setPosts(prevState=>{
            return [...prevState, {type: isLoading ? "loading" : "user", post}]
        })
       }
    
    }

    const onKeyUp=(e)=>{
    if(e.key==='Enter' || e.which===13){
        onSubmit();
    }
    
    }
    return (<main className="chatGPT-app">
        <section className="chat-container">
            <div className="layout">
                {posts.map((post, index) => (
                    <div 
                    key={index}
                    className={`chat-bubble ${post.type === "bot" || post.type === "loading" ? "bot" : ""}`}>
                        <div className="avatar">
                            <img src={post.type === "bot" || post.type === "loading" ? bot : user} />
                        </div>

                        {post.type === "loading" ? (
                            <div className="loader">
                                <img src={loader} />
                            </div>
                        ) : (
                            <div className="post">
                                {post.post}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
        <footer>
            <input
                className="composebar"
                autoFocus
                type="text"
                placeholder="Ask Anything !!"
                onChange={(e)=> setInput(e.target.value)}
                onKeyUp={onKeyUp}
                value={input} />

            <div className="send-button">
                <img src={send} alt="send" 
                onClick={onSubmit}/>
            </div>
        </footer>
    </main>
    );
}

export default App;
