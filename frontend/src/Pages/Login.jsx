import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoading(true);

    fetch("http://localhost:3000/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // <-- sends cookie to backend
      body: JSON.stringify(loginDetails),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("email", loginDetails.email);
          alert(data.message || "Login successful!");
          navigate("/dashboard");
        } else {
          alert(data.message || "Login failed");
        }
      })
      .catch((err) => {
        console.error("Login error", err);
        alert("Something went wrong.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 mb-2 border rounded"
        onChange={(e) =>
          setLoginDetails((prev) => ({ ...prev, email: e.target.value }))
        }
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-4 border rounded"
        onChange={(e) =>
          setLoginDetails((prev) => ({ ...prev, password: e.target.value }))
        }
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
};

export default Login;
