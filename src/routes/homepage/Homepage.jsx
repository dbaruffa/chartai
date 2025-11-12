import { Link } from "react-router-dom"
import './homepage.css'

const Homepage = () => {
    return (
        <div className='homepage'>
            <h1>ChartAI</h1>
            <h2>Create charts :D</h2>
            <Link to="/dashboard">Get Started</Link>
        </div>
    )
}

export default Homepage
