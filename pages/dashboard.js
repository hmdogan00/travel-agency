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
    if (role === 'Customer' && !tourArr) {
      axios.get(`/api/getCustomerTours/${id}`).then((res) => {
        setTourArr(res.data.result);
      }).catch(e => console.error(e));
    } 
  }, [tourArr, id, role]);
  return (
    <>
      <Navbar activeType="dashboard" />
      { role === "Customer" && <div style={{margin:'30px'}}>
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
          {tourArr && tourArr.map((e, i) => {
            const startDate = e.start_date.split('T')[0].replaceAll('-','.');
            const startTime = e.start_date.split('T')[1].substr(0,5);
            const endDate = e.end_date.split('T')[0].replaceAll('-','.');
            const endTime = e.end_date.split('T')[1].substr(0,5);
            return <Card
              key={`card-${i}`}
              color="red"
              header={e.name}
              meta={e.location}
              description={`Start Date: ${startDate} Start Time: ${startTime} End Date: ${endDate} End Time: ${endTime}`}
            />;
          })}
        </Card.Group>
      </div>}
    </>
  );
}

export default Dashboard;
