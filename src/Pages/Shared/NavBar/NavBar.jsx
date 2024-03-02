import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import webLogo from "../../../assets/Images/SVG/logo.png";
import { Link } from "react-router-dom";
import { faHome, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const userName = user?.displayName;
  const userPhoto = user?.photoURL;
  const [color, setColor] = useState(false);
  const menu = (
    <>
      {user ? (
        <li>
          {" "}
          <span onClick={() => logOut()}>Logout</span>
        </li>
      ) : (
        <li>
          {" "}
          <Link to="/login">Login</Link>
        </li>
      )}
    </>
  );

  const centeredMenu = (
    <>
      <li className="hover:bg-indigo-400 hover:text-white rounded-lg">
        {" "}
        <Link to="/">
          {" "}
          <FontAwesomeIcon icon={faHome} /> Home
        </Link>
      </li>
      <li className="hover:bg-indigo-400 hover:text-white rounded-lg">
        {" "}
        <Link to="/search-bus">
          {" "}
          <FontAwesomeIcon icon={faMagnifyingGlass} /> Search Bus
        </Link>
      </li>
      <li className="hover:bg-indigo-400 hover:text-white rounded-lg">
        {" "}
        <Link to="/dashboard/profile">
          Dashboard 
        </Link>
      </li>
    </>
  );

  window.addEventListener('scroll', ()=>{
    window.scrollY>=60?setColor(true):setColor(false);
  })

  return (
    <div className={`navbar sticky top-0 z-50 bg-opacity-90 backdrop-blur-sm shadow-md`}>
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex="0" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow md:bg-transparent sm:bg-base-100 rounded-box w-52"
          >
            {centeredMenu}
            {menu}
          </ul>
        </div>
        <div className="navbar-center lg:navbar-center">
          <Link to="/">
            <img className="h-16" src={webLogo} alt="" />
          </Link>
        </div>
      </div>
      <div className="navbar-end hidden lg:flex justify-between">
        <div className={color ? "bg-white rounded-box":''}>
          <ul className="menu menu-horizontal p-0">{centeredMenu}</ul>
        </div>
        <div className={`flex ${color && 'bg-white rounded-box'}`}>
            {userPhoto && 
          <div className="avatar tooltip tooltip-bottom" data-tip={userName}>
            <div className="w-10 rounded-full">
              <img src={userPhoto} />
            </div>
          </div>}
          <div className="">
            <ul className="menu menu-horizontal p-0">{menu}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
