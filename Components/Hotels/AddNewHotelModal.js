import { useState } from "react";
import { Modal, Form, Button, Header } from "semantic-ui-react";

function AddNewHotelModal({ state, setState }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [noOfEmptyRoom, setNoOfEmptyRoom] = useState("");
  const [noOfTotalRoom, setNoOfTotalRoom] = useState("");

  const cancelAddHotel = () => {
    setName("");
    setLocation("");
    setPhone("");
    setNoOfEmptyRoom("");
    setNoOfTotalRoom("");
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
      <Modal.Header>Add New Hotel</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>New Hotel Informations</Header>
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
                label="Phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                width={5}
                type="text"
              />
              <Form.Input
                label="No of Empty Room"
                value={noOfEmptyRoom}
                onChange={e => setNoOfEmptyRoom(e.target.value)}
                width={5}
                type="number"
              />
              <Form.Input
                label="No of Total Room"
                value={noOfTotalRoom}
                onChange={e => setNoOfTotalRoom(e.target.value)}
                width={5}
                type="number"
              />
            </Form.Group>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={() => cancelAddHotel()}>
          Cancel
        </Button>
        <Button
          content="Add Hotel"
          labelPosition="right"
          icon="add square"
          onClick={() => console.log("lol")}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default AddNewHotelModal;
