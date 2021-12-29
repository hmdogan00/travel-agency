import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Checkbox, Form, Header, Modal, Table } from "semantic-ui-react";
import getDateTime from '../../util.js';

function ApproveActOpen({ state, closeModal, actIdea }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [ageRestriction, setAgeResstriction] = useState("");
  const [selectedTourId, setSelectedTourId] = useState("");

  const [allTours, setAllTours] = useState([]);
  const [radioState, setRadioState] = useState('tr-0');

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (actIdea !== null) {
      setName(actIdea.name);
      setLocation(actIdea.location);
    }
    axios
      .get(`/api/getAllTours`)
      .then(res => setAllTours(res.data.results));
  }, [actIdea]);

  const cancelApprove = () => {
    setStartDate("");
    setEndDate("");
    setPrice("");
    setDuration([]);
    setAgeResstriction("");
    closeModal();
  };

  const approveActivityIdea = () => {
    if (startDate !== '' && endDate !== '' && price !== '' &&
      duration !== '' && ageRestriction !== '' && selectedTourId !== '') {
      var empID = "";
      if (typeof window !== "undefined") {
        empID = localStorage.getItem('id');
      }
      const activity = {
        tour: selectedTourId,
        start: startDate,
        end: endDate,
        price: price,
        duration: duration,
        age: ageRestriction
      }
      const body = {
        actID: actIdea.act_idea_id,
        empID: empID,
        activity: activity
      }
      axios
        .post(`/api/employee/approveActivityIdea`, body)
        .then(res => {
          if (res.status === 200) {
            alert(res.statusText);
            closeModal();
            window.location.reload();
          }
          else alert(res.statusText);
        });
    }
    else {
      alert('Please fill all input fields!');
    }
  }

  return (
    <Modal
      closeOnDimmerClick={false}
      open={state}
      size="large"
    >
      <Modal.Header>{name} - {location}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Finalize Approving Activity Idea</Header>
          <Form>
            <Form.Group>
              <Form.Input
                label="Start Date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                width={8}
                type='date'
                min={today}
              />
              <Form.Input
                label="End Date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                width={8}
                type='date'
                min={today}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                label="Price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                width={5}
                type="number"
              />
              <Form.Input
                label="Duration"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                width={5}
              />
              <Form.Input
                label="Age Restriction"
                value={ageRestriction}
                onChange={e => setAgeResstriction(e.target.value)}
                width={5}
              />
            </Form.Group>
            <Form.Field>
              <label>Choose a tour for the activity:</label>
              <div className="scrollable">
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell></Table.HeaderCell>
                      <Table.HeaderCell>Activity Name</Table.HeaderCell>
                      <Table.HeaderCell>Start Time</Table.HeaderCell>
                      <Table.HeaderCell>Duration</Table.HeaderCell>
                      <Table.HeaderCell>Location</Table.HeaderCell>
                      <Table.HeaderCell>Price</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {allTours && allTours.map((a, i) => {
                      return (
                        <Table.Row key={`tr-${i}`}>
                          <Table.Cell>
                            <Checkbox
                              radio
                              value={`tr-${i}`}
                              checked={radioState === `tr-${i}`}
                              onChange={() => { setSelectedTourId(a.tour_id); setRadioState(`tr-${i}`) }}
                            />
                          </Table.Cell>
                          <Table.Cell> {a.name} </Table.Cell>
                          <Table.Cell> {a.duration} </Table.Cell>
                          <Table.Cell> {a.location} </Table.Cell>
                          <Table.Cell> {a.price} </Table.Cell>
                        </Table.Row>
                      )
                    })}
                  </Table.Body>
                </Table>
              </div>
            </Form.Field>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => cancelApprove()}>
          Cancel
        </Button>
        <Button
          content="Add Activity Idea"
          labelPosition="right"
          icon="add square"
          onClick={approveActivityIdea}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default ApproveActOpen;
