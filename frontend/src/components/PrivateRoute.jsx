import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/user", {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json()
        if (data.success) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      })
      .catch((err) => {
        console.error("Error in Authentication", err)
        setIsAuthenticated(false)
      })
  }, [])

  if (isAuthenticated === null) return <p>Loading...</p>

  return isAuthenticated ? children : <Navigate to="/login" />
}

export default PrivateRoute