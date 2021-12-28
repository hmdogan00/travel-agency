import { useState } from "react";
import { getDateTime } from "../util";
import {
  Modal,
  Form,
  Header,
  List,
  Dropdown,
  Button,
  Label,
} from "semantic-ui-react";
import axios from "axios";

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

function PaymentModal({
  state,
  setState,
  tour,
  setState2,
  resPerson,
  wantedDate,
  wantedEndDate,
  activityArr,
  activityChecks,
}) {
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [ccv, setCcv] = useState("");
  const [startDate, startTime] = getDateTime(tour.start_date);
  const [endDate, endTime] = getDateTime(tour.end_date);

  const makeReservation = () => {
    const body = {
      reservation: {
        start: wantedDate,
        end: wantedEndDate,
        resNumber: resPerson,
        tourId: tour.tour_id,
      },
      id: localStorage.getItem("id"),
    };
    axios.post(`/api/customer/makeReservation`, body).then(alert).catch(alert);
  };

  const getTotalPrice = () => {
    let sum = 0;
    activityArr.forEach((a, i) => {
      if (activityChecks[i]) sum += a.price;
    });
    return tour.price * resPerson + sum;
  };

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
            <List.Item>
              Tour date: {`${startDate}(${startTime}) - ${endDate}(${endTime})`}
            </List.Item>
            <List.Item>One person price: {tour.price}</List.Item>
            <List.Item>
              Total reservation price: {tour.price * resPerson}
            </List.Item>
            {activityArr.map((a, i) => {
              if (activityChecks[i])
                return <List.Item>{`${a.name}: ${a.price}`}</List.Item>;
            })}
          </List>
          <Label size="large">TOTAL PRICE: {getTotalPrice()}</Label>
        </Modal.Description>
        <br />
        <Modal.Description>
          <Header>Payment Information</Header>
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

export default PaymentModal;
