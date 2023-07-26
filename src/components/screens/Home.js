import React,{useState, useEffect} from "react";


const Home = ()=>{
    const [data,setData] = useState([])
    useEffect(()=>{
        fetch('http://localhost:5000/allpost',{
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
            setData(result)
        })
    },[])
    return(
        <div className="home">
            {
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <h5>{item.postedBy.name}</h5>
                            <div className="card-image">
                                <img key={item._id} alt="post" src={item.photo}/>
                            </div>
                            <div className="card-content">
                                <i className="material-icons favorite" style={{color:"red"}}>favorite</i>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                <input type="text" placeholder="add a comment"/>
                            </div>
                        </div>
                    )
                }).reverse()
            }
            

        </div>
    )
}

export default Home