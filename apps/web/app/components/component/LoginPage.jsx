"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
    const res = await axios.post(`${API_URL}/home/Login`, {
      useremail: email,
      password: password,
    });

    const token = res.data.msg;
    console.log(token);
    if (!token) {
      alert("Kindly signup again");
    } else {
      sessionStorage.setItem("token", token);
      router.push("/admin/dashboard");
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center">
              <div className="h-6 w-6 bg-[#1c3f39] rounded-full"></div>
              <span className="ml-2 text-xl font-semibold text-[#1c3f39]">
                HospitEase
              </span>
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#1c3f39]">
              Welcome back!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your details.
            </p>
          </div>

          <div className="mt-8">
            <div>
              <div>
                <Button variant="outline" className="w-full text-[#1c3f39]">
                  Log in with Google
                </Button>
              </div>

              <div className="mt-6 relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {/* Changed from form to div */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox id="remember-me" />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember for 30 days
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-[#1c3f39] hover:text-blue-500"
                    >
                      Forgot password
                    </a>
                  </div>
                </div>

                <div>
                  <Button
                    type="button" // Changed type to "button"
                    onClick={handleLogin}
                    className="w-full bg-[#1c3f39] text-white hover:bg-[#1c3f39] hover:shadow-sm hover:shadow-[#1c3f39]"
                  >
                    Log in
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-10 text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <a
              href="/patient/signup"
              className="font-semibold leading-6 text-[#1c3f39] hover:text-blue-500"
            >
              Sign up for free
            </a>
          </p>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-[#285951] opacity-50"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold mb-4">
              Behind every great healthcare professional is the power to make
              informed decisions.
            </h2>
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0"></div>
              <div className="ml-4">
                <div className="text-lg font-semibold">Dr. Jonathan Wells</div>
                <div className="text-sm opacity-75">
                  Renowned healthcare strategist{" "}
                </div>
                <div className="text-sm opacity-75">
                  St. Ignatius Medical Center
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
