import { useState, useEffect } from "react";
import { Modal, Header, Form, Input, Button, Checkbox, Table, TableCell } from "semantic-ui-react";
import axios from "axios";
import { makeRatingString } from "../../util.js";

function GuideSelectionModal({ state, setState, tour }) {
  const [guideArr, setGuideArr] = useState(null);
  const [guideSelectionIndex, setGuideSelectionIndex] = useState(0);

  const handleCheckboxSelection = (index, value) => {
    setGuideSelectionIndex(value)
  }

  const closeModal = () => {
    setGuideArr(null);
    setGuideSelectionIndex(0);
    setState(false);
  }

  const assignGuide = () => {
    if (confirm('You are assigning this quide? Are you sure?')) {
      axios
        .post(`/api/employee/assignGuide?guide_id=${guideArr[guideSelectionIndex].guide_id}&tour_id=${tour.tour_id}`)
        .then(res => {
          if (res.status === 200) alert(`Successfully sent guidance offer to ${guideArr[guideSelectionIndex].name}`);
          else alert(res.data.message);
          window.location.reload();
        })
        .catch(err => alert(err.message));
    }
  }

  useEffect(() => {
    if (state === true && !guideArr && tour.tour_id) {
      axios
        .get(`/api/employee/getAvailableGuides?start=${tour.start_date.split("T")[0]}&end=${tour.end_date.split("T")[0]}`)
        .then(res => {
          setGuideArr([...res.data.results]);
          setGuideSelectionIndex(0)
        })
        .catch(e => console.error(e.message));
    }
  }, [tour, state, guideArr, guideSelectionIndex]);

  return (
    <Modal
      onClose={() => setState(false)}
      onOpen={() => setState(true)}
      closeOnDimmerClick={false}
      open={state}
    >
      <Modal.Header>Guide selection for {tour?.name}</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Field className='reservation-form-field'>
              <div className="scrollable">
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell></Table.HeaderCell>
                      <Table.HeaderCell>Guide Name</Table.HeaderCell>
                      <Table.HeaderCell>Email</Table.HeaderCell>
                      <Table.HeaderCell>Location</Table.HeaderCell>
                      <Table.HeaderCell>Phone No</Table.HeaderCell>
                      <Table.HeaderCell>Rating</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {guideArr && guideArr.map((a, i) => {
                      return <Table.Row key={`tr-${i}`}>
                        <TableCell>
                          <Checkbox name={`radio-button-${i}`} radio checked={guideSelectionIndex === i} value={i} onChange={(e, { value }) => handleCheckboxSelection(i, value)} />
                        </TableCell>
                        <Table.Cell> {a.name} </Table.Cell>
                        <Table.Cell> {a.email} </Table.Cell>
                        <Table.Cell> {a.location} </Table.Cell>
                        <Table.Cell> {a.phone_no} </Table.Cell>
                        <Table.Cell> {makeRatingString(a.rating)} </Table.Cell>
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
        <Button color="red" onClick={() => closeModal()}>
          Cancel
        </Button>
        <Button
          content="Assign Guide"
          labelPosition="right"
          icon="address card"
          onClick={() => assignGuide()}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default GuideSelectionModal;
