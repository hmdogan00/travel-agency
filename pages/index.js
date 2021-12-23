import axios from "axios";
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  Form,
  Container,
  Divider,
  Table,
  Header,
  Image,
  Button,
  Icon,
  TableRow,
  TextArea,
  Checkbox
} from "semantic-ui-react";

const options = [
  { key: "m", text: "MALE", value: "MALE" },
  { key: "f", text: "FEMALE", value: "FEMALE" },
];

export default function Home() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [identity_no, setIdentity] = useState("");
  const [phone_no, setPhoneNo] = useState("");
  const [gender, setGender] = useState("");

  const handleChange = (e, { value }) => setGender(value);

  useEffect(() => {
    axios.get("/api/getUsers").then((res) => setUsers(res.data.results));
  }, []);

  return (
    <>
      <Head>
        <title>Travel Agency App</title>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
      </Head>
      <Container style={{ margin: 20 }}>
        <Button onClick={() => window.location.href="/signup"}>Sign Up</Button>
        <Button onClick={() => window.location.href="/login"}>Log in</Button>
        <Divider horizontal>Customers</Divider>

        <Table celled unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Age</Table.HeaderCell>
              <Table.HeaderCell>Gender</Table.HeaderCell>
              <Table.HeaderCell>Phone No</Table.HeaderCell>
              <Table.HeaderCell>Identity No</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Number of Trips</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users?.map((user, ind) => (
              <Table.Row key={ind}>
                <Table.Cell>
                  <Header as="h4">{user.id}</Header>
                </Table.Cell>
                <Table.Cell>
                  <Header as="h4" image>
                    <Header.Content>{`${user.name}`}</Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>
                  <Header as="h4">{user.age}</Header>
                </Table.Cell>
                <Table.Cell>
                  <Icon style={{marginLeft:"10px"}} size="large" name={user.gender === "Male" ? "male" : "female"}></Icon>
                </Table.Cell>
                <Table.Cell>
                  <Header as="h4">{user.phone_no}</Header>
                </Table.Cell>
                <Table.Cell>
                  <Header as="h4">{user.identity_no}</Header>
                </Table.Cell>
                <Table.Cell>
                  <Header as="h4">{user.email}</Header>
                </Table.Cell>
                <Table.Cell>
                  <Header as="h4">{user.no_of_trips}</Header>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    animated="fade"
                    color="red"
                    onClick={async () => {
                      const res = await axios.delete(
                        `/api/deleteUser/${user.id}`
                      );
                      if (res.status === 200) await setUsers(users.filter((u) => u.id !== user.id));
                    }}
                  >
                    <Button.Content visible>Delete</Button.Content>
                    <Button.Content hidden>
                      <Icon name="user delete" />
                    </Button.Content>
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <h1>TODO:</h1>
        <p style={{width: "%100", height: "%80"}}><Checkbox disabled></Checkbox>1. Book a tour (by a customer)<br/>&emsp;
<Checkbox disabled></Checkbox>a. List all available tours and apply filters. (date, place, type, etc.)<br/>&emsp;
<Checkbox disabled></Checkbox>b. Select a tour and select the desired start date.<br/>&emsp;
<Checkbox disabled checked></Checkbox>c. Indicate the number of people for booking.<br/>&emsp;
<Checkbox disabled></Checkbox>d. List all available activities of the selected tour.<br/>&emsp;&emsp;
<Checkbox disabled></Checkbox>i. Extra activities cost additional money, therefore select the desired one for
each guest.<br/>&emsp;
<Checkbox disabled checked></Checkbox>e. Make the payment accordingly.<br/>&emsp;
<Checkbox disabled></Checkbox>f. Give feedback about the tour and the guide. (comment and rate)<br/>
<Checkbox disabled></Checkbox>2. Reservation management (by an employee and a customer)<br/>&emsp;
<Checkbox disabled></Checkbox>a. Hotel reservation<br/>&emsp;&emsp;
<Checkbox disabled></Checkbox>i. List all available hotels and select the desired one. (apply filters like stars,
city, etc.)<br/>&emsp;&emsp;
<Checkbox disabled></Checkbox>ii. Select the dates for the reservation and indicate the number of guests.<br/>&emsp;&emsp;
<Checkbox disabled></Checkbox>iii. If a customer makes the reservation, approve or decline it. If declined,
state the reason. (employee)<br/>&emsp;
<Checkbox disabled></Checkbox>b. Tour reservation<br/>&emsp;&emsp;
<Checkbox disabled></Checkbox>i. Make a tour reservation for a customer.<br/>&emsp;&emsp;
<Checkbox disabled checked></Checkbox>ii. Approve or decline tour reservations made by customers themselves. If
declined, state the reason.<br/>&emsp;
<Checkbox disabled></Checkbox>c. Update a hotel/tour reservation detail<br/>&emsp;&emsp;
<Checkbox disabled checked></Checkbox>i. Customers cannot update themselves.<br/>&emsp;&emsp;
<Checkbox disabled></Checkbox>ii. Employees can update any detail about the reservation.<br/>
<Checkbox disabled></Checkbox>3. Tour guiding (by an employee and a guide)<br/>&emsp;
<Checkbox disabled></Checkbox>a. List all tours without an assigned guide. (employee)<br/>&emsp;
<Checkbox disabled></Checkbox>b. Select a tour and assign an available guide. (employee)<br/>&emsp;
<Checkbox disabled></Checkbox>c. List all available assigned tours. (guide)<br/>&emsp;
<Checkbox disabled checked></Checkbox>d. Select a tour and accept or decline to guide. (guide)<br/>&emsp;&emsp;
<Checkbox disabled></Checkbox>i. If declined, state the reason.<br/>&emsp;
<Checkbox disabled></Checkbox>e. If accepted, give feedback about the tour. (guide)</p>
      </Container>
    </>
  );
}
