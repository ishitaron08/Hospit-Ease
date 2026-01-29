"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = () => {
  const router = useRouter(); // Correct use of useRouter

  useEffect(() => {
    // Get token from sessionStorage
    const token = sessionStorage.getItem("token");

    // If no token, redirect to login page
    if (!token) {
      router.push("/patient/login");
    }
  }, [router]); // Dependency array should include 'router' to prevent unnecessary rerenders
};
