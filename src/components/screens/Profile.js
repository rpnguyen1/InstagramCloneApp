import React,{useEffect, useState, useContext} from "react";
import {UserContext} from '../../App'

const Profile = ()=>{
    const {state,dispatch} = useContext(UserContext)
    const [myPics,setPics] = useState()
    useEffect(()=>{
        fetch('http://localhost:5000/mypost',{
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.mypost)
            console.log(state)
        })

    },[])

    return (
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                    display:"flex",
                    justifyContent: "space-around",
                    margin:"18px 0px",
                    borderBottom:"1px solid grey"
                }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                        src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cGVyc29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1000&q=60"
                        alt="profile"
                    />
                </div>
                <div>
                    <h4>{state?state.name:"loading"}</h4>
                    <h5>{state?state.email:"loading"}</h5>
                    <div style={{display:"flex", justifyContent:"space-between", width:"108%", margin:"0px 20px auto", textAlign:"center"}}>
                        <div >
                            <h5>{myPics?myPics.length:"0"}</h5>
                            <h6>Posts</h6>
                        </div>
                        <div  >
                            <h5>{state?state.followers.length:"?"}</h5>
                            <h6>followers</h6>
                        </div>
                        <div >
                            <h5>{state?state.following.length:"?"}</h5>
                            <h6>following</h6>
                        </div>
                        {/* <h6>40 posts</h6>
                        <h6>40 followers</h6>
                        <h6>40 following</h6> */}
                    </div>
                </div>
            </div>

            <div className="gallery">
                        {/* {console.log(myPics[0])} */}
                {/* {            
                myPics.map(item=>{
                    return(
                        <img className="item" alt={item.title} src={item.photo}/>
                    )
                })} */}

                {myPics?myPics.map(item=>{return(<img key={item._id} className="item" alt={item.title} src={item.photo}/>)}):console.log("world")}
                
            </div>
        </div>

        
    )
}

export default Profile