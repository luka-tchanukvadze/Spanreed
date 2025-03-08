import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function useLogout() {
  const [loading, setLoding] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoding(true);

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      setAuthUser(null);
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoding(false);
    }
  };

  return { loading, logout };
}
export default useLogout;
