import axios from "axios";
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  Container,
  Divider,
  Table,
  Header,
  Button,
  Icon,
  Checkbox
} from "semantic-ui-react";

const options = [
  { key: "m", text: "MALE", value: "MALE" },
  { key: "f", text: "FEMALE", value: "FEMALE" },
];

export default function Home() {
  const [users, setUsers] = useState([]);

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
        <Button color="linkedin" onClick={() => window.location.href = "/signup"}>Sign Up</Button>
        <Button color="facebook" onClick={() => window.location.href = "/login"}>Log in</Button>
      </Container>
    </>
  );
}
