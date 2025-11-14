import './chatPage.css'
import NewPrompt from '../../components/newPrompt/NewPrompt'
import { useNavigate, useOutletContext } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Markdown from 'react-markdown';
import { useEffect } from 'react';

const ChatPage = () => {
    const [chatList, setChatList] = useOutletContext();
    const path = useLocation().pathname;
    const chatId = path.split("/").pop();
    const chat = chatList.find(chat => chat.id === chatId);

    const navigate = useNavigate();

    useEffect(() => {
        if(!chat) {
            navigate("/dashboard");
        }
    }, [chat]);

    return (
        <div className='chatPage'>
            <div className="wrapper">
                <div className="chat">
                    {
                        chat?.history?.map((entry, i) =>
                            <>
                            {entry.imgPath && (
                                <img src={entry.imgPath} alt="" id="image" />
                            )}
                            <div className={entry.role === "user"? "message user" : "message"} key={i.toString()}>
                                <Markdown>{entry.text}</Markdown>
                            </div>
                            </>
                        )
                    }
                    <NewPrompt chatList={chatList} setChatList={setChatList} />
                </div>
            </div>
        </div>
    )
}

export default ChatPage
