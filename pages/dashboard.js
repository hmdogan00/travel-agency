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
  return [D, T]
}

function Dashboard() {
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [tourArr, setTourArr] = useState(null);

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
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Hotel</Table.HeaderCell>
                <Table.HeaderCell>Room</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tourArr &&
                tourArr.map((e) => {
                  const [date, time] = getDateTime(e.start_date);
                  return <Table.Row>
                    <Table.Cell>{e.c_name}</Table.Cell>
                    <Table.Cell>{`${date}-${time}`}</Table.Cell>
                    <Table.Cell>{e.h_name}</Table.Cell>
                    <Table.Cell>{e.hotel_room_no}</Table.Cell>
                    <Table.Cell textAlign="right">
                      <Button color="green">Approve</Button>
                      <Button color="red">Decline</Button>
                      <Button color="yellow">Change</Button>
                    </Table.Cell>
                  </Table.Row>;
                })}
            </Table.Body>
          </Table>
        </div>
      )}
    </>
  );
}

export default Dashboard;
