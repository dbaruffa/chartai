import './dashboardPage.css'
import { useOutletContext } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const [_, setChatList] = useOutletContext();
    const navigate = useNavigate();

    const createNewChat = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        
        if(text) {
            const newChatId = crypto.randomUUID();

            setChatList((current) => {
                return [...current, {
                    id: newChatId,
                    title: text.substr(0, 40),
                    created: Date.now(),
                    history: [
                        {
                            role: "user",
                            text: text,
                            imgPath: null,
                            timestamp: Date.now()
                        }
                    ]
                }];
            });
            
            navigate(`/dashboard/chats/${newChatId}`);
        }
    }

    return (
        <div className='dashboardPage'>
            <div className='texts'>
                <div className="logo">
                    <img src="/logo.png" alt="" />
                    <h1>CHART AI</h1>
                </div>
            </div>
            <div className='formContainer'>
                <form onSubmit={createNewChat}>
                    <input type='text' name="text" placeholder='Ask me anything...'></input>
                    <button>
                        <img src="/arrow.png" alt="" />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default DashboardPage
