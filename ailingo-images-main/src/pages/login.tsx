import { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      // Save token
      localStorage.setItem("token", res.data.token);

      toast.success("Logged in!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-neutral-900 text-white border-neutral-800">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="bg-neutral-800 text-white"
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-neutral-800 text-white"
            />
          </div>

          <Button onClick={handleLogin} className="w-full mt-4">
            Login
          </Button>

          <p className="text-center text-sm mt-2 text-neutral-400">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-400 cursor-pointer"
            >
              Register
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
