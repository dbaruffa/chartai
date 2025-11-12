import './dashboardPage.css'

const DashboardPage = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        const userId = "the_one_and_only_user";
        
        if(text) {
            // TODO: create new chat
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
                <form onSubmit={handleSubmit}>
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
