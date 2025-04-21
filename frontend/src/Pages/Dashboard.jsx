import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import Logout from "../components/Logout";

const Dashboard = () => {
  const [user, setuser] = useState({});
  const [filter, setfilter] = useState("");
  const[users, setUsers] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/user", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setuser(data.user);
        } else {
          alert(data.message) || "Need to login";
        }
      })
      .catch((err) => {
        console.error("Error in fetching user ", err);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/users?filter="+filter,{
      method:"GET",
      credentials:"include",
    }).then((res)=> res.json())
    .then(data => {
      if(data.success){
        setUsers(data.users)
      }else{
        alert(data.message) || "problem in fetching users"
      }
    }).catch((err)=> {
      console.error('Error inn fetching the users ', err)
    })
  }, [filter]);
  
  return (
    <div className="parent-div">
      <div className="welcome-container">
        <div className="welcome-div">
          <p>Hi {user?.name}</p>
          <h4>Welcome to Paytm</h4>
        </div>
        <div>
          <Logout />
        </div>
      </div>
      <div className="search">
        <p>Seach users to send the money</p>
        <input value={filter} placeholder="Search user..." style={{width:"99%", height:"30px"}}
          onChange={(e) => {
            setfilter(e.target.value);
          }}
          type="text"
        />
      </div>
      <div className="users">
        {users.map(user=> (
          <div key={user._id} style={{display:"flex", justifyContent:"space-between", border:"1px solid #ccc", padding: "10px", marginBottom: "8px", borderRadius: "5px", marginTop:"20px" }}>
            <p style={{ margin: 0, fontWeight: "bold" }}>{user.name}</p>
            <p style={{ margin: 0 }}>{user.phone}</p>
            <p style={{ margin: 0 }}>{user.email}</p>
            <button onClick={()=>navigate(`/send-money/${user._id}`)} style={{color:"white", backgroundColor:"green", borderRadius:"5px", padding:"5px"}}>Send money</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
