import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Signup = () => {
  const[signupDetails, setSignupDetails] = useState({
    name:'',
    email:'',
    password:'',
    phone:'',
  })
  const[loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleSignup(){
    setLoading(true)
    fetch("http://localhost:3000/api/v1/signup",{
      method: "POST",
      body: JSON.stringify(signupDetails),
      headers:{
        "Content-Type" : "application/json"
      },
      credentials: "include"

    }).then(async(res)=> {
      const data = await res.json()
      if(data.success){
        localStorage.setItem("email", signupDetails.email)
        alert(data.message)
        navigate('/verify')
      }else{
        if(data.error && Array.isArray(data.error)) {
          data.error.forEach((err)=> {
            console.log(`${err.field} : ${err.message}`)
          })
        } else{
          alert(data.message || "signup failed")
        }
      }
    }).catch((err)=>{
      console.error("signup error ", err)
    })
    .finally(()=>{
      setLoading(false)
    })
  }
  return (
    <div>
      <input onChange={(e)=> {
        setSignupDetails(prev => ({
          ...prev,
          name: e.target.value
        }))
      }} type="text" placeholder='Enter your name' required /> <br />
      <input onChange={(e)=> {
        setSignupDetails(prev => ({
          ...prev,
          email: e.target.value
        }))
      }} type="text" placeholder='Enter your Email' required /> <br />
      <input onChange={(e)=> {
        setSignupDetails(prev => ({
          ...prev,
          phone: e.target.value
        }))
      }} type="number" placeholder='Phone number' required /> <br />
      <input onChange={(e)=> {
        setSignupDetails(prev => ({
          ...prev,
          password: e.target.value
        }))
      }} type='password' placeholder='Password' required /> <br />
      <button disabled={loading} onClick={handleSignup}>{loading ? "Signing up..." : "Signup"}</button>
    </div>
  )
}

export default Signup