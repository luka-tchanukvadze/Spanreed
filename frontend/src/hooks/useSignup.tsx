import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

type SignUpInputs = {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: string;
};

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async (inputs: SignUpInputs) => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setAuthUser(data);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

const useLogout = () => {};

export default useSignup;
