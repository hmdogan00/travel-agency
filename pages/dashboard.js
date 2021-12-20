import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Card, Header, Table, Button } from "semantic-ui-react";
import axios from "axios";

/**
 * Converts a database date object with format yyyy-mm-ddThh:mm:ss.msmsmsZ to two strings with format yyyy.mm.dd and hh:mm
 * @param {String} date
 * @returns an array with two strings said as above.
 */
const getDateTime = (date) => {
  const D = date.split("T")[0].replaceAll("-", ".");
  const T = date.split("T")[1].substr(0, 5);
  return [D, T];
};

function Dashboard() {
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [tourArr, setTourArr] = useState(null);

  const approveRes = (rId) => {
    axios.post('/api/employee/approveReservation', { id: rId } ).then(res => console.log).catch(e => console.error)
  };

  const declineRes = (rId) => {
    axios.post('/api/employee/declineReservation', { id: rId } ).then(res => console.log).catch(e => console.error)
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
      setId(localStorage.getItem("id"));
    }
    if (role === "Customer" && !tourArr) {
      axios
        .get(`/api/getCustomerTours/${id}`)
        .then((res) => {
          setTourArr(res.data.result);
        })
        .catch(console.error);
    } else if (role === "Employee" && !tourArr) {
      axios
        .get("/api/employee/getReservations")
        .then((res) => {
          setTourArr(res.data.result);
        })
        .catch(console.error);
    }
    else if ( role === "Guide" && !tourArr) {
      axios.get("/api/guide/seeOffers")
      .then((res) => {
        setTourArr(res.data.result);
      })
      .catch(console.error);
    }
  }, [tourArr, id, role]);
  return (
    <>
      <Navbar activeType="dashboard" />
      {role === "Customer" && (
        <div style={{ margin: "30px" }}>
          <Card.Group>
            {tourArr?.length === 0 && (
              <Header>You have no tour reservations!</Header>
            )}
            {tourArr &&
              tourArr.map((e, i) => {
                const [startDate, startTime] = getDateTime(e.start_date);
                const [endDate, endTime] = getDateTime(e.end_date);
                return (
                  <Card
                    key={`card-${i}`}
                    color="red"
                    header={e.name}
                    meta={e.location}
                    description={`Start Date: ${startDate} Start Time: ${startTime} End Date: ${endDate} End Time: ${endTime}`}
                  />
                );
              })}
          </Card.Group>
        </div>
      )}
      {role === "Employee" && (
        <div style={{ margin: "30px" }}>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Start Date</Table.HeaderCell>
                <Table.HeaderCell>End Date</Table.HeaderCell>
                <Table.HeaderCell>Tour Name</Table.HeaderCell>
                <Table.HeaderCell>Tour Location</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tourArr &&
                tourArr.map((e) => {
                  const [s_date, s_time] = getDateTime(e.start_date);
                  const [e_date, e_time] = getDateTime(e.end_date);
                  return (
                    <Table.Row>
                      <Table.Cell>{e.c_name}</Table.Cell>
                      <Table.Cell>{`${s_date}-${s_time}`}</Table.Cell>
                      <Table.Cell>{`${e_date}-${e_time}`}</Table.Cell>
                      <Table.Cell>{e.t_name}</Table.Cell>
                      <Table.Cell>{e.location}</Table.Cell>
                      <Table.Cell textAlign="right">
                        <Button
                          onClick={() => approveRes(e.reservation_id)}
                          color="green"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => declineRes(e.reservation_id)}
                          color="red"
                        >
                          Decline
                        </Button>
                        <Button
                          onClick={() => changeRes(e.reservation_id)}
                          color="yellow"
                        >
                          Change
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table>
        </div>
      )}
      {role === "Guide" && ( <div style={{margin: "30px"}}>
      <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Tour Name</Table.HeaderCell>
                <Table.HeaderCell>Start Date</Table.HeaderCell>
                <Table.HeaderCell>End Date</Table.HeaderCell>
                <Table.HeaderCell>Tour Location</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tourArr &&
                tourArr.map((e) => {
                  const [s_date, s_time] = getDateTime(e.start_date);
                  const [e_date, e_time] = getDateTime(e.end_date);
                  return (
                    <Table.Row>
                      <Table.Cell>{e.name}</Table.Cell>
                      <Table.Cell>{`${s_date}-${s_time}`}</Table.Cell>
                      <Table.Cell>{`${e_date}-${e_time}`}</Table.Cell>
                      <Table.Cell>{e.location}</Table.Cell>
                      <Table.Cell textAlign="right">
                        <Button
                          onClick={() => approveRes(e.reservation_id)}
                          color="green"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => declineRes(e.reservation_id)}
                          color="red"
                        >
                          Decline
                        </Button>
                        <Button
                          onClick={() => changeRes(e.reservation_id)}
                          color="yellow"
                        >
                          Change
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table>
      </div>)}
    </>
  );
}

export default Dashboard;
