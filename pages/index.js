import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import {
  Form,
  Container,
  Divider,
  Table,
  Header,
  Image,
  Button,
  Icon,
} from "semantic-ui-react";

/*export async function getServerSideProps() {
  const users = await axios.get("/api/getUsers");
  return {
    props: { initialUsers: users },
  };
}*/

const options = [
  { key: "m", text: "MALE", value: "MALE" },
  { key: "f", text: "FEMALE", value: "FEMALE" },
];

export default function Home({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [identity_no, setIdentity] = useState("");
  const [phone_no, setPhoneNo] = useState("");
  const [gender, setGender] = useState("");

  const handleChange = (e, { value }) => setGender(value);

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
            axios.post("/api/createUser", { user: body }).then( res => {
              setUsers([...users, res.data]);
              setName("");
              setAge("");
              setEmail("");
              setIdentity("");
              setGender("");
              setPhoneNo("");
            }).catch( err => console.error(err))
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
        {/* <Divider horizontal>Users</Divider>

        <Table celled collapsing>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>User Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users?.map((user, ind) => (
              <Table.Row key={ind}>
                <Table.Cell>
                  <Header as="h4" image>
                    <Image alt="User Avatar" src={user.avatar} rounded size="mini"></Image>
                    <Header.Content>
                      {`${user.firstName} ${user.lastName}`}

                      <Header.Subheader>
                        {user.role.toUpperCase()}
                      </Header.Subheader>
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>
                  <Header as="h4">{user.email}</Header>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    animated="fade"
                    color="red"
                    onClick={async () => {
                      const res = await axios.delete(
                        `/api/deleteUser/${user.id}`
                      );
                      await setUsers(users.filter((u) => u.id !== user.id));
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
        </Table> */}
      </Container>
    </>
  );
}
