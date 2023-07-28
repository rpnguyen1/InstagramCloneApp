import React, {useEffect, createContext, useReducer, useContext} from 'react';
import NavBar from './components/NavBar';
import "./App.css"
import {BrowserRouter,Route, Routes, useNavigate} from 'react-router-dom'

import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import {reducer, initialState} from './reducers/userReducer'

export const UserContext = createContext()

const Routing = ()=>{
  
  const navigate = useNavigate()
  //const userContext = React.useContext(UserContext);
  // 
  const {state,dispatch} = useContext(UserContext)
  //const {state,dispatch} = React.useContext(UserContext)
  //static contextType
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    //const {state,dispatch} = userContext
    if(user){
      //dispatch({ type: "USER" , payload:user})
      //dispatch()
      //console.log("state and dispatch!!! " + state + dispatch)
      //console.log("User is logged in!!")
      dispatch({ type: "USER", payload:user})
      //console.log("dispatch worked?")
      //navigate("/")
    }else{
      navigate("/login")
    }
  },[])
  return(
    <>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route exact path="/profile" element={<Profile />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/create" element={<CreatePost />}/>
        <Route path="/profile/:userid" element={<UserProfile />}/>
      </Routes>
      <div>
        <center>  
          You have been living here ever since you remember
        </center>
      </div>
    </>

  )
}



// function testFunct(d){
//   const user = JSON.parse(localStorage.getItem("user"))
//   d({ type: "USER" , payload:user})
//   console.log("DISPATCH CALL!!")
// }

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  const user = JSON.parse(localStorage.getItem("user"))
  //dispatch({ type: "USER", payload:user})
  return (
    <UserContext.Provider value={{state,dispatch}}>
      {/* {console.log("CURRENT STATEff" + state)}
      {/* <button onClick={() => dispatch({ type: "USER" , payload:user})}>Increment</button>
      <button onClick={() => testFunct(dispatch)}>funct</button> } */}

      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>

    
  );
}

export default App;