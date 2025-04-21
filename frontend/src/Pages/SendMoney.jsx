import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

const SendMoney = () => {
  const [accountdetails, setAccountDetails] = useState({
    toAccountId: '',
    amount: null
  })

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setAccountDetails(prev => ({ ...prev, toAccountId: id }))
  }, [id])

  function handleMoneyTransfer() {
    fetch("http://localhost:3000/api/v1/account/send-money", {
      method: "POST",
      body: JSON.stringify(accountdetails),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })
      .then(async (res) => {
        const data = await res.json()
        alert(data.message)
        navigate('/dashboard')
      })
      .catch((err) => {
        console.error('Error in sending money ', err)
      })
  }

  return (
    <div>
      <p>Sending money to USER: {id}</p>
      <p>Enter the amount</p>
      <input
        onChange={(e) => {
          setAccountDetails(prev => ({
            ...prev,
            amount: Number(e.target.value)
          }))
        }}
        type="number"
        required
      />
      <button onClick={handleMoneyTransfer}>Send money</button>
    </div>
  )
}

export default SendMoney
