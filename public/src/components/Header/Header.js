import { Link, NavLink } from "react-router-dom";

//components
import AccountNav from "./AccountNav";

// logo
import logo from "../../assets/logo/logo_color.svg";

// styles
import "../../styles/header/header.css";

const Header = () => {
    return (
        <header id="header">
            <div className="header-content-wrapper">
                <Link to="/" activeClassName="active">
                    <img src={logo} alt="LOGO" className="logo" />
                </Link>
                <nav>
                    <ul className="nav-list">
                        <li>
                            <NavLink
                                to="/recipes/breakfast"
                                className="type-list-item"
                                activeclasscame="active"
                            >
                                breakfast
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/recipes/brunch"
                                className="type-list-item"
                                activeclassname="active"
                            >
                                brunch
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/recipes/lunch"
                                className="type-list-item"
                                activeclassname="active"
                            >
                                lunch
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/recipes/dinner"
                                className="type-list-item"
                                activeclassname="active"
                            >
                                dinner
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <AccountNav />
            </div>
        </header>
    );
};

export default Header;
