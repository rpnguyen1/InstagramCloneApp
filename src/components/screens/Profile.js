import React,{useEffect, useState, useContext} from "react";
import {UserContext} from '../../App'

const Profile = ()=>{
    const {state,dispatch} = useContext(UserContext)
    const [myPics,setPics] = useState()
    const [image,setImage] = useState("")
    //const [url,setUrl] = useState(undefined)
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

    useEffect(()=>{
        if(image){
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","Insta-clone")
            data.append("cloud_name","dksvfmzxo")
            console.log("UPLOADING!!!")
            fetch("https://api.cloudinary.com/v1_1/dksvfmzxo/image/upload", 
            {method:"post",
                body:data
            })
            .then(res=>res.json())
            .then(data=>{
                //setUrl(data.url)
                console.log(data)
                // localStorage.setItem("user", JSON.stringify({...state,pic:data.url}))
                // dispatch({type:"UPDATEPIC",payload:data.url})
                fetch('http://localhost:5000/updatepic',{
                    method: "put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    console.log(result)
                    localStorage.setItem("user", JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                })
            })
            .catch (err=>{
                console.log(err)
                //console.log("URL is " + url)
            })
        }
        
    },[image])
    const updatePhoto = (file)=>{
        setImage(file)
    }

    return (
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                        //display:"flex",
                        justifyContent: "space-around",
                        margin:"18px 0px",
                        borderBottom:"1px solid grey"
                    }}>
                <div style={{
                        display:"flex",
                        justifyContent: "space-around",
                        margin:"18px 0px",
                        //borderBottom:"1px solid grey"
                    }}>
                    <div>
                        <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                            src={state?state.pic:"loading"}
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
                <div className="file-field input-field" style={{margin:"10px 0px 10px 10px"}}>
                        <div className="btn #64b5f6 blue darken-1">
                            <span>Update Profile Pic</span>
                            <input type="file" onChange={(e)=>{
                                updatePhoto(e.target.files[0])
                                console.log(image)
                                }}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text"/>
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