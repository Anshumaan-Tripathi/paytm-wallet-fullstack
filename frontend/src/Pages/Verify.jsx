import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Verify = () => {
  const[verificationDetails, setVerificationDetails] = useState({
    email:'',
    otp:''
  })
  const[loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleVerification(){
    setLoading(true)
    const email = localStorage.getItem("email")
    const payload = {
      ...verificationDetails,
      email: email
    }

    fetch("http://localhost:3000/api/v1/verify-verification-otp",{
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type" : "application/json"},
      credentials: "include"
    })
    .then(async(res)=> {
      const data = await res.json()
      if(data.success){
        navigate('/dashboard')
        alert(data.message || "Verified")
      }else{
        alert(data.message || "verification failed")
      }
    }).catch((err)=>{
      console.error('verification error ', err)
    }).finally(()=>{
      setLoading(false)
    })
  }
  return (
    <div>
      <h3>Enter the OTP</h3><br />
      <input onChange={(e)=>{
        setVerificationDetails(prev => ({
          ...prev,
          otp:e.target.value
        }))
      }} type="text" required/><br />
      <button onClick={handleVerification} disabled={loading} >{loading ? "verifying..." : "verify"}</button>
    </div>
  )
}

export default Verify