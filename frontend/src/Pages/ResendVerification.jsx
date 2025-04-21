import { useState } from "react"

const ResendVerification = () => {
  const[email, setEmail] = useState('')
  

  function resendVerificationOtpHandler(){
    const email = localStorage.getItem("email")
    setEmail(email)

    fetch("http://localhost:3000/api/v1/resend-verification-otp",{
      method: "POST",
      body: JSON.stringify({email: email}),
      headers:{ "Content-Type" : "application/json"},
      credentials: "include"
    }).then(async(res)=> {
      const data = await res.json()
      if(data.success){
        alert(data.message)
      }else{
        alert(data.message)
      }
    }).catch((err)=>{
      console.error("error in resending OTP ", err)
    })
  }
  return (
    <div>
      <p>didn't recived OTP?</p>
      <button onClick={resendVerificationOtpHandler}>Resend OTP</button>
    </div>
  )
}

export default ResendVerification