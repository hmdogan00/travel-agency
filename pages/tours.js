import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Button, Card, Form, Header, Table, Icon } from "semantic-ui-react";
import Navbar from "./Navbar";
import { getDateTime, makeRatingString, includesNoCase, parseDateString } from "../util";
import TourCard from "../Components/Tours/TourCard.js";
import AddNewTourModal from "../Components/Tours/AddNewTourModal.js";
import ReservationModal from "../Components/Tours/ReservationModal";

const Tours = () => {
  const [role, setRole] = useState("");
  const [tourArr, setTourArr] = useState([]);
  const [openAddNewTour, setOpenAddNewTour] = useState(false);
  const [searchN, setSearchN] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchLoc, setSearchLoc] = useState("");
  const [searchType, setSearchType] = useState("");
  const [loading, setLoading] = useState(false);
  const [resModalOpen, setResModalOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  const searchData = useMemo(() => {
    return tourArr?.filter(item => {
      if (searchN !== "")
        return includesNoCase(
          role === "Employee" ? item.t_name : item.name,
          searchN
        );
      else if (searchDate !== "") {
        const [d, t] = getDateTime(item.start_date);
        return includesNoCase(d, searchDate) || includesNoCase(t, searchDate);
      } else if (searchLoc !== "")
        return includesNoCase(item.location, searchLoc);
      else if (searchType !== "") return includesNoCase(item.type, searchType);
      else return true;
    });
  }, [tourArr, searchN, searchDate, searchLoc, searchType]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
    if (tourArr.length === 0) {
      axios
        .get("/api/getAllTours")
        .then(res => setTourArr([...res.data.results]));
    }
  }, []);

  useEffect(() => {
    if (role && role === 'Guide') {
      setTourArr(tours => tours = tours.filter(t => {
        const end = parseDateString(t.end_date)
        const now = new Date()
        return t.person_id === parseInt(localStorage.getItem("id")) && end < now
      }))
    }
  }, [tourArr])

  return (
    <>
      <Navbar activeType="tours" />
      <div style={{ display: "flex", flexDirection: "row", margin: "30px" }}>
        <Form.Input
          loading={loading}
          onChange={e => {
            setSearchN(e.target.value);
            setSearchDate("");
            setSearchLoc("");
            setSearchType("");
          }}
          value={searchN}
          placeholder="Search by Tour Name"
          className="mr-4"
          icon="search"
        />
        <Form.Input
          loading={loading}
          onChange={e => {
            setSearchN("");
            setSearchType(e.target.value);
            setSearchLoc("");
            setSearchDate("");
          }}
          value={searchType}
          placeholder="Search by Type"
          className="mr-4"
          icon="search"
        />
        <Form.Input
          loading={loading}
          onChange={e => {
            setSearchN("");
            setSearchType("");
            setSearchLoc(e.target.value);
            setSearchDate("");
          }}
          value={searchLoc}
          placeholder="Search by Location"
          className="mr-4"
          icon="search"
        />
        <Form.Input
          loading={loading}
          onChange={e => {
            setSearchN("");
            setSearchType("");
            setSearchLoc("");
            setSearchDate(e.target.value);
          }}
          value={searchDate}
          placeholder="Search by Date"
          icon="search"
        />
      </div>
      {role === "Customer" && (
        <div style={{ margin: "30px" }}>
          <Card.Group itemsPerRow={4}>
            {searchData?.length === 0 && (
              <Header>There are no tours for reservation.</Header>
            )}
            {searchData &&
              searchData.map((e, i) => {
                return <TourCard tour={e} key={`tourCard-${i}`} />;
              })}
          </Card.Group>
        </div>
      )}
      {role === "Employee" && (
        <div style={{ margin: "30px" }}>
          {tourArr?.length === 0 && (
            <Header>There are no tours for reservation.</Header>
          )}
          {tourArr && (
            <>
              <Header floated="left">Active Tours</Header>
              <Header floated="right">
                <Button
                  content="Add New Tour"
                  color="blue"
                  onClick={() => setOpenAddNewTour(true)}
                />
              </Header>
              <Table celled color="red">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Location</Table.HeaderCell>
                    <Table.HeaderCell>Price</Table.HeaderCell>
                    <Table.HeaderCell>Dates</Table.HeaderCell>
                    <Table.HeaderCell>Capacity</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Company</Table.HeaderCell>
                    <Table.HeaderCell>Rating</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {searchData && searchData.map((e, i) => {
                    const [startDate, startTime] = getDateTime(e.start_date);
                    const [endDate, endTime] = getDateTime(e.end_date);
                    return (
                      <>
                        <Table.Row>
                          <Table.Cell>{i + 1}</Table.Cell>
                          <Table.Cell>{e.name}</Table.Cell>
                          <Table.Cell>{e.location}</Table.Cell>
                          <Table.Cell>{e.price}</Table.Cell>
                          <Table.Cell>
                            {`${startDate}(${startTime}) - ${endDate}(${endTime})`}
                          </Table.Cell>
                          <Table.Cell>{e.capacity}</Table.Cell>
                          <Table.Cell>{e.type}</Table.Cell>
                          <Table.Cell>{e.company}</Table.Cell>
                          <Table.Cell>{makeRatingString(e.rating)}</Table.Cell>
                          <Table.Cell>
                            <Button color="blue" onClick={() => { setTourIndex(i); setResModalOpen(true) }}>
                              Make Reservation
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      </>
                    );
                  })}
                </Table.Body>
              </Table>
              <AddNewTourModal
                state={openAddNewTour}
                setState={setOpenAddNewTour}
              />
              <ReservationModal
                state={resModalOpen}
                setState={setResModalOpen}
                tour={tourArr[tourIndex]}
              />
            </>
          )}
        </div>
      )}
      {role === "Guide" && (
        <div style={{ margin: "30px" }}>
          {tourArr?.length === 0 && (
            <Header>There are no tours</Header>
          )}
          {tourArr && (
            <>
              <Header floated="left">Past Tours</Header>
              <Table celled color="red">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Location</Table.HeaderCell>
                    <Table.HeaderCell>Price</Table.HeaderCell>
                    <Table.HeaderCell>Dates</Table.HeaderCell>
                    <Table.HeaderCell>Capacity</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Company</Table.HeaderCell>
                    <Table.HeaderCell>Rating</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {searchData && searchData.map((e, i) => {
                    const [startDate, startTime] = getDateTime(e.start_date);
                    const [endDate, endTime] = getDateTime(e.end_date);
                    return (
                      <>
                        <Table.Row>
                          <Table.Cell>{i + 1}</Table.Cell>
                          <Table.Cell>{e.name}</Table.Cell>
                          <Table.Cell>{e.location}</Table.Cell>
                          <Table.Cell>{e.price}</Table.Cell>
                          <Table.Cell>
                            {`${startDate}(${startTime}) - ${endDate}(${endTime})`}
                          </Table.Cell>
                          <Table.Cell>{e.capacity}</Table.Cell>
                          <Table.Cell>{e.type}</Table.Cell>
                          <Table.Cell>{e.company}</Table.Cell>
                          <Table.Cell>{makeRatingString(e.rating)}</Table.Cell>
                          <Table.Cell>
                            <Button color="yellow" onClick={() => window.location.href = `/tours/${e.tour_id}`}>
                              <Icon name="comment alternate" />Review</Button>
                          </Table.Cell>
                        </Table.Row>
                      </>
                    );
                  })}
                </Table.Body>
              </Table>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Tours;
