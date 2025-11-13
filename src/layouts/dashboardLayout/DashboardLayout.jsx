import { Outlet } from 'react-router-dom';
import './dashboardLayout.css'
import ChatList from '../../components/chatList/ChatList';
import { useState } from 'react';

const DashboardLayout = () => {
    const [chatList, setChatList] = useState([]);

    return (
        <div className='dashboardLayout'>
            <div className="menu"><ChatList chatList={chatList} /></div>
            <div className="content">
                <Outlet context={[chatList, setChatList]} />
            </div>
        </div>
    )
}

export default DashboardLayout;
