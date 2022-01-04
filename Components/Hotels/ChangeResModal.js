import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Input, Label, Modal, Radio } from "semantic-ui-react";

function ChangeResModal({ state, closeModal, resItem }) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hotelRoomNo, setHotelRoomNo] = useState("");
  const [roomSize, setRoomSize] = useState(3);

  const [roomArr, setRoomArr] = useState(null);
  const [radioState, setRadioState] = useState('');

  const changeStartDate = e => setStartDate(e);
  const changeEndDate = e => setEndDate(e);
  const changeRoomSize = e => setRoomSize(e);

  useEffect(() => {
    if (state === true) {
      const s_date = resItem.start_date.split("T")[0];
      const e_date = resItem.end_date.split("T")[0];

      setName(resItem.c_name);
      setStartDate(s_date);
      setEndDate(e_date);
      setHotelRoomNo(resItem.hotel_room_no);
    }
  }, [state]);

  useEffect(() => {
    if (state && startDate !== '' && roomSize !== '') {
      axios
        .get(
          `/api/hotel/getAvailableRooms?hotel_id=${resItem.hotel_id}&size=${roomSize}&st=${startDate}&en=${endDate}`
        )
        .then(res => setRoomArr([...res.data.results]));
      setRadioState(resItem.tour_id);
    }
  }, [state, startDate, endDate, roomSize]);

  const cancel = () => {
    if (confirm("You are leaving your text without submiting it. Are you sure?")) {
      setName('');
      setStartDate('');
      setEndDate('');
      setHotelRoomNo('');
      setRoomArr(null);
      setRadioState('');
      setRoomSize(3);
      closeModal();
    }
  }

  const changeReservation = () => {
    if (confirm("You are changing the reservation. Are you sure?")) {
      let currEmpId;
      if (typeof window !== "undefined")
        currEmpId = localStorage.getItem("id");
      else
        currEmpId = resItem.employee_id;

      const s_date = resItem.start_date.split("T")[0];
      const e_date = resItem.end_date.split("T")[0];

      const body = {
        oldbook: {
          start: s_date,
          end: e_date,
          id: resItem.employee_id,
          room: resItem.hotel_room_no,
          hotel: resItem.hotel_id
        },
        newbook: {
          start: startDate,
          end: endDate,
          room: radioState === '' ? hotelRoomNo : parseInt(radioState)
        },
        id: currEmpId
      };

      axios
        .post('/api/employee/updateHotelReservation', body)
        .then(res => {
          if (res.status === 200) {
            alert(res.statusText);
            closeModal();
            window.location.reload();
          }
        })
        .catch(r => alert('The room is occupied during the same dates!'));
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
                  onChange={e => changeStartDate(e.target.value)}
                />
              </Form.Field>
              <Form.Field width={8}>
                <label>End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={e => changeEndDate(e.target.value)}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Field width={8}>
                <label>Current Hotel Room No</label>
                <Label
                  content={hotelRoomNo}
                  size="large"
                />
              </Form.Field>
              <Form.Field width={8}>
                <label>Hotel Room Size</label>
                <Input
                  type="number"
                  value={roomSize}
                  onChange={e => changeRoomSize(e.target.value)}
                />
              </Form.Field>
            </Form.Group>
            {roomArr && <Form.Field>
              <label>Change tour:</label>
            </Form.Field>}
            {roomArr && roomArr.map((e, i) => {
              return (
                <Form.Field key={`radioField-${i}`}>
                  <Radio
                    label={e.hotel_room_no + ' - Floor: ' + e.room_floor}
                    checked={radioState === e.hotel_room_no}
                    onChange={() => setRadioState(e.hotel_room_no)}
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
