import { useState, useEffect } from "react";
import { Modal, Header, Form, Input, Button, Checkbox, Table, Label } from "semantic-ui-react";
//import PaymentModal from "./PaymentModal.js";
import axios from "axios";
import { getDateTime, includesNoCase } from "../../util.js";

function ReservationModal({ state, setState, hotel }) {
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [resPerson, setResPerson] = useState("");
  const [wantedDate, setWantedDate] = useState("");
  const [wantedEndDate, setWantedEndDate] = useState("");
  const [isRoomSearched, setIsRoomSearched] = useState(false);
  const [roomList, setRoomList] = useState();

  const getRooms = () => {
    axios.get(`/api/hotel/getAvailableRooms?hotel_id=${hotel.hotel_id}&size=${resPerson}&st=${wantedDate}&en=${wantedEndDate}`).then(res => {
      setIsRoomSearched(true);
      setRoomList(res.data.results)
    })
  }

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
            <Form.Field className='reservation-form-field'>
              <label>
                Desired start date:
              </label>
              <Input
                type="date"
                placeholder="Enter start date"
                defaultValue={wantedDate}
                onChange={e => setWantedDate(e.target.value)}
              />
            </Form.Field>
            <Form.Field className='reservation-form-field'>
              <label>
                Desired end date:
              </label>
              <Input
                type="date"
                placeholder="Enter end date"
                defaultValue={wantedEndDate}
                onChange={e => setWantedEndDate(e.target.value)}
              />
            </Form.Field>
            <Form.Field className='reservation-form-field'>
              <label>Number of people:</label>
              <Input
                type="number"
                placeholder="How many people are you reserving for?"
                defaultValue={resPerson}
                onChange={e => setResPerson(e.target.value)}
              />
            </Form.Field>
            <Button color="green" onClick={getRooms}>Get Available Rooms</Button>
          </Form>
          {isRoomSearched && 
            <Table>
            {roomList?.map(room => {

          })}
          </Table>}
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
