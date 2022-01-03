import { useEffect, useReducer, useState, useMemo } from "react";
import Navbar from "./Navbar";
import { Card, Header, Table, Button, Form, Icon } from "semantic-ui-react";
import _ from "lodash";
import axios from "axios";
import { getDateTime, includesNoCase, parseDateString } from "../util";

const approveRes = rId =>
  axios
    .post("/api/employee/approveReservation", { id: rId })
    .then(res => {alert('Approved Successfully!'); window.location.reload()})
    .catch(e => alert(e.message));

const approveResGuide = tId =>
  axios
    .post("/api/guide/approveOffer", { id: tId })
    .then(res => {alert('Approved Successfully!'); window.location.reload()})
    .catch(e => alert(e.message));

const declineRes = rId =>
  axios
    .post("/api/employee/declineReservation", { id: rId })
    .then(res => {alert('Declined Successfully!'); window.location.reload()})
    .catch(e => alert(e.message));

const declineResGuide = tId => {
  const comment = prompt("Please state your reason for declining the offer?")
  axios
    .post("/api/guide/declineOffer", { id: tId, reason:comment })
    .then(res => {alert('Declined Successfully!'); window.location.reload()})
    .catch(e => alert(e.message));
}

function Dashboard() {
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [tourArr, setTourArr] = useState(null);
  const [searchCN, setSearchCN] = useState("");
  const [searchTN, setSearchTN] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchLoc, setSearchLoc] = useState("");

  const searchData = useMemo(() => {
    return tourArr?.filter(item => {
      if (searchTN !== "")
        return includesNoCase(
          role === "Employee" ? item.t_name : item.name,
          searchTN
        );
      else if (searchDate !== "") {
        const [d, t] = getDateTime(item.start_date);
        return includesNoCase(d, searchDate) || includesNoCase(t, searchDate);
      } else if (searchLoc !== "")
        return includesNoCase(item.location, searchLoc);
      else if (searchCN !== "") return includesNoCase(item.c_name, searchCN);
      else return true;
    });
  }, [tourArr, searchTN, searchDate, searchLoc, searchCN]);

  const [state, dispatch] = useReducer(reducer, {
    column: null,
    data: searchData,
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
          data: action.data,
        };
      default:
        throw new Error();
    }
  }

  // takes effect in initialization
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
          dispatch({ type: "UPDATE_DATA", data: searchData });
        })
        .catch(console.error);
    } else if (role === "Employee" && !tourArr) {
      axios
        .get("/api/employee/getReservations")
        .then(res => {
          setTourArr(res.data.result);
          dispatch({ type: "UPDATE_DATA", data: searchData });
        })
        .catch(console.error);
    } else if (role === "Guide" && !tourArr && id) {
      axios
        .get(`/api/guide/seeOffers/${id}`)
        .then(res => {
          setTourArr(res.data.result);
          dispatch({ type: "UPDATE_DATA", data: searchData });
        })
        .catch(console.error);
    }
  }, [tourArr, id, role]);

  // takes effect with search
  useEffect(() => {
    dispatch({ type: "UPDATE_DATA", data: searchData });
  }, [searchData]);

  return (
    <>
      <Navbar activeType="dashboard" />
      {role === "Customer" ? (
        <div style={{ margin: "30px" }}>
          <Card.Group>
            {tourArr?.length === 0 && (
              <Header>You have no tour reservations!</Header>
            )}
            {tourArr &&
              tourArr.map((e, i) => {
                const [startDate, startTime] = getDateTime(e.start_date);
                const [endDate, endTime] = getDateTime(e.end_date);
                const now = new Date();
                const then = parseDateString(e.end_date);
                return (
                  <Card key={`card-${i}`} color="red">
                    <Card.Content header={e.name} meta={e.location} description=
                      {`Start Date: ${startDate} Start Time: ${startTime} End Date: ${endDate} End Time: ${endTime}`} />
                    {now > then &&
                      <Card.Content extra>
                        <Button color="yellow" onClick={() => window.location.href = `/tours/${e.tour_id}`}>
                          <Icon name="comment alternate" />Review</Button>
                      </Card.Content>
                    }
                  </Card>
                );
              })}
          </Card.Group>
        </div>
      ) : (
        <div style={{ margin: "30px" }}>
          <Header>
            {role === "Employee"
              ? "Latest Reservations"
              : "Latest Reservation Offers"}
          </Header>
          <br></br>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {role === "Employee" && (
              <Form.Input
                onChange={e => {
                  setSearchCN(e.target.value);
                  setSearchDate("");
                  setSearchLoc("");
                  setSearchTN("");
                }}
                value={searchCN}
                placeholder="Search by Customer"
                className="mr-4"
                icon="search"
              />
            )}
            <Form.Input
              onChange={e => {
                setSearchTN("");
                setSearchDate(e.target.value);
                setSearchLoc("");
                setSearchCN("");
              }}
              value={searchDate}
              placeholder="Search by Date"
              className="mr-4"
              icon="search"
            />
            <Form.Input
              onChange={e => {
                setSearchTN(e.target.value);
                setSearchDate("");
                setSearchLoc("");
                setSearchCN("");
              }}
              value={searchTN}
              placeholder="Search by Tour Name"
              className="mr-4"
              icon="search"
            />
            <Form.Input
              onChange={e => {
                setSearchTN("");
                setSearchDate("");
                setSearchLoc(e.target.value);
                setSearchCN("");
              }}
              value={searchLoc}
              placeholder="Search by Location"
              icon="search"
            />
          </div>
          {role === "Employee" ? (
            <Table sortable singleLine>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    sorted={state.column === "name" ? state.direction : null}
                    onClick={() =>
                      dispatch({ type: "CHANGE_SORT", column: "name" })
                    }
                  >
                    Name
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={
                      state.column === "start_date" ? state.direction : null
                    }
                    onClick={() =>
                      dispatch({ type: "CHANGE_SORT", column: "start_date" })
                    }
                  >
                    Start Date
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={
                      state.column === "end_date" ? state.direction : null
                    }
                    onClick={() =>
                      dispatch({ type: "CHANGE_SORT", column: "end_date" })
                    }
                  >
                    End Date
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={state.column === "t_name" ? state.direction : null}
                    onClick={() =>
                      dispatch({ type: "CHANGE_SORT", column: "t_name" })
                    }
                  >
                    Tour Name
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={state.column === "loc" ? state.direction : null}
                    onClick={() =>
                      dispatch({ type: "CHANGE_SORT", column: "loc" })
                    }
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
          ) : (
            <Table sortable singleLine>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    sorted={state.column === "name" ? state.direction : null}
                    onClick={() =>
                      dispatch({ type: "CHANGE_SORT", column: "name" })
                    }
                  >
                    Tour Name
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={
                      state.column === "start_date" ? state.direction : null
                    }
                    onClick={() =>
                      dispatch({ type: "CHANGE_SORT", column: "start_date" })
                    }
                  >
                    Start Date
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={
                      state.column === "end_date" ? state.direction : null
                    }
                    onClick={() =>
                      dispatch({ type: "CHANGE_SORT", column: "end_date" })
                    }
                  >
                    End Date
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={state.column === "loc" ? state.direction : null}
                    onClick={() =>
                      dispatch({ type: "CHANGE_SORT", column: "loc" })
                    }
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
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
              </Table.Body>
            </Table>
          )}
        </div>
      )}
    </>
  );
}

export default Dashboard;
