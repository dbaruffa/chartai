import './dashboardPage.css'
import { useOutletContext } from "react-router-dom";

const DashboardPage = () => {
    const [setChatList] = useOutletContext();

    const createNewChat = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        
        if(text) {
            setChatList((current) => {
                return [...current, {
                    id: crypto.randomUUID(),
                    title: text.substr(0, 40),
                    created: Date.now()
                }];
            });
        }
    }

    return (
        <div className='dashboardPage'>
            <div className='texts'>
                <div className="logo">
                    <img src="/logo.png" alt="" />
                    <h1>CHART AI</h1>
                </div>
                <div className="options">
                    <div className='option'><span>Create a new chat</span></div>
                    <div className='option'><span>Analyze image</span></div>
                    <div className='option'><span>Help me with my code</span></div>
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
