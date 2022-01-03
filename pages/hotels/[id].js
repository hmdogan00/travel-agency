import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  Form,
  Header,
  Button,
  Table,
  Modal,
  TextArea,
} from "semantic-ui-react";
import { getDateTime, includesNoCase, parseDateString } from "../../util";
import Navbar from "../Navbar";

const HotelResPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [role, setRole] = useState("");
  const [reasonModal, setReasonModal] = useState(false);
  const [resItem, setResItem] = useState(null);

  const [hotelArr, setHotelArr] = useState(null);
  const [searchCN, setSearchCN] = useState("");
  const [searchTN, setSearchTN] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");

  const openReasonModal = (e) => {
    setResItem(e);
    setReasonModal(true);
  }

  const closeReasonModal = () => {
    setResItem(null);
    setReasonModal(false);
  }

  const approveRes = (e) => {
    console.log(parseDateString(e.start_date).toISOString())
    if (confirm("Do you want to approve this reservation?")) {
      const body = {
        employee_id: e.employee_id,
        hotel_room_no: e.hotel_room_no,
        hotel_id: e.hotel_id,
        person_id: e.person_id,
        start_date: e.start_date.split('T')[0],
        end_date: e.end_date.split('T')[0],
        is_accepted: "accepted"
      }
      console.log(body);
      axios
        .post('/api/hotel/setBookStatus', body)
        .then(res => {
          if (res.status === 200) {
            alert(res.statusText);
            window.location.reload();
          }
          else alert(res.statusText);
        });
    }
  }

  const searchData = useMemo(() => {
    return hotelArr?.filter(item => {
      if (searchTN !== "")
        return String(item.hotel_room_no).includes(searchTN);
      else if (searchStartDate !== "") {
        const [d, t] = getDateTime(item.start_date);
        return includesNoCase(d, searchStartDate) || includesNoCase(t, searchStartDate);
      }
      else if (searchEndDate !== "") {
        const [d, t] = getDateTime(item.end_date);
        return includesNoCase(d, searchEndDate) || includesNoCase(t, searchEndDate);
      }
      else if (searchCN !== "") return includesNoCase(item.c_name, searchCN);
      else return true;
    });
  }, [hotelArr, searchTN, searchStartDate, searchEndDate, searchCN]);

  const goBack = () => {
    window.location.href = '/hotels';
  }

  // takes effect in initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
    if (!hotelArr && id) {
      const body = {
        hotel_id: id
      }

      axios
        .post(`/api/hotel/getHotelBookRequests?id=${id}`, body)
        .then(res => {
          const tempArr = res.data.results;
          if (tempArr.length !== 0) {
            setHotelArr(res.data.results);
          }
          else {
            goBack();
            alert("There are no reservation for this hotel!");
          }
        })
        .catch(console.error);
    }
  }, [hotelArr, id]);

  return (
    <>
      <Navbar activeType="hotels" />
      <Button
        style={{ marginLeft: "20px" }}
        negative
        content="Back"
        icon="left arrow"
        circular
        onClick={goBack}
      />
      <div style={{ margin: "30px" }}>
        <Header>
          Latest Hotel Reservations {hotelArr && ('for ' + hotelArr[0].name)}
        </Header>
        <br></br>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {role === "Employee" && (
            <Form.Input
              onChange={e => {
                setSearchCN(e.target.value);
                setSearchStartDate("");
                setSearchEndDate("");
                setSearchTN("");
              }}
              value={searchCN}
              placeholder="Search by Customer"
              className="mr-4"
              icon="search"
            />
          )}
          <Form.Input
            onChange={e => {
              setSearchTN("");
              setSearchStartDate(e.target.value);
              setSearchEndDate("");
              setSearchCN("");
            }}
            value={searchStartDate}
            placeholder="Search by Start Date"
            className="mr-4"
            icon="search"
          />
          <Form.Input
            onChange={e => {
              setSearchTN("");
              setSearchStartDate("");
              setSearchEndDate(e.target.value);
              setSearchCN("");
            }}
            value={searchEndDate}
            placeholder="Search by End Date"
            className="mr-4"
            icon="search"
          />
          <Form.Input
            onChange={e => {
              setSearchTN(e.target.value);
              setSearchStartDate("");
              setSearchCN("");
            }}
            value={searchTN}
            placeholder="Search by Room Number"
            className="mr-4"
            icon="search"
          />
        </div>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Customer Name</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell>Start Date</Table.HeaderCell>
              <Table.HeaderCell>End Date</Table.HeaderCell>
              <Table.HeaderCell>Hotel Room No</Table.HeaderCell>
              <Table.HeaderCell>Number of Person</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {searchData &&
              searchData.map((e, i) => {
                const [s_date, s_time] = getDateTime(e.start_date);
                const [e_date, e_time] = getDateTime(e.end_date);
                return (
                  <Table.Row key={`res-${i}`}>
                    <Table.Cell>{e.c_name}</Table.Cell>
                    <Table.Cell>{e.phone_no}</Table.Cell>
                    <Table.Cell>{`${s_date}-${s_time}`}</Table.Cell>
                    <Table.Cell>{`${e_date}-${e_time}`}</Table.Cell>
                    <Table.Cell>{e.hotel_room_no}</Table.Cell>
                    <Table.Cell>{e.no_of_persons}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <Button
                        onClick={() => approveRes(e)}
                        color="green"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => openReasonModal(e)}
                        color="red"
                      >
                        Decline
                      </Button>
                      <Button
                        onClick={() => changeRes(e)}
                        color="yellow"
                      >
                        Change
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            <ReasonModal state={reasonModal} closeModal={closeReasonModal} resItem={resItem} />
          </Table.Body>
        </Table>
      </div>
    </>
  );
};

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

export default HotelResPage;
