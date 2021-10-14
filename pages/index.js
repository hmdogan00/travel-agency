import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import prisma from "../lib/prisma";

export async function getServerSideProps() {
  const users = await prisma.user.findMany();
  return {
    props: { initialUsers: users },
  };
}

export default function Home({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState("");

  return (
    <>
      <Head>
        <title>Create Next App</title>
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

            await axios.post("/api/create", { user: body });
            await setUsers([...users, body]);
            setFirstName("");
            setLastName("");
            setEmail("");
            setAvatar("");
            setRole(null);
          }}
        >
          <Form.Group widths="equal">
            <input
              type="text"
              label="First Name"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            ></input>
            <br />
            <input
              type="text"
              label="Last Name"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></input>
            <br />
            <input
              type="text"
              label="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <br />
            <input
              type="text"
              label="avatar"
              placeholder="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            ></input>
            <br />
            <select
              onChange={(e) => {
                setRole(e.target.value.toUpperCase());
                console.log(role);
              }}
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </Form.Group>
          <input value="Submit" type="submit" />
        </Form>
      </Container>
    </>
  );
}
