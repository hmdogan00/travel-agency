import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Radio } from "semantic-ui-react";

function ChangeResModal({ state, closeModal, resItem }) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [personNo, setPersonNo] = useState("");
  const [tourId, setTourId] = useState("");
  const [tourArr, setTourArr] = useState(null);
  const [radioState, setRadioState] = useState('');

  useEffect(() => {
    if (state === true) {
      const s_date = resItem.start_date.split("T")[0];
      const e_date = resItem.end_date.split("T")[0];

      setName(resItem.c_name);
      setStartDate(s_date);
      setEndDate(e_date);
      setPersonNo(resItem.personNo);
      setTourId(resItem.tour_id);

      if (!tourArr) {
        axios
          .get("/api/getAllTours")
          .then(res => setTourArr([...res.data.results]))
          .catch(e => alert(e.message));
        setRadioState(resItem.tour_id);
      }
    }
  }, [state]);

  const cancel = () => {
    if (confirm("You are leaving your text without submiting it. Are you sure?")) {
      setName('');
      setStartDate('');
      setEndDate('');
      setPersonNo('');
      setTourId('');
      setTourArr(null);
      setRadioState('');
      closeModal();
    }
  }

  const changeReservation = () => {
    if (confirm("You are changing the reservation. Are you sure?")) {
      const body = {
        start: startDate,
        end: endDate,
        person_count: parseInt(personNo),
        tour_id: radioState,
        res_id: resItem.reservation_id
      };

      axios
        .post('/api/employee/updateTourReservation', body)
        .then(res => {
          if (res.status === 200) {
            alert(res.statusText);
            closeModal();
            window.location.reload();
          }
          else alert(res.statusText);
        })
        .catch(e => alert(e.message));
    }
  }

  return (
    <>
      <Modal
        onClose={closeModal}
        closeOnDimmerClick={false}
        open={state}
        size="small"
      >
        <Modal.Header>Change Reservation Information for {name}:</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group>
              <Form.Field width={8}>
                <label>Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </Form.Field>
              <Form.Field width={8}>
                <label>End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Field width={8}>
                <label>Person Number for Reservation</label>
                <Input
                  type="number"
                  value={personNo}
                  onChange={e => setPersonNo(e.target.value)}
                />
              </Form.Field>
            </Form.Group>
            {tourArr && <Form.Field>
              <label>Change tour:</label>
            </Form.Field>}
            {tourArr && tourArr.map((e, i) => {
              return (
                <Form.Field key={`radioField-${i}`}>
                  <Radio
                    label={e.name + ' - ' + e.location}
                    checked={radioState === e.tour_id}
                    onChange={() => setRadioState(e.tour_id)}
                  />
                </Form.Field>
              );
            })}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={cancel}>
            Cancel
          </Button>
          <Button
            content="Change Reservation"
            labelPosition="right"
            icon="exchange"
            onClick={changeReservation}
            positive
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default ChangeResModal;
