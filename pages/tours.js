import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
  Dropdown,
  Form,
  Grid,
  Header,
  Input,
  Label,
  List,
  Modal,
  Table,
} from "semantic-ui-react";
import Navbar from "./Navbar";
import { getDateTime, makeRatingString, includesNoCase } from "../util";
import TourCard from "../Components/TourCard.js"

function Tours() {
  const [role, setRole] = useState("");
  const [tourArr, setTourArr] = useState([]);
  const [openAddNewTour, setOpenAddNewTour] = useState(false);
  const [searchN, setSearchN] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchLoc, setSearchLoc] = useState("");
  const [searchType, setSearchType] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      <Navbar activeType="tours" />
          <div style={{ display: "flex", flexDirection: "row", margin:"30px" }}>
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
                    <Table.HeaderCell>ID</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Location</Table.HeaderCell>
                    <Table.HeaderCell>Price</Table.HeaderCell>
                    <Table.HeaderCell>Dates</Table.HeaderCell>
                    <Table.HeaderCell>Capacity</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Company</Table.HeaderCell>
                    <Table.HeaderCell>Rating</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {tourArr.map((e, i) => {
                    const [startDate, startTime] = getDateTime(e.start_date);
                    const [endDate, endTime] = getDateTime(e.end_date);
                    return (
                      <Table.Row>
                        <Table.Cell>{i}</Table.Cell>
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
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
              <AddNewTourModal
                state={openAddNewTour}
                setState={setOpenAddNewTour}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

function AddNewTourModal({ state, setState }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [datesArr, setDatesArr] = useState([]);
  const [capacity, setCapacity] = useState("");
  const [type, setType] = useState("");
  const [company, setCompany] = useState("");

  const [tempDate, setTempDate] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const addDate = () => setDatesArr(lastDates => [...lastDates, tempDate]);
  const deleteDate = date =>
    setDatesArr(lastDates => lastDates.filter(e => e !== date));

  const cancelAddTour = () => {
    setName("");
    setLocation("");
    setPrice("");
    setDatesArr([]);
    setCapacity("");
    setType("");
    setCompany("");
    setTempDate("");
    setState(false);
  };

  return (
    <Modal
      onClose={() => setState(false)}
      onOpen={() => setState(true)}
      closeOnDimmerClick={false}
      open={state}
      size="large"
    >
      <Modal.Header>Add New Tour</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>New Tour Informations</Header>
          <Form>
            <Form.Group>
              <Form.Input
                label="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                width={8}
              />
              <Form.Input
                label="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                width={8}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                label="Price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                width={4}
                type="number"
              />
              <Form.Input
                label="Capacity"
                value={capacity}
                onChange={e => setCapacity(e.target.value)}
                width={4}
                type="number"
              />
              <Form.Input
                label="Type"
                value={type}
                onChange={e => setType(e.target.value)}
                width={4}
              />
              <Form.Input
                label="Company"
                value={company}
                onChange={e => setCompany(e.target.value)}
                width={4}
              />
            </Form.Group>
            <Form.Group inline>
              <Form.Input
                label="Dates"
                value={tempDate}
                onChange={e => setTempDate(e.target.value)}
                width={4}
                type="date"
                min={today}
              />
              <Button color="blue" circular icon="plus" onClick={addDate} />
            </Form.Group>
          </Form>
          <List>
            {datesArr?.map(date => {
              return (
                <List.Item>
                  <Button
                    content={date}
                    color="red"
                    icon="minus"
                    circular
                    size="mini"
                    onClick={() => deleteDate(date)}
                  />
                </List.Item>
              );
            })}
          </List>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={() => cancelAddTour()}>
          Cancel
        </Button>
        <Button
          content="Add Tour"
          labelPosition="right"
          icon="add square"
          onClick={() => console.log("lol")}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default Tours;
