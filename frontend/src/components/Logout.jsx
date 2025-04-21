import { useNavigate } from "react-router-dom"

const Logout = () => {
  const navigate = useNavigate()

  function handleLogout(){
    fetch("http://localhost:3000/api/v1/logout",{
      method: "POST",
      credentials: "include"
    }).then(async(res)=>{
      const data = await res.json()
      if(data.success){
        alert(data.message)
        navigate('/')
      }else{
        alert(data.message || "Logout failed!")
      }
    }).catch((err)=>{
      console.error('Log out error ', err)
    })
  }
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Logout