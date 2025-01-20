import { motion } from "framer-motion";
import { ArrowRight, Loader, Lock, Mail, User, UserPlus } from "lucide-react";
import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
  const { signup, loading } = useUserStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData.name, formData.email, formData.password, formData.confirmPassword);
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
          Create your account
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
                label="Full name"
                icon={User}
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Hammad"
              />

              <Input
                label="Email address"
                icon={Mail}
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@example.com"
              />

              <Input
                label="Password"
                icon={Lock}
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="*********"
              />

              <Input
                label="Confirm Password"
                icon={Lock}
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="*********"
              />

              <Button
                loading={loading}
                icon={loading ? Loader : UserPlus}
                label="Sign up"
              />
            </div>
          </form>
        </div>
        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-emerald-400 hover:text-emerald-300"
          >
            Login here <ArrowRight className="inline h-4 w-4" />
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
