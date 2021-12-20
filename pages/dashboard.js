import { useEffect, useState } from "react";
import Navbar from "./Navbar";

function Dashboard() {
  const [role, setRole] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("email")) {
        window.location.href = "/";
      }
      setRole(localStorage.getItem("role"));
    }
  }, []);
  return (
    <>
      <Navbar activeType="dashboard" />
      <h1>{role}</h1>
    </>
  );
}

export default Dashboard;
