import { useState } from "react";
import {
  Modal,
  Form,
  Header,
  List,
  Dropdown,
  Button,
  Label,
  ListItem,
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

function PaymentModal({ state, setState, hotel, setState2, selectedRooms, start, end }) {
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [ccv, setCcv] = useState("");

  const makeHotelBooking = () => {
    selectedRooms.forEach(room => {
      const body = {
        hotel_room_no: room.hotel_room_no,
        hotel_id: hotel.hotel_id,
        person_id: localStorage.getItem('id'),
        start_date: start,
        end_date: end
      }
      axios.post(`/api/hotel/bookHotel`, body).then(res => res.status === 200 ? alert("Booking successfully made!") : alert(res.data.message))
    })
  };

  const getTotalPrice = () => {
    let sum = 0;
    selectedRooms.forEach(r => {
      sum += r.room_price
    })
    return sum;
  };

  return (
    <Modal
      onClose={() => setState(false)}
      onOpen={() => setState(true)}
      closeOnDimmerClick={false}
      open={state}
      size="tiny"
    >
      <Modal.Header>Pay for {hotel.name}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Purchase Summary</Header>
          <List bulleted="true">
            <List.Item>Hotel name: {hotel.name}</List.Item>
            <List.Item>Hotel location: {hotel.location}</List.Item>
            <List.Item>
              Selected rooms:
              <List.List bulleted="true">
                {selectedRooms.map(room => (
                  <ListItem>
                    Room {room.hotel_room_no} - For {room.room_size} people -
                    Price: {room.room_price}
                  </ListItem>
                ))}
              </List.List>
            </List.Item>
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
            makeHotelBooking();
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default PaymentModal;
