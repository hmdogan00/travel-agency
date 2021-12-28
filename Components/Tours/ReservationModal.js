import { useState, useEffect, useRef } from "react";
import { Modal, Header, Form, Input, Button, Checkbox, Table, Label } from "semantic-ui-react";
import PaymentModal from "./PaymentModal.js";
import axios from "axios";
import { getDateTime } from "../util.js";

function ReservationModal({ state, setState, tour }) {
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [resPerson, setResPerson] = useState("");
  const [wantedDate, setWantedDate] = useState("");
  const [wantedEndDate, setWantedEndDate] = useState("");
  const [activityArr, setActivityArr] = useState([]);
  const [activityChecks, setActivityChecks] = useState([]);

  const clickCheckbox = (index) => {
    const arr = []
    activityChecks.forEach((e,i) => {
      if ( i === index ) arr.push(!e)
      else arr.push(e)
    })
    console.log(arr)
    setActivityChecks(arr);
  }

  useEffect(() => {
    if (state === true && activityArr?.length === 0 && tour.tour_id ) {
      axios
        .get(`/api/getTourActivities?id=${tour.tour_id}`)
        .then(res => { 
          setActivityArr([...res.data.results]);
          setActivityChecks(res.data.results.map(e => false))
        });
    }
  }, [tour, state, activityArr, activityChecks]);

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
            <Form.Field className='reservation-form-field'>
              <label>Choose activities:</label>
              <div className="scrollable"><Table>
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
                  {activityArr && activityArr.map((a,i) => {
                    const [d, t] = getDateTime(a.start_date)
                    return <Table.Row key={`tr-${i}`} onClick={() => clickCheckbox(i)}>
                      <Table.Cell> <Checkbox checked={activityChecks[i]}/> </Table.Cell>
                      <Table.Cell> {a.name} </Table.Cell>
                      <Table.Cell> {`${d}(${t})`} </Table.Cell>
                      <Table.Cell> {a.duration} </Table.Cell>
                      <Table.Cell> {a.location} </Table.Cell>
                      <Table.Cell> {a.price} </Table.Cell>
                    </Table.Row> 
                  })}
                </Table.Body>
              </Table>
              </div>
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
        activityArr={activityArr}
        activityChecks={activityChecks}
      />
    </Modal>
  );
}

export default ReservationModal;
