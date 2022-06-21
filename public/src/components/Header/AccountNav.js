import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuthContext } from "../../services/authContext/authContext"
import config from "../../config/config"

const AccountNav = () => {
    const { loggedIn, setLoggedIn, setUser } = useAuthContext()
    const navigate = useNavigate()

    const logOut = async () => {
        try {
            await axios.get(`${config.api.auth}/logout`)
            setLoggedIn(false)
            setUser(undefined)
            navigate("/")

        } catch (error) {
            console.log(error)
        }
    }

    return <ul className="account-nav-list">
        {loggedIn ? <>
            <li className="account-item">
                <Link
                    to="/my-recipes"
                    className="account-nav-list-link my-recipes-link"
                >
                    my recipes
                </Link>
            </li>
            <li className="account-item">
                <Link
                    to="/profile/me"
                    className="account-nav-list-link my-account-link"
                >
                    my profile
                </Link>
            </li>
            <li>
                <button className="log-out-btn" onClick={logOut}>log out</button>
            </li>
        </> : <>
            <li>
                <Link to="/login" className="login-link">
                    log in
                </Link>
            </li>
            <li>
                <span>or</span>
            </li>
            <li>
                <Link to="/create-account" className="create-account-link">
                    create account
                </Link>
            </li>
        </>}

    </ul>
}

export default AccountNav