import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import { Form, Container, Divider, Table, Header, Image, Button, Icon } from "semantic-ui-react";
import prisma from "../lib/prisma";

export async function getServerSideProps() {
  const users = await prisma.user.findMany();
  return {
    props: { initialUsers: users },
  };
}

const options = [
  { key: "u", text: "USER", value: "USER" },
  { key: "a", text: "ADMIN", value: "ADMIN" },
];

export default function Home({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState("");

  const handleChange = (e, { value }) => setRole(value);

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
        <h3>Signup trial for prisma api</h3>
        <Form
          onSubmit={async () => {
            const body = {
              firstName,
              lastName,
              role,
              email,
              avatar,
            };

            const res = await axios.post("/api/createUser", { user: body });
            console.log(res.data)
            await setUsers([...users, res.data]);
            setFirstName("");
            setLastName("");
            setEmail("");
            setAvatar("");
            setRole(null);
          }}
        >
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="First Name"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <br />
            <Form.Input
              fluid
              label="Last Name"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
              label="Avatar"
              placeholder="Avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
            <Form.Select
              fluid
              label="Role"
              placeholder="Role"
              options={options}
              value={role}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Button>Submit</Form.Button>
        </Form>
        <Divider horizontal>Users</Divider>
          
          <Table celled collapsing>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>User Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              { users.map((user, ind) => 
                <Table.Row key={ind}>
                  <Table.Cell>
                    <Header as='h4' image>
                      <Image src={user.avatar} rounded size='mini'></Image>
                      <Header.Content>
                        {`${user.firstName} ${user.lastName}`}

                        <Header.Subheader>{user.role.toUpperCase()}</Header.Subheader>
                      </Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell>
                    <Header as='h4'>{user.email}</Header>
                  </Table.Cell>
                  <Table.Cell>
                    <Button animated='fade' color='red' onClick={async () => {
                      const res = await axios.delete(`/api/deleteUser/${user.id}`)
                      await setUsers(users.filter(u => u.id !== user.id))
                    }}>
                      <Button.Content visible>Delete</Button.Content>
                      <Button.Content hidden>
                        <Icon name='user delete'/>
                      </Button.Content>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
      </Container>
    </>
  );
}
