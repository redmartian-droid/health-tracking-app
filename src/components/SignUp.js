import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });
      setEmail("");
      setPassword("");
      // Navigation seems to be handled by the AuthWrapper component unlike in next.js router
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="p-10  w-96">
        <h1 className="text-green-800 text-2xl mb-5">Sign Up</h1>
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
          onClick={handleSignUp}
          className="bg-green-500 border-b-4 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
          style={{ borderBottomColor: " #16A34A" }}
        >
          Sign Up
        </button>
        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-green-500 hover:text-green-800"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
