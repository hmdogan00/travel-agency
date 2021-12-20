import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Card } from 'semantic-ui-react';
import axios from "axios";

function Dashboard() {
  const [role, setRole] = useState('');
  const [tourArr, setTourArr] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
    if ( !tourArr ){
      axios.get('/api/getCustomerTours').then((res) => {
        setTourArr(res.results);
      });
    }
  }, [tourArr]);
  return (
    <>
      <Navbar activeType="dashboard" />
      <h1>{role}</h1>
    </>
  );
}

export default Dashboard;
