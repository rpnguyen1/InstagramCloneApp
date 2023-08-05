import React,{useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import M from 'materialize-css'

const Signup = ()=>{
    const navigate = useNavigate();
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)


    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])

    const uploadPic = () =>{
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
            setUrl(data.url)
            console.log(data.url)
        })
        .catch (err=>{
            console.log(err)
            console.log("URL is " + url)
        })
    
        
    }   

    const uploadFields = ()=>{
        if(!/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm.test(email)){
            M.toast({html: "Invalid email", classes:"#c62828 red darken-3"})
            return;
        }
        fetch("http://localhost:5000/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                //navigate("/profile");
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
                
            }else{
                M.toast({html: data.message, classes:"#69f0ae green accent-2"})
                navigate("/login");
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const PostData = (e) => {
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
        
        e.preventDefault();
    }

    const testttt = () => {
        {console.log("clicked the buttosdfsfn")}
        navigate("/login");
    }

    return (
        <div className="mycard">
            <div className="card auth-card" >
                <h2>GRAMMM!</h2>
                {/* <p>Please register to continue.</p> */}
                {/* <Link to="/login" >Have an account? Log in</Link> */}
                <form onSubmit={PostData}>
                    {/* <label htmlFor="email">Email:</label> */}
                    <input type="email" id="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <br />
                    {/* <label htmlFor="username">Username:</label> */}
                    <input type="text" id="username" placeholder="Username" value={name} onChange={(e)=>setName(e.target.value)}/>
                    <br />
                    {/* <label htmlFor="password">Password:</label> */}
                    <input type="password" id="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <br />
                    <div className="file-field input-field">
                        <div className="btn #64b5f6 blue darken-1">
                            <span>Upload Pic</span>
                            <input type="file" onChange={(e)=>{
                                setImage(e.target.files[0])
                                console.log(image)
                                }}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text"/>
                        </div>
                    </div>
                    <br />
                    <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="submit" name="action">
                        Sign up
                    </button>
{/*onClick={() => PostData}*/}
                    {/* <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" type="button" onClick={testttt}>
                        test
                    </button> */}
                </form>         


            </div>

            <div className="card auth-card" >
                <Link to="/login" >Have an account? Log in</Link>
            </div>
        </div>
        
    )
}

export default Signup