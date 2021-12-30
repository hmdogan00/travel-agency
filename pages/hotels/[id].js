import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useMemo, useReducer, useState } from "react";
import {
  Form,
  Header,
  Button,
  Table,
} from "semantic-ui-react";
import { getDateTime, includesNoCase } from "../../util";
import Navbar from "../Navbar";

const HotelResPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [role, setRole] = useState("");

  const [hotelArr, setHotelArr] = useState(null);
  const [searchCN, setSearchCN] = useState("");
  const [searchTN, setSearchTN] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const searchData = useMemo(() => {
    return hotelArr?.filter(item => {
      if (searchTN !== "")
        return String(item.hotel_room_no).includes(searchTN);
      else if (searchDate !== "") {
        const [d, t] = getDateTime(item.start_date);
        return includesNoCase(d, searchDate) || includesNoCase(t, searchDate);
      }
      else if (searchCN !== "") return includesNoCase(item.c_name, searchCN);
      else return true;
    });
  }, [hotelArr, searchTN, searchDate, searchCN]);

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
    }
    if (!hotelArr && id) {
      const body = {
        hotel_id: id
      }

      axios
        .post(`/api/hotel/getHotelBookRequests?id=${id}`, body)
        .then(res => {
          setHotelArr(res.data.results);
          console.log(res.data.results);
          dispatch({ type: "UPDATE_DATA", data: searchData });
        })
        .catch(console.error);
    }
  }, [hotelArr, id]);

  // takes effect with search
  useEffect(() => {
    dispatch({ type: "UPDATE_DATA", data: searchData });
  }, [searchData]);

  return (
    <>
      <Navbar activeType="hotels" />
      <div style={{ margin: "30px" }}>
        <Header>
          Latest Hotel Reservations for {hotelArr && hotelArr[0].name}
        </Header>
        <br></br>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {role === "Employee" && (
            <Form.Input
              onChange={e => {
                setSearchCN(e.target.value);
                setSearchDate("");
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
              setSearchCN("");
            }}
            value={searchTN}
            placeholder="Search by Room Number"
            className="mr-4"
            icon="search"
          />
        </div>
        <Table sortable singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={state.column === "c_name" ? state.direction : null}
                onClick={() =>
                  dispatch({ type: "CHANGE_SORT", column: "c_name" })
                }
              >
                Customer Name
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={state.column === "phone" ? state.direction : null}
                onClick={() =>
                  dispatch({ type: "CHANGE_SORT", column: "phone" })
                }
              >
                Phone
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
                sorted={state.column === "hotel_no" ? state.direction : null}
                onClick={() =>
                  dispatch({ type: "CHANGE_SORT", column: "hotel_no" })
                }
              >
                Hotel Room No
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
                    <Table.Cell>{e.phone_no}</Table.Cell>
                    <Table.Cell>{`${s_date}-${s_time}`}</Table.Cell>
                    <Table.Cell>{`${e_date}-${e_time}`}</Table.Cell>
                    <Table.Cell>{e.hotel_room_no}</Table.Cell>
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
    </>
  );
};

export default HotelResPage;
