import { useEffect, useReducer, useState } from "react";
import Navbar from "./Navbar";
import { Card, Header, Table, Button } from "semantic-ui-react";
import _ from "lodash";
import axios from "axios";
import { getDateTime } from "./util";

const approveRes = rId => axios.post("/api/employee/approveReservation", { id: rId }).then(res => console.log).catch(e => console.error);

const approveResGuide = tId => axios.post("/api/guide/approveOffer", { id: tId }).then(res => console.log).catch(e => console.error);

const declineRes = rId => axios.post("/api/employee/declineReservation", { id: rId }).then(res => console.log).catch(e => console.error);

const declineResGuide = tId => axios.post("/api/guide/declineOffer", { id: tId }).then(res => console.log).catch(e => console.error);

function Dashboard() {
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [tourArr, setTourArr] = useState(null);
  const [state, dispatch] = useReducer(reducer, {
    column: null,
    data: tourArr,
    direction: null,
  });

  function reducer(state, action) {
    switch (action.type) {
      case "CHANGE_SORT":
        if (state.column === action.column) {
          return {
            ...state,
            data: state.data.slice().reverse(),
            direction:
              state.direction === "ascending" ? "descending" : "ascending",
          };
        }

        return {
          column: action.column,
          data: _.sortBy(state.data, [action.column]),
          direction: "ascending",
        };
      case "UPDATE_DATA":
        return {
          ...state,
          data: tourArr,
        };
      default:
        throw new Error();
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
      setId(localStorage.getItem("id"));
    }
    if (role === "Customer" && !tourArr) {
      axios
        .get(`/api/getCustomerTours/${id}`)
        .then(res => {
          setTourArr(res.data.result);
          dispatch({ type: "UPDATE_DATA" });
        })
        .catch(console.error);
    } else if (role === "Employee" && !tourArr) {
      axios
        .get("/api/employee/getReservations")
        .then(res => {
          setTourArr(res.data.result);
          dispatch({ type: "UPDATE_DATA" });
        })
        .catch(console.error);
    } else if (role === "Guide" && !tourArr) {
      axios
        .get("/api/guide/seeOffers")
        .then(res => {
          setTourArr(res.data.result);
          dispatch({ type: "UPDATE_DATA" });
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
          <Table sortable singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={state.column === "name" ? state.direction : null}
                  onClick={() => dispatch({ type: "CHANGE_SORT", column: "name" })}
                >
                  Name
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={state.column === "start_date" ? state.direction : null}
                  onClick={() => dispatch({ type: "CHANGE_SORT", column: "start_date" })}
                >
                  Start Date
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={state.column === "end_date" ? state.direction : null}
                  onClick={() => dispatch({ type: "CHANGE_SORT", column: "end_date" })}
                >
                  End Date
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={state.column === "t_name" ? state.direction : null}
                  onClick={() => dispatch({ type: "CHANGE_SORT", column: "t_name" })}
                >
                  Tour Name
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={state.column === "loc" ? state.direction : null}
                  onClick={() => dispatch({ type: "CHANGE_SORT", column: "loc" })}
                >
                  Tour Location
                </Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {state.data &&
                state.data.map(e => {
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
      {role === "Guide" && (
        <div style={{ margin: "30px" }}>
          <Table sortable singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  sorted={state.column === "name" ? state.direction : null}
                  onClick={() => dispatch({ type: "CHANGE_SORT", column: "name" })}
                >
                  Tour Name
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={state.column === "start_date" ? state.direction : null}
                  onClick={() => dispatch({ type: "CHANGE_SORT", column: "start_date" })}
                >
                  Start Date
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={state.column === "end_date" ? state.direction : null}
                  onClick={() => dispatch({ type: "CHANGE_SORT", column: "end_date" })}
                >
                  End Date
                </Table.HeaderCell>
                <Table.HeaderCell
                  sorted={state.column === "loc" ? state.direction : null}
                  onClick={() => dispatch({ type: "CHANGE_SORT", column: "loc" })}
                >
                  Tour Location
                </Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {state.data &&
                state.data.map(e => {
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
                          onClick={() => approveResGuide(e.tour_id)}
                          color="green"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => declineResGuide(e.tour_id)}
                          color="red"
                        >
                          Decline
                        </Button>
                        <Button
                          onClick={() => changeResGuide(e.tour_id)}
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
    </>
  );
}

export default Dashboard;
