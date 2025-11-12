import { Link } from "react-router-dom"
import './homepage.css'

const Homepage = () => {
    return (
        <div className='homepage'>
            {/*<img src="..." alt="", className="orbital" />*/}
            <div className="left">
                <h1>ChartAI</h1>
                <h2>Create charts :D</h2>
                <Link to="/dashboard">Get Started</Link>
            </div>
            <div className="right">...</div>
        </div>
    )
}

export default Homepage
