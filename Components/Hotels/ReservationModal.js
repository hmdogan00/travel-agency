import { useState } from "react";
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
  Checkbox,
  Label
} from "semantic-ui-react";
//import PaymentModal from "./PaymentModal.js";
import axios from "axios";
import PaymentModal from "./PaymentModal";

function ReservationModal({ state, setState, hotel }) {
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [resPersons, setResPersons] = useState(["1"]);
  const [wantedDate, setWantedDate] = useState("");
  const [wantedEndDate, setWantedEndDate] = useState("");
  const [isRoomSearched, setIsRoomSearched] = useState(false);
  const [roomList, setRoomList] = useState();
  const [roomSelectionArray, setRoomSelectionArray] = useState();
  const [selectedRooms, setSelectedRooms] = useState()
  const today = new Date().toISOString().split("T")[0];

  const getRooms = () => {
    setRoomList(latestArr => (latestArr = []));
    setRoomSelectionArray(latestArr => (latestArr = []));
    resPersons.forEach(e => {
      axios
        .get(
          `/api/hotel/getAvailableRooms?hotel_id=${hotel.hotel_id}&size=${e}&st=${wantedDate}&en=${wantedEndDate}`
        )
        .then(res => {
          setRoomList(
            latestArr => (latestArr = [...latestArr, res.data.results])
          );
          setRoomSelectionArray(latestArr => (latestArr = [...latestArr, 0]))
        });
    });
    setIsRoomSearched(true);
  };

  const handleCheckboxSelection = (index, value) => {
    setRoomSelectionArray(latestArr => {
      return latestArr = latestArr.map((roomSelection, i) => {
        if ( i === index ) return value;
        else return roomSelection;
      })
    })
    getRoomInformations();
  }

  const handleResPerson = (value, index) => {
    const arr = [];
    resPersons.forEach((e, i) => {
      if (i === index) arr.push(value);
      else arr.push(e);
    });
    setResPersons(arr);
  };

  const getRoomInformations = () => {
    const tmp = []
    roomList.forEach((rooms, i) => {
      tmp.push( rooms[roomSelectionArray[i]] );
    })
    setSelectedRooms(latest => latest = tmp)
  }

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
                min={today}
                onChange={e => setWantedDate(e.target.value)}
              />
            </Form.Field>
            <Form.Field className="reservation-form-field">
              <label>Desired end date:</label>
              <Input
                type="date"
                placeholder="Enter end date"
                defaultValue={wantedEndDate}
                min={today}
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
          {roomList &&
            isRoomSearched &&
            roomList?.map((rooms, i) => {
              return (
                <>{ i === 0 && <br/> }
                  <Label>Selection for room {i + 1}</Label>
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell>Room No</Table.HeaderCell>
                        <Table.HeaderCell>Floor</Table.HeaderCell>
                        <Table.HeaderCell>Price</Table.HeaderCell>
                        <Table.HeaderCell>Size</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <TableBody>
                      {roomSelectionArray && rooms?.map((room, roomIndex) => {
                        if (!isRoomSearched) return;
                        return (
                          <TableRow>
                            <TableCell>
                              <Checkbox name={`radio-button-${i}`} radio checked={roomSelectionArray[i] === roomIndex} value={i} onChange={(e, {value}) => handleCheckboxSelection(value, roomIndex)}/>
                            </TableCell>
                            <TableCell>{room.hotel_room_no}</TableCell>
                            <TableCell>{room.room_floor}</TableCell>
                            <TableCell>{room.room_price}</TableCell>
                            <TableCell>{room.room_size}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </>
              );
            })}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={() => setState(false)}>
          Cancel
        </Button>
        <Button
          content="Go to Payment"
          labelPosition="right"
          icon="payment"
          onClick={() => {setPayModalOpen(true)}}
          positive
        />
      </Modal.Actions>
      {selectedRooms && selectedRooms.length !== 0 && <PaymentModal
        state={payModalOpen}
        setState={setPayModalOpen}
        hotel={hotel}
        setState2={setState}
        selectedRooms={selectedRooms}
        start={wantedDate}
        end={wantedEndDate}
      />}
    </Modal>
  );
}

export default ReservationModal;
