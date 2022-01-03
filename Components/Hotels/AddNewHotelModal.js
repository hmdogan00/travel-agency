import axios from "axios";
import { useState } from "react";
import { Modal, Form, Button, Header, Icon, Input } from "semantic-ui-react";

function AddNewHotelModal({ state, setState }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [noOfEmptyRoom, setNoOfEmptyRoom] = useState("");
  const [noOfTotalRoom, setNoOfTotalRoom] = useState("");
  const [rooms, setRooms] = useState([{size: 1, price: 0, floor: 1, minibarPrice: 3, count: 10}])

  const cancelAddHotel = () => {
    setName("");
    setLocation("");
    setPhone("");
    setNoOfEmptyRoom("");
    setNoOfTotalRoom("");
    setState(false);
  };

  const addNewHotel = () => {
    if (!(name === '' || location === '' || phone === '' || noOfEmptyRoom === '' || noOfTotalRoom === '')) {
      if (confirm("You are adding a new hotel. Are you sure?")) {
        const body = {
          name: name,
          location: location,
          phone_no: phone,
          no_of_empty_room: noOfEmptyRoom,
          no_of_total_room: noOfTotalRoom
        }
        axios.post(`/api/employee/addNewHotel`, body).then(res => {
          const newId = res.data.result.insertId
          rooms.forEach((r,i) => {
            console.log('Line %s-- Size: %s Price: %s Floor: %s minibar: %s count: %s', i, r.size, r.price, r.floor, r.minibarPrice, r.count)
            //hotel_id, room_count, price, room_size, floor, minibar_price
            const roomBody = {
              hotel_id: newId,
              room_count: r.count,
              price: r.price,
              room_size: r.size,
              floor: r.floor,
              minibar_price: r.minibarPrice
            }
            axios.post(`/api/employee/addHotelRoom`, roomBody).catch(e => alert(e.message))
          })
        }).catch(e => alert(e.message))
        alert('Hotel is added!')
      }
    }
    else {
      alert('You must fill all fields!');
    }
  }

  const addRoom = () => {
    setRooms([...rooms, {size: 1, price: 0, floor: 1, minibarPrice: 3, count: 10}]);
  };

  const deleteRoom = index => {
    setRooms(rooms.filter((e, i) => i !== index));
  };

  const handleRoomChange = (value, index, type) => {
    const arr = [];
    rooms.forEach((e, i) => {
      if (i === index) {
        switch (type){
          case 'floor':
            arr.push({...e, floor: value})
            break;
          case 'price':
            arr.push({...e, price: value})
            break;
          case 'size':
            arr.push({...e, size: value})
            break;
          case 'minibar':
            arr.push({...e, minibarPrice: value})
            break;
          case 'count': 
            arr.push({...e, count: value})
            break;
          default : break;
        }
      }
      else arr.push(e);
    });
    setRooms(arr);
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
            {rooms?.map((r, i) => {
              return (
                <Form.Group inline>
                <Button color="red" onClick={() => deleteRoom(i)}>
                  <Button.Content>
                    <Icon name="close" />
                  </Button.Content>
                </Button>
                  <label>Room Floor:</label>
                  <Input
                    type="number"
                    placeholder="Room Floor"
                    defaultValue={r.floor}
                    onChange={e => handleRoomChange(e.target.value, i, 'floor')}
                    style={{ width: "89.7%" }}
                  />
                  <label>Room Price:</label>
                  <Input
                    type="number"
                    placeholder="Room Price"
                    defaultValue={r.price}
                    onChange={e => handleRoomChange(e.target.value, i, 'price')}
                    style={{ width: "89.7%" }}
                  />
                  <label>Room Size:</label>
                  <Input
                    type="number"
                    placeholder="Room Size"
                    defaultValue={r.size}
                    onChange={e => handleRoomChange(e.target.value, i, 'size')}
                    style={{ width: "89.7%" }}
                  />
                  <label>Minibar Prices:</label>
                  <Input
                    type="number"
                    placeholder="Minibar Prices"
                    defaultValue={r.minibarPrice}
                    onChange={e => handleRoomChange(e.target.value, i, 'minibar')}
                    style={{ width: "89.7%" }}
                  />
                  <label>Room Count:</label>
                  <Input
                    type="number"
                    placeholder="Room Count"
                    defaultValue={r.count}
                    onChange={e => handleRoomChange(e.target.value, i, 'count')}
                    style={{ width: "89.7%" }}
                  />
                  </Form.Group>
              );
            })}
            <Button color="blue" onClick={addRoom} content="Add Room" />
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
          onClick={addNewHotel}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default AddNewHotelModal;
