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
        <h3>Signup trial for api</h3>
        <Form
          onSubmit={async () => {
            const body = {
              name: name,
              age: parseInt(age),
              identity_no: identity_no,
              gender: gender,
              phone_no: phone_no,
              email: email,
            };
            axios
              .post("/api/createUser", { user: body })
              .then((res) => {
                setUsers([...users, res.data]);
                setName("");
                setAge("");
                setEmail("");
                setIdentity("");
                setGender("");
                setPhoneNo("");
              })
              .catch((err) => console.error(err));
          }}
        >
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="Name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <Form.Input
              fluid
              label="Age"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <Form.Input
              fluid
              label="Email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Input
              fluid
              label="Identity No"
              placeholder="Identity No"
              value={identity_no}
              onChange={(e) => setIdentity(e.target.value)}
            />
            <Form.Input
              fluid
              label="Phone No"
              placeholder="Phone No"
              value={phone_no}
              onChange={(e) => setPhoneNo(e.target.value)}
            />
            <Form.Select
              fluid
              label="Gender"
              placeholder="Gender"
              options={options}
              value={gender}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Button>Submit</Form.Button>
        </Form>
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
                  <Icon style={{marginLeft:"10px"}} size="large" name={user.gender === "MALE" ? "male" : "female"}></Icon>
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
      </Container>
    </>
  );
}
