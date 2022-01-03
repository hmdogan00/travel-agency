import axios from "axios";
import { useState } from "react";
import { Modal, Form, Button, Header } from "semantic-ui-react";

function AddNewTourModal({ state, setState }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [datesArr, setDatesArr] = useState([]);
  const [capacity, setCapacity] = useState("");
  const [type, setType] = useState("");
  const [company, setCompany] = useState("");

  const [endDate, setEndDate] = useState("");
  const [tempDate, setTempDate] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const addNewTour = () => {
    if ( !confirm("You are adding a new tour. Are you sure?") ) {
      return;
    }
    const body = {
      name:name,
      price:price,
      capacity:capacity,
      type:type,
      company:company,
      location:location,
      start_date:tempDate,
      end_date:endDate
    }
    axios.post(`/api/employee/addNewTour`, body).then(res => alert(`${name} added successfully!`)).catch(err => alert(err.data.message))
    window.location.reload();
  }

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
                label="Starting Date"
                value={tempDate}
                onChange={e => setTempDate(e.target.value)}
                width={4}
                type="date"
                min={today}
              />
              <Form.Input
                label="End Date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                width={4}
                type="date"
                min={tempDate}
              />
            </Form.Group>
          </Form>
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
          onClick={() => addNewTour()}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default AddNewTourModal;