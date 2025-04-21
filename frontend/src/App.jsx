import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Verify from "./Pages/Verify";
import ResendVerification from "./Pages/ResendVerification";
import SendMoney from "./Pages/SendMoney";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/send-money/:id" element={<PrivateRoute><SendMoney /></PrivateRoute>} />

        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/resend-verification" element={<ResendVerification />} />
      </Routes>
    </div>
  );
}

export default App;
