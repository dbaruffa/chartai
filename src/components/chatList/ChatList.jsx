import { Link } from 'react-router-dom';
import './chatList.css'

const ChatList = ({chatList}) => {
    return (
        <div className='chatList'>
            <span className='title'>DASHBOARD</span>
            <Link to="/dashboard">Create a new Chat</Link>
            <hr />
            <span className='title'>RECENT CHATS</span>
            <div className='list'>
                {chatList?.map((chat) => (<Link to={`/dashboard/chats/${chat.id}`} key={chat.id}>{chat.title}</Link>))}
            </div>
        </div>
    )
}

export default ChatList;
