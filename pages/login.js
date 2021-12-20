import axios from "axios";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Container, Form, Button, Image } from "semantic-ui-react";

const roleOptions = [
  { key: "c", text: "CUSTOMER", value: "Customer" },
  { key: "e", text: "EMPLOYEE", value: "Employee" },
  { key: "g", text: "GUIDE", value: "Guide" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [login, isLogin] = useState(0);
  const [loginCredentials, setLoginCredentials] = useState(null);
  
  useEffect(() => {
    if (login === 1){
      localStorage.setItem("email", email);
      localStorage.setItem("role", role);
      window.location.href = "/dashboard";
    }
  }, [login, role, email]);

  const handleRoleChange = (e, { value }) => setRole(value);
  return (
    <>
      <Head>
        <title>TripFellas Login Page</title>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
      </Head>
      <Container className="login">
        <div className="mid-container-logo">
          <Image className="logo" alt="logo" src="/tp-logo.png" />
          <h1>TripFellas</h1>
        </div>
        <div className="mid-container-b">
          <Container>
            <Form
              onSubmit={async () => {
                const body = {
                  email: email,
                  password: password,
                  role: role
                };
                axios
                  .post("/api/userLogin", body)
                  .then((res) => {
                    setEmail("");
                    setPassword("");
                    if (res.data.messageType === "SUCCESS") {
                      setLoginCredentials({ email: res.data.email });
                      isLogin(1);
                    }
                    else if (res.status === 201) {
                      isLogin(2);
                    }
                  })
                  .catch((err) => console.error(err));
              }}
            >
              <Form.Group widths="equal">
                <div className="mid-container">
                  <Form.Input
                    label="Email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Form.Input
                    label="Password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Form.Select
                    label="Role"
                    placeholder="Role"
                    options={roleOptions}
                    value={role}
                    onChange={handleRoleChange}
                  />
                </div>
              </Form.Group>
              <Form.Button>Log in</Form.Button>
              <Button onClick={() => (window.location.href = "/")}>Go Back</Button>
            </Form>
          </Container>
          {login === 1 && loginCredentials !== null && (
            <h1>{`Login is successful with email ${loginCredentials.email}`}</h1>
          )}
          {login === 2 && <h1>Düzgün şifre gir aq</h1>}
        </div>
      </Container>
    </>
  );
}
