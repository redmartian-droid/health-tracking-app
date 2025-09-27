import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      console.log("Attempting to sign in with:", email); // Debug log
      const res = await signInWithEmailAndPassword(email, password);
      console.log("Sign in successful:", res); // Debug log
      setEmail("");
      setPassword("");
    } catch (e) {
      console.error("Sign in error:", e.code, e.message); // Detailed error log
      // Temporary alert to see if we're actually hitting the catch block
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className=" p-10 w-96">
        <h1 className="text-green-800 text-2xl mb-5">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-white rounded outline-none text-white placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-white rounded outline-none text-white placeholder-gray-500"
        />
        <button
          onClick={handleSignIn}
          className="bg-green-500 border-b-4 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
          style={{ borderBottomColor: " #16A34A" }}
        >
          Sign In
        </button>
        <p className="text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-green-500 hover:text-green-800"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
