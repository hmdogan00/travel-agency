import { useState, useEffect } from "react";
import {
  Modal,
  Header,
  Form,
  Input,
  Button,
  Table,
  Icon,
  TableBody,
  TableCell,
  TableRow,
} from "semantic-ui-react";
//import PaymentModal from "./PaymentModal.js";
import axios from "axios";
import { getDateTime, includesNoCase } from "../../util.js";

function ReservationModal({ state, setState, hotel }) {
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [resPersons, setResPersons] = useState(["1"]);
  const [wantedDate, setWantedDate] = useState("");
  const [wantedEndDate, setWantedEndDate] = useState("");
  const [isRoomSearched, setIsRoomSearched] = useState(false);
  const [roomList, setRoomList] = useState();

  const getRooms = () => {
    setRoomList(latestArr => latestArr = []);
    resPersons.forEach(e => {
      axios
        .get(
          `/api/hotel/getAvailableRooms?hotel_id=${hotel.hotel_id}&size=${e}&st=${wantedDate}&en=${wantedEndDate}`
        )
        .then(res => {
          setRoomList(latestArr => latestArr = [...latestArr,...res.data.results]);
        });
    });
    setIsRoomSearched(true);
  };

  const handleResPerson = (value, index) => {
    const arr = [];
    resPersons.forEach((e, i) => {
      if (i === index) arr.push(value);
      else arr.push(e);
    });
    setResPersons(arr);
  };

  const addRoom = () => {
    setResPersons([...resPersons, "0"]);
  };

  const deleteRoom = index => {
    setResPersons(resPersons.filter((e, i) => i !== index));
  };

  return (
    <Modal
      onClose={() => setState(false)}
      onOpen={() => setState(true)}
      closeOnDimmerClick={false}
      open={state}
    >
      <Modal.Header>Reservation for {hotel.name}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Reservation Information</Header>
          <Form>
            <Form.Field className="reservation-form-field">
              <label>Desired start date:</label>
              <Input
                type="date"
                placeholder="Enter start date"
                defaultValue={wantedDate}
                onChange={e => setWantedDate(e.target.value)}
              />
            </Form.Field>
            <Form.Field className="reservation-form-field">
              <label>Desired end date:</label>
              <Input
                type="date"
                placeholder="Enter end date"
                defaultValue={wantedEndDate}
                onChange={e => setWantedEndDate(e.target.value)}
              />
            </Form.Field>
            {resPersons?.map((r, i) => {
              return (
                <Form.Field className="reservation-form-field">
                  <label>Number of people for room {i + 1}:</label>
                  <Button color="red" onClick={() => deleteRoom(i)} animated>
                    <Button.Content visible>Delete</Button.Content>
                    <Button.Content hidden>
                      <Icon name="close" />
                    </Button.Content>
                  </Button>
                  <Input
                    type="number"
                    placeholder="How many people are you reserving for?"
                    defaultValue={r}
                    onChange={e => handleResPerson(e.target.value, i)}
                    style={{ width: "89.7%" }}
                  />
                </Form.Field>
              );
            })}
            <Button color="blue" onClick={addRoom} content="Add Room" />
            <Button color="green" onClick={getRooms}>
              Get Available Rooms
            </Button>
          </Form>
          {roomList && isRoomSearched && (
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Room No</Table.HeaderCell>
                  <Table.HeaderCell>Floor</Table.HeaderCell>
                  <Table.HeaderCell>Price</Table.HeaderCell>
                  <Table.HeaderCell>Size</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <TableBody>
                {roomList?.map(room => {
                  if (!isRoomSearched) return;
                  return (
                    <TableRow>
                      <TableCell>{room.hotel_room_no}</TableCell>
                      <TableCell>{room.room_floor}</TableCell>
                      <TableCell>{room.room_price}</TableCell>
                      <TableCell>{room.room_size}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
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
      {/* <PaymentModal
        state={payModalOpen}
        setState={setPayModalOpen}
        hotel={hotel}
        setState2={setState}
        resPerson={resPerson}
        wantedDate={wantedDate}
        wantedEndDate={wantedEndDate}
      /> */}
    </Modal>
  );
}

export default ReservationModal;
