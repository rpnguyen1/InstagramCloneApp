import React,{useEffect, useState, useContext} from "react";
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const UserProfile = ()=>{
    const {state,dispatch} = useContext(UserContext)
    
    const [userProfile,setProfile] = useState(null)
    const {userid} = useParams()
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    //console.log(userid)
    useEffect(()=>{
        fetch(`http://localhost:5000/user/${userid}`,{
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            //setPics(result.mypost)
            setProfile(result)
        })

    },[])

    const followUser = ()=>{
        fetch(`http://localhost:5000/follow`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            console.log("Hide follow")

            setShowFollow(false)
        })
    }

    const unfollowUser = ()=>{
        fetch(`http://localhost:5000/unfollow`,{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id)

                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            console.log("Show follow")
            setShowFollow(true)
        })
    }
    return (
        <>
        {userProfile ? 
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
                        <h4>{userProfile.user.name}</h4>
                        <h5>{userProfile.user.email}</h5>
                        <div style={{display:"flex", justifyContent:"space-between", width:"108%", margin:"0px 20px auto", textAlign:"center"}}>
                            <div >
                                <h5>{userProfile.posts.length}</h5>
                                <h6>Posts</h6>
                            </div>
                            <div  >
                                <h5>{userProfile.user.followers.length}</h5>
                                <h6>followers</h6>
                            </div>
                            <div >
                                <h5>{userProfile.user.following.length}</h5>
                                <h6>following</h6>
                            </div>

                            {showfollow?
                                <button style={{
                                margin:"10px"
                                }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                onClick={()=>followUser()}
                                >
                                    Follow
                                </button>
                            :
                                <button style={{
                                margin:"10px"
                                }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                onClick={()=>unfollowUser()}
                                >
                                    Unfollow
                                </button>
                            }
                            
       
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

                    {userProfile.posts?userProfile.posts.map(item=>{return(<img key={item._id} className="item" alt={item.title} src={item.photo}/>)}):console.log("world")}
                    
                </div>
            </div>

        : <h2>Loading...</h2>}
        
        </>
    )
}

export default UserProfile