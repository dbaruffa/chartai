import { Link } from 'react-router-dom';
import './chatList.css'

const ChatList = () => {
    return (
        <div className='chatList'>
            <span className='title'>DASHBOARD</span>
            <Link to="/dashboard">Create a new Chat</Link>
            <hr />
            <span className='title'>RECENT CHATS</span>
            <div className='list'>
                <Link to="/">Chat 1</Link>
                <Link to="/">Chat 2</Link>
            </div>
        </div>
    )
}

export default ChatList;
