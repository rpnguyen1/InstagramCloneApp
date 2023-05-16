import React,{useState,useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import {UserContext} from '../../App.js'
import M from 'materialize-css'
//import "../../App.css"

const Login = ()=>{
    const {state,dispatch} = useContext(UserContext)
    const navigate = useNavigate();
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const PostData = (event) => {
        
        if(!/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm.test(email)){
            M.toast({html: "Invalid email", classes:"#c62828 red darken-3"})
            return;
        }
        fetch("http://localhost:5000/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                //navigate("/profile");
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
                
            }else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER", payload:data.user})
                M.toast({html: "Logged in sucessfully", classes:"#69f0ae green accent-2"})
                navigate("/");
            }
        })
        .catch(err=>{
            console.log(err)
        })
        event.preventDefault();
    }
    return(
        //<h1>Login</h1>
        <div className="mycard">

            <div className="card auth-card" >
                <h2>Omorigram!</h2>
                {/* <p>Please register to continue.</p> */}
                {/* <Link to="/signup" >Don't have an account? Sign up</Link> */}
                <form onSubmit={PostData}>
                    {/* <label htmlFor="email">Email:</label> */}
                    <input type="email" id="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <br />
                    {/* <label htmlFor="password">Password:</label> */}
                    <input type="password" id="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <br />
                    <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action">
                        Login
                    </button>
                    {/* <button type="submit">Login</button> */}
                </form>
            </div>

            <div className="card auth-card" >
                <Link to="/signup" >Don't have an account? Sign up</Link> 
            </div>


        </div>
    )
}

export default Login