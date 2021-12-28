import { useState } from "react";
import { Modal, Header, Form, Input, Button } from "semantic-ui-react";
import PaymentModal from "./PaymentModal.js"

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

export default ReservationModal;