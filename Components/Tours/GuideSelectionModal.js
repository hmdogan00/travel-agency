import { useState, useEffect } from "react";
import { Modal, Header, Form, Input, Button, Checkbox, Table, Label } from "semantic-ui-react";
import axios from "axios";
import { getDateTime } from "../../util.js";

function GuideSelectionModal({ state, setState, tour }) {
  const [guideArr, setGuideArr] = useState(null);
  const [guideSelectionIndex, setguideSelectionIndex] = useState(0);

  const handleCheckboxSelection = (index, value) => {
    setRoomSelectionArray(latestArr => {
      return latestArr = latestArr.map((roomSelection, i) => {
        if ( i === index ) return value;
        else return roomSelection;
      })
    })
    getRoomInformations();
  }

  const assignGuide = () => {
     console.log('assigned')
  }

  useEffect(() => {
    if (state === true && !guideArr && tour.tour_id) {
      axios
        .get(`/api/employee/getAvailableGuides?start=${tour.start_date}&end=${tour.end_date}`)
        .then(res => {
          setGuideArr([...res.data.results]);
          setguideSelectionIndex(0)
        });
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
                    {guideSelectionIndex && guideSelectionIndex.length !== 0 && guideArr && guideArr.map((g, i) => {
                      const [d, t] = getDateTime(a.start_date)
                      return <Table.Row key={`tr-${i}`}>
                        <TableCell>
                              <Checkbox name={`radio-button-${i}`} radio checked={guideSelectionIndex === i} value={i} onChange={(e, {value}) => handleCheckboxSelection(value, roomIndex)}/>
                            </TableCell>
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
