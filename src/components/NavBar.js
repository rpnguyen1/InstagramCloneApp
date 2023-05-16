import React, {useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import {UserContext} from '../App.js'


const NavBar = ()=>{
  const {state,dispatch} = useContext(UserContext)
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user"))
  const renderList = ()=>{
    if (user){
      return[
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/create">Create</Link></li>,
        <li>
          <button className="btn #e53935 red darken-1" type="button" name="action" 
          onClick={()=>{
            localStorage.clear()
            dispatch({type:"CLEAR"})
            navigate("/login");
            //window.location.reload()
          }}>
              Logout
          </button>
        </li>
      ]
    }else{
      return[
        <li><Link to="/login">Login</Link></li>,
        <li><Link to="/signup">Signup</Link></li>
      ]
    }
  }
    return(
        <nav>
        <div className="nav-wrapper white" >
          <Link to={state?"/":"/login"} className="brand-logo left">Bruingram!</Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
            {/* <li><Link to="/create">Create</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/profile">Profile</Link></li> */}
          </ul>
        </div>
      </nav>
            
    )
}

export default NavBar