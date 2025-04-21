import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-center">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome to Paytm Clone 💸</h1>
      <p className="text-gray-600 mb-6">Secure payments, quick transfers, and more.</p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-white border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-100 transition"
        >
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Home;
