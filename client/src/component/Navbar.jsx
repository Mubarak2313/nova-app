import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const {  user, logout} = useAuth()
    const navigate = useNavigate();

    const handleLogOut = () =>{
        logout()
        navigate("/login")
    }

    return(
        <nav className="navbar">
            <Link to="/" className=""navbar-brand>
            NOVA
            </Link>
            <div className="navbar-right">
            <div className="avatar" style={{background: user?.avatarColor }}>
                {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="navbar-username">
            {user?.name}
            </span>
            <button className="btn-link" onClick={handleLogOut}>Logout</button>
            </div>
        </nav>
    )
};

export default Navbar;
