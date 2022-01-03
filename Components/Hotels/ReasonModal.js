import { useState } from "react";
import { Button, Form, Modal, TextArea } from "semantic-ui-react";

function ReasonModal({ state, closeModal, resItem }) {
  const [text, setText] = useState("");

  const cancelReason = () => {
    if (confirm("You are leaving your text without submiting it. Are you sure?")) {
      setText("");
      closeModal();
    }
  }

  const declineRes = () => {
    if (confirm("Do you want to decline this reservation?")) {
      const body = {
        employee_id: resItem.employee_id,
        hotel_room_no: resItem.hotel_room_no,
        hotel_id: resItem.hotel_id,
        person_id: resItem.person_id,
        start_date: resItem.start_date,
        end_date: resItem.end_date,
        is_accepted: "accepted",
        reject_reason: text
      }

      axios
        .post('/api/hotel/setBookStatus', body)
        .then(res => {
          if (res.status === 200) {
            alert(res.statusText);
            closeModal();
            window.location.reload();
          }
          else alert(res.statusText);
        });
    }
  }

  return (
    <>
      <Modal
        onClose={closeModal}
        closeOnDimmerClick={false}
        open={state}
        size="tiny"
      >
        <Modal.Header>State your reason for declining the reservation:</Modal.Header>
        <Modal.Content>
          <Form>
            <TextArea
              placeholder='State your reason here...'
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={cancelReason}>
            Cancel
          </Button>
          <Button
            content="Submit"
            labelPosition="right"
            icon="add square"
            onClick={declineRes}
            positive
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default ReasonModal;
