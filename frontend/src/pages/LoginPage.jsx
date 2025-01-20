import { motion } from "framer-motion";
import { ArrowRight, Loader, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
  const { login, loading } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };
  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Login
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Email address"
                icon={Mail}
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />

              <Input
                label="Password"
                icon={Lock}
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*********"
              />

              <Button
                loading={loading}
                icon={loading ? Loader : LogIn}
                label="Login"
              />
            </div>
          </form>
        </div>
        <p className="mt-8 text-center text-sm text-gray-400">
          Not a member?{" "}
          <Link
            to="/signup"
            className="font-medium text-emerald-400 hover:text-emerald-300"
          >
            Sign up now <ArrowRight className="inline h-4 w-4" />
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
