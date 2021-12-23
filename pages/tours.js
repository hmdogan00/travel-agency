import { useEffect, useState } from "react";
import { Button, Card, Dropdown, Form, Header, Input, Label, List, Modal } from "semantic-ui-react";
import Navbar from "./Navbar";
import { getDateTime } from "./util";

function Tours() {
  const [role, setRole] = useState("");
  const [tourArr, setTourArr] = useState([
    { name: "Anitkabir", location: "Ankara", desc: "dashgfjasdbfguhabf fb jhbfjdhasfb fbsdabf jdfbsdja bhjfbasd jbfhjb fhjds bfhjsd fbsdjbfjasfb hjasdbfhj bfj a" },
    { name: "Kapadokya", location: "Nigde", desc: "gujiasfnk dhs asdjf" },
    { name: "Alt Orman", location: "Sihirdar Vadisi", desc: " gafdfhadbnf hj bdj bfjh abfsd" }
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  }, []);

  return (
    <>
      <Navbar activeType="tours" />
      {role === "Customer" && (
        <div style={{ margin: "30px" }}>
          <Card.Group itemsPerRow={4}>
            {tourArr?.length === 0 && (
              <Header>There are no tours for reservation.</Header>
            )}
            {tourArr &&
              tourArr.map((e, i) => {
                //const [startDate, startTime] = getDateTime(e.start_date);
                //const [endDate, endTime] = getDateTime(e.end_date);
                return (
                  <TourCard tour={e} key={`tourCard-${i}`} />
                );
              })}
          </Card.Group>
        </div>
      )}
      {role === "Employee" && (
        <div style={{ margin: "30px" }}>
          {tourArr?.length === 0 && (
            <Header>There are no tours for reservation.</Header>
          )}
          {tourArr &&
            tourArr.map((e, i) => {

            })}
        </div>
      )}
    </>
  );
}

function TourCard({ tour }) {
  const [readMore, setReadMore] = useState(false);
  const [resModalOpen, setResModalOpen] = useState(false);
  return (
    <Card
      color="red"
    //description={`Start Date: ${startDate} Start Time: ${startTime} End Date: ${endDate} End Time: ${endTime}`}
    >
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
          {readMore ? tour.desc : `${tour.desc.substring(0, 50)}` + "..."}
        </Card.Description>
        <Card.Description>
          <Button
            content={readMore ? "Show Less" : "Show More"}
            icon={readMore ? 'minus circle' : 'plus circle'}
            onClick={() => setReadMore(!readMore)}
            compact
            circular
            size="mini"
            labelPosition="right"
          />
          <ReservationModal state={resModalOpen} setState={setResModalOpen} tour={tour} />
        </Card.Description>
      </Card.Content>
    </Card>
  );
}

function ReservationModal({ state, setState, tour }) {
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [resPerson, setResPerson] = useState("");

  return (
    <Modal
      onClose={() => setState(false)}
      onOpen={() => setState(true)}
      closeOnDimmerClick={false}
      open={state}
    >
      <Modal.Header>Reservation for {tour.name} Tour</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Reservation Information</Header>
          <Form>
            <Form.Field>
              <label>Number of People for Reservation:</label>
              <Input
                type="number"
                placeholder='How many people are you reserving for?'
                defaultValue={resPerson}
                onChange={(e) => setResPerson(e.target.value)}
              />
            </Form.Field>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => setState(false)}>
          Cancel
        </Button>
        <Button
          content="Make Reservation"
          labelPosition='right'
          icon='bed'
          onClick={() => setPayModalOpen(true)}
          positive
        />
      </Modal.Actions>
      <PaymentModal state={payModalOpen} setState={setPayModalOpen} tour={tour} setState2={setState} />
    </Modal>
  );
}

const months = [
  { key: '1', value: '1', text: '1' },
  { key: '2', value: '2', text: '2' },
  { key: '3', value: '3', text: '3' },
  { key: '4', value: '4', text: '4' },
  { key: '5', value: '5', text: '5' },
  { key: '6', value: '6', text: '6' },
  { key: '7', value: '7', text: '7' },
  { key: '8', value: '8', text: '8' },
  { key: '9', value: '9', text: '9' },
  { key: '10', value: '10', text: '10' },
  { key: '11', value: '11', text: '11' },
  { key: '12', value: '12', text: '12' }
];

const years = [
  { key: '2021', value: '2021', text: '2021' },
  { key: '2022', value: '2022', text: '2022' },
  { key: '2023', value: '2023', text: '2023' },
  { key: '2024', value: '2024', text: '2024' },
  { key: '2025', value: '2025', text: '2025' },
  { key: '2026', value: '2026', text: '2026' },
  { key: '2027', value: '2027', text: '2027' },
  { key: '2028', value: '2028', text: '2028' },
  { key: '2029', value: '2029', text: '2029' },
  { key: '2030', value: '2030', text: '2030' }
];

function PaymentModal({ state, setState, tour, setState2 }) {
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [ccv, setCcv] = useState('');

  return (
    <Modal
      onClose={() => setState(false)}
      onOpen={() => setState(true)}
      closeOnDimmerClick={false}
      open={state}
      size="tiny"
    >
      <Modal.Header>Pay for {tour.name} Tour</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Purchase Summary</Header>
          <List bulleted>
            <List.Item>Tour name: {tour.name}</List.Item>
            <List.Item>Tour location: {tour.location}</List.Item>
            <List.Item>Tour date: .date.</List.Item>
            <List.Item>Total price: .price.</List.Item>
          </List>
        </Modal.Description>
        <br />
        <Modal.Description>
          <Header>
            Payment Information
            <Label size="large">TOTAL PRICE: .PRICE.</Label>
          </Header>
          <Form>
            <Form.Input
              label='NAME ON CARD'
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
            />
            <Form.Input
              label='CARD NUMBER'
              value={cardNumber.substring(0, 16)}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <Form.Group>
              <Form.Field width={5}>
                <label>MONTH</label>
                <Dropdown
                  placeholder='SELECT MONTH'
                  fluid
                  search
                  selection
                  options={months}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </Form.Field>
              <Form.Field width={5}>
                <label>YEAR</label>
                <Dropdown
                  placeholder='SELECT YEAR'
                  fluid
                  search
                  selection
                  options={years}
                  onChange={(e) => setYear(e.target.value)}
                />
              </Form.Field>
              <Form.Field width={5}>
                <label>CCV</label>
                <Form.Input
                  value={ccv.substring(0, 3)}
                  onChange={(e) => setCcv(e.target.value)}
                />
              </Form.Field>
            </Form.Group>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={() => setState(false)}>
          Cancel Payment
        </Button>
        <Button
          content="Pay"
          labelPosition='right'
          icon='payment'
          onClick={() => { setState = (false); setState2(false) }}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default Tours;
