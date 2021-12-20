import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Card } from "semantic-ui-react";
import axios from "axios";

function Dashboard() {
  const [role, setRole] = useState("");
  const [id, setId] = useState('');
  const [tourArr, setTourArr] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
      setId(localStorage.getItem('id'));
    }
    if (!tourArr) {
      axios.get(`/api/getCustomerTours/${id}`).then((res) => {
        setTourArr(res.results);
      }).catch(e => console.error(e));
    } 
  }, [tourArr, id]);
  return (
    <>
      <Navbar activeType="dashboard" />
      <div style={{margin:'30px'}}>
        <Card.Group>
          <Card
            color="red"
            header="Istanbul Tour"
            meta="Istanbul"
            description="Start Date: 21.10.2021 Start Time: 21.00 End Date: 22.10.2021 End Time: 09.00"
          />
          <Card
            color="red"
            header="Istanbul Tour"
            meta="Istanbul"
            description="Start Date: 21.10.2021 Start Time: 21.00 End Date: 22.10.2021 End Time: 09.00"
          />
          <Card
            color="red"
            header="Istanbul Tour"
            meta="Istanbul"
            description="Start Date: 21.10.2021 Start Time: 21.00 End Date: 22.10.2021 End Time: 09.00"
          />
          <Card
            color="red"
            header="Istanbul Tour"
            meta="Istanbul"
            description="Start Date: 21.10.2021 Start Time: 21.00 End Date: 22.10.2021 End Time: 09.00"
          />
          <Card
            color="red"
            header="Istanbul Tour"
            meta="Istanbul"
            description="Start Date: 21.10.2021 Start Time: 21.00 End Date: 22.10.2021 End Time: 09.00"
          />
          <Card
            color="red"
            header="Istanbul Tour"
            meta="Istanbul"
            description="Start Date: 21.10.2021 Start Time: 21.00 End Date: 22.10.2021 End Time: 09.00"
          />
          {tourArr && tourArr.map((e) => {})}
        </Card.Group>
      </div>
    </>
  );
}

export default Dashboard;
