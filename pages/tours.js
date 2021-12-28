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
import { getDateTime, makeRatingString, includesNoCase } from "./util";

const months = [
  { key: "1", value: "1", text: "1" },
  { key: "2", value: "2", text: "2" },
  { key: "3", value: "3", text: "3" },
  { key: "4", value: "4", text: "4" },
  { key: "5", value: "5", text: "5" },
  { key: "6", value: "6", text: "6" },
  { key: "7", value: "7", text: "7" },
  { key: "8", value: "8", text: "8" },
  { key: "9", value: "9", text: "9" },
  { key: "10", value: "10", text: "10" },
  { key: "11", value: "11", text: "11" },
  { key: "12", value: "12", text: "12" },
];

const years = [
  { key: "2021", value: "2021", text: "2021" },
  { key: "2022", value: "2022", text: "2022" },
  { key: "2023", value: "2023", text: "2023" },
  { key: "2024", value: "2024", text: "2024" },
  { key: "2025", value: "2025", text: "2025" },
  { key: "2026", value: "2026", text: "2026" },
  { key: "2027", value: "2027", text: "2027" },
  { key: "2028", value: "2028", text: "2028" },
  { key: "2029", value: "2029", text: "2029" },
  { key: "2030", value: "2030", text: "2030" },
];

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

function TourCard({ tour }) {
  const [startDate, startTime] = getDateTime(tour.start_date);
  const [endDate, endTime] = getDateTime(tour.end_date);
  tour.desc = [`${startDate}(${startTime}) : ${endDate}(${endTime})`];
  tour.desc.push(`Company: ${tour.company}`);
  tour.desc.push(`Price: ${tour.price}`);
  tour.desc.push(
    tour.rating ? `Rating: ${makeRatingString(tour.rating)}` : `No rating`
  );
  tour.desc.push(`Type: ${tour.type}`);
  const [readMore, setReadMore] = useState(false);
  const [resModalOpen, setResModalOpen] = useState(false);
  return (
    <Card color="red">
      <Card.Content>
        <Card.Header>
          {tour.name}
          <Button
            content="Reserve"
            positive
            compact
            circular
            size="tiny"
            floated="right"
            onClick={() => setResModalOpen(true)}
          />
        </Card.Header>
        <Card.Meta>{tour.location}</Card.Meta>
        <Card.Description>
          <Grid>
            {readMore ? (
              tour.desc.map((e, i) => {
                return <Grid.Column width={16}>{e}</Grid.Column>;
              })
            ) : (
              <Grid.Column width={15}>{`${tour.desc[0]}...`}</Grid.Column>
            )}
            <Grid.Column width={15}>
              <Button
                content={readMore ? "Show Less" : "Show More"}
                icon={readMore ? "minus circle" : "plus circle"}
                onClick={() => setReadMore(!readMore)}
                compact
                circular
                size="mini"
                labelPosition="right"
              />
              <ReservationModal
                state={resModalOpen}
                setState={setResModalOpen}
                tour={tour}
              />
            </Grid.Column>
          </Grid>
        </Card.Description>
      </Card.Content>
    </Card>
  );
}

function ReservationModal({ state, setState, tour }) {
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [resPerson, setResPerson] = useState("");
  const [wantedDate, setWantedDate] = useState("");
  const [wantedEndDate, setWantedEndDate] = useState("");
  return (
    <Modal
      onClose={() => setState(false)}
      onOpen={() => setState(true)}
      closeOnDimmerClick={false}
      open={state}
    >
      <Modal.Header>Reservation for {tour.name}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Reservation Information</Header>
          <Form>
            <Form.Field>
              <label>Select the desired start date for the tour:</label>
              <Input
                type="date"
                placeholder="Enter start date"
                defaultValue={wantedDate}
                onChange={e => setWantedDate(e.target.value)}
              />
              <label>Select the desired end date for the tour:</label>
              <Input
                type="date"
                placeholder="Enter end date"
                defaultValue={wantedEndDate}
                onChange={e => setWantedEndDate(e.target.value)}
              />
              <label>Number of people for reservation:</label>
              <Input
                type="number"
                placeholder="How many people are you reserving for?"
                defaultValue={resPerson}
                onChange={e => setResPerson(e.target.value)}
              />
            </Form.Field>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={() => setState(false)}>
          Cancel
        </Button>
        <Button
          content="Make Reservation"
          labelPosition="right"
          icon="bed"
          onClick={() => setPayModalOpen(true)}
          positive
        />
      </Modal.Actions>
      <PaymentModal
        state={payModalOpen}
        setState={setPayModalOpen}
        tour={tour}
        setState2={setState}
        resPerson={resPerson}
        wantedDate={wantedDate}
        wantedEndDate={wantedEndDate}
      />
    </Modal>
  );
}

function PaymentModal({ state, setState, tour, setState2, resPerson, wantedDate, wantedEndDate }) {
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [ccv, setCcv] = useState("");
  const [startDate, startTime] = getDateTime(tour.start_date)
  const [endDate, endTime] = getDateTime(tour.end_date)

  const makeReservation = () => {
    const body = {
      reservation: {
        start: wantedDate,
        end: wantedEndDate,
        resNumber: resPerson,
        tourId: tour.tour_id
      },
      id: localStorage.getItem('id')
    }
    axios.post(`/api/customer/makeReservation`, body).then(alert).catch(alert)
  }

  return (
    <Modal
      onClose={() => setState(false)}
      onOpen={() => setState(true)}
      closeOnDimmerClick={false}
      open={state}
      size="tiny"
    >
      <Modal.Header>Pay for {tour.name}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Purchase Summary</Header>
          <List bulleted>
            <List.Item>Tour name: {tour.name}</List.Item>
            <List.Item>Tour location: {tour.location}</List.Item>
            <List.Item>Tour date: {`${startDate}(${startTime}) : ${endDate}(${endTime})`}</List.Item>
            <List.Item>One person price: {tour.price}</List.Item>
          </List>
        </Modal.Description>
        <br />
        <Modal.Description>
          <Header>
            Payment Information
            <Label size="large">TOTAL PRICE: {resPerson * tour.price}</Label>
          </Header>
          <Form>
            <Form.Input
              label="NAME ON CARD"
              value={nameOnCard}
              onChange={e => setNameOnCard(e.target.value)}
            />
            <Form.Input
              label="CARD NUMBER"
              value={cardNumber.substring(0, 16)}
              onChange={e => setCardNumber(e.target.value)}
            />
            <Form.Group>
              <Form.Field width={5}>
                <label>MONTH</label>
                <Dropdown
                  placeholder="SELECT MONTH"
                  fluid
                  search
                  selection
                  options={months}
                  onChange={e => setMonth(e.target.value)}
                />
              </Form.Field>
              <Form.Field width={5}>
                <label>YEAR</label>
                <Dropdown
                  placeholder="SELECT YEAR"
                  fluid
                  search
                  selection
                  options={years}
                  onChange={e => setYear(e.target.value)}
                />
              </Form.Field>
              <Form.Field width={5}>
                <label>CCV</label>
                <Form.Input
                  value={ccv.substring(0, 3)}
                  onChange={e => setCcv(e.target.value)}
                />
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={() => setState(false)}>
          Cancel Payment
        </Button>
        <Button
          content="Pay"
          labelPosition="right"
          icon="payment"
          onClick={() => {
            setState(false);
            setState2(false);
            makeReservation();
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
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
