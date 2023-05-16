import React,{useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import M from 'materialize-css'

const CreatePost = ()=>{
    const navigate = useNavigate();
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(()=>{
        if(url){
            fetch("http://localhost:5000/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:url
            })
            }).then(res=>res.json())
            .then(data=>{
            
                if(data.error){
                    //navigate("/profile");
                    M.toast({html: data.error, classes:"#c62828 red darken-3"})
                    
                }else{
                    M.toast({html: "Created post sucessfully", classes:"#69f0ae green accent-2"})
                    navigate("/");
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[url]) // kicks in when url changes
    

const postDetails = (e) =>{
    const data = new FormData()
    data.append("file",image)
    data.append("upload_preset","Insta-clone")
    data.append("cloud_name","dksvfmzxo")
    fetch("https://api.cloudinary.com/v1_1/dksvfmzxo/image/upload", 
    {method:"post",
        body:data
    })
    .then(res=>res.json())
    .then(data=>{
        setUrl(data.url)
    })
    .catch (err=>{
        console.log(err)
    })


    
    e.preventDefault();
}   

    return(
        <div className="card input-filed"
        style={{
            margin:"30px auto",
            maxWidth:"800px",
            padding:"50px",
            textAlign:"center"

        }}>

            <form onSubmit={postDetails}>
                <input 
                    type="text" 
                    placeholder="title" 
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                />
                <input 
                    type="text" placeholder="body"
                    value={body}
                    onChange={(e)=>setBody(e.target.value)}
                />

                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload Image</span>
                        <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" type="submit" name="action">
                    Submit Post
                </button>
            </form>
            
        </div>


    )
}

export default CreatePost