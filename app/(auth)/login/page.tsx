"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("/api/login", { email, password });
      router.refresh();
    } catch (error: any) {
      toast({ title: "Login Failed", description: error?.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="isolate max-w-screen-sm mx-auto p-4 mt-32 rounded-3xl ">
      <h1 className="text-2xl font-bold text-center text-black ">LOGIN</h1>
      <Card className="mt-4 p-4 border-0 ">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-black">
            <Label className="text-xl">Email</Label>
            <Input
              className="mt-2 bg-gray-100 border-0"
              type="email"
              placeholder="user@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <div className="w-full flex justify-between text-black">
              <Label className="text-xl">Password</Label>
              
            </div>
            <div className= "flex flex-col">
              <Input
                className="mt-2 bg-gray-100 border-0"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Link href="/forgot-password">
              <span className="text-blue-500 cursor-pointer text-sm float-right mt-2 ">
                    Forgot Password?
                  </span>
                </Link>
              
            </div>
          </div>
          
          <div className="w-full flex justify-center">
            <Button disabled={loading} className="mt-4 w-1/2  items-center bg-blue-400 hover:bg-blue-300">
              {loading && <Loader className="mr-2 animate-spin" size={16} />}
              Login
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-black">
          <span>
            {"Don't have an account?"}
            <Link href="/register"> Register</Link>
          </span>
        </div>
      </Card>
    </main>
  );
}
