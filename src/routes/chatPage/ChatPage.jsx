import './chatPage.css'
import NewPrompt from '../../components/newPrompt/NewPrompt'
import { useOutletContext } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Markdown from 'react-markdown';

const ChatPage = () => {
    const [chatList, setChatList] = useOutletContext();
    const path = useLocation().pathname;
    const chatId = path.split("/").pop();
    const chat = chatList.find(chat => chat.id === chatId);

    return (
        <div className='chatPage'>
            <div className="wrapper">
                <div className="chat">
                    {
                        chat?.history?.map((entry, i) =>
                            <>
                            {entry.img && (
                                <img src={entry.imgPath} alt="" id="image" />
                            )}
                            <div className={entry.role === "user"? "message user" : "message"} key={i.toString()}>
                                <Markdown>{entry.text}</Markdown>
                            </div>
                            </>
                        )
                    }
                    <NewPrompt />
                </div>
            </div>
        </div>
    )
}

export default ChatPage
