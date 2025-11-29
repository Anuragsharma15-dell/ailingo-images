import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      console.log(res.data);

      navigate("/login"); // SUCCESS → go to login
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleRegister}
        className="bg-neutral-900 p-8 rounded-xl w-[380px] shadow-xl border border-neutral-800"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

        <div className="mb-4">
          <Label className="text-white">Name</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="bg-neutral-800 text-white"
          />
        </div>

        <div className="mb-4">
          <Label className="text-white">Email</Label>
          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="bg-neutral-800 text-white"
          />
        </div>

        <div className="mb-4">
          <Label className="text-white">Password</Label>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="bg-neutral-800 text-white"
          />
        </div>

        <Button className="w-full" disabled={loading} >
          {loading ? "Registering..." : "Register"}
          
        </Button>

        <p className="text-neutral-400 mt-4 text-sm">
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer ml-2"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
