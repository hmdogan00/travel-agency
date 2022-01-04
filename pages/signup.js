import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import { Button, Container, Form, Tab } from "semantic-ui-react";

const genderOptions = [
  { key: "m", text: "MALE", value: "MALE" },
  { key: "f", text: "FEMALE", value: "FEMALE" },
];

export default function SignupPage() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [identity_no, setIdentity] = useState("");
  const [phone_no, setPhoneNo] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("Customer");

  const handleGenderChange = (e, { value }) => setGender(value);
  const handleRoleChange = (value) => setRole(value);

  const sendSignup = (body) => {
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
        setPassword("");
        setRole("");
      })
      .catch((err) => console.error(err));
  };

  const tabs = [
    {
      menuItem: "Customer",
      render: () => (
        <Tab.Pane>
          <Form
            onSubmit={async () => {
              const body = {
                name: name,
                age: parseInt(age),
                identity_no: identity_no,
                gender: gender,
                phone_no: phone_no,
                email: email,
                password: password,
                role: "Customer",
              };
              sendSignup(body);
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
                options={genderOptions}
                value={gender}
                onChange={handleGenderChange}
              />
              <Form.Input
                fluid
                label="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Button color="green">Submit</Form.Button>
        <Button color="facebook" onClick={() => window.location.href = "/login"}>Log in</Button>
          </Form>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Employee",
      render: () => (
        <Tab.Pane>
          <Form
            onSubmit={async () => {
              const body = {
                name: name,
                identity_no: identity_no,
                phone_no: phone_no,
                email: email,
                password: password,
                role: "Employee",
              };
              sendSignup(body);
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
              <Form.Input
                fluid
                label="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Button color="green">Submit</Form.Button>
        <Button color="facebook" onClick={() => window.location.href = "/login"}>Log in</Button>
          </Form>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Guide",
      render: () => (
        <Tab.Pane>
          <Form
            onSubmit={async () => {
              const body = {
                name: name,
                age: parseInt(age),
                identity_no: identity_no,
                gender: gender,
                phone_no: phone_no,
                email: email,
                password: password,
                location: location,
                role: "Guide",
              };
              sendSignup(body);
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
                label="Location"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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
                options={genderOptions}
                value={gender}
                onChange={handleGenderChange}
              />
              <Form.Input
                fluid
                label="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Button color="green">Submit</Form.Button>
            <Button color="facebook" onClick={() => window.location.href = "/login"}>Log in</Button>
          </Form>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>TripFellas Signup Page</title>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
      </Head>
      <Container style={{ margin: 20 }}>
        <Tab panes={tabs} onClick={e => handleRoleChange(e.target.innerHTML)}></Tab>
      </Container>
    </>
  );
}
