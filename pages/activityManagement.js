import { Button, Card, Container, Form, Icon, Label, Search, Table, TextArea } from "semantic-ui-react";
import Navbar from "./Navbar";
import { useState, useEffect, useMemo } from "react";

function ActivityManagement() {
  const [role, setRole] = useState();
  const [aTitle, setATitle] = useState('');
  const [aDate, setADate] = useState('');
  const [aLoc, setALoc] = useState('');
  const [aDesc, setADesc] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [list, setList] = useState();
  const [searchTN, setSearchTN] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchLoc, setSearchLoc] = useState('');

  const searchList = useMemo(
    () => {
      list?.filter((item) => {
        if (searchTN !== "")
          return item.toLowerCase().includes(searchTN.toLowerCase());
        else if (searchDate !== "")
          return String(item.userId).toLowerCase().includes(searchDate);
        else if (searchLoc !== "")
          return item.groupName.toLowerCase().includes(searchLoc.toLowerCase());
        else
          return true;
      });
    },
    [list, searchTN, searchDate, searchLoc]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem('role'));
    }
  }, []);

  const submitForm = () => {
    const data = {
      aTitle: aTitle,
      aDesc: aDesc
    };
    setSubmitSuccess(!submitSuccess);
  };

  return (
    <>
      <Navbar activeType="activityManagement" />
      {
        role === 'Customer' || role === 'Guide' ?
          <Container>
            <Card fluid color="red">
              <Card.Content header='Activity Request Form' />
              <Card.Content>
                <Form onSubmit={submitForm}>
                  <Form.Input
                    label='Activity Title'
                    placeholder='Enter title of the activity'
                    value={aTitle}
                    onChange={(e) => setATitle(e.target.value)}
                    required
                  />
                  <Form.Input
                    label='Activity Date'
                    placeholder='Enter date of the activity'
                    value={aDate}
                    onChange={(e) => setADate(e.target.value)}
                  />
                  <Form.Input
                    label='Activity Location'
                    placeholder='Enter location of the activity'
                    value={aLoc}
                    onChange={(e) => setALoc(e.target.value)}
                    required
                  />
                  <Form.Field>
                    <label>Activity Description</label>
                    <TextArea
                      placeholder='Write description of the activity...'
                      style={{ minHeight: 100 }}
                      value={aDesc}
                      onChange={(e) => setADesc(e.target.value)}
                    />
                  </Form.Field>
                  <Form.Button>Submit</Form.Button>
                </Form>
              </Card.Content>
            </Card>
            <Card fluid color="red">
              <Card.Content header='Requests Sent' />
              <Card.Content>
                <Table fixed color="red">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Tour Name</Table.HeaderCell>
                      <Table.HeaderCell>Date</Table.HeaderCell>
                      <Table.HeaderCell>Location</Table.HeaderCell>
                      <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Cell</Table.Cell>
                      <Table.Cell>Cell</Table.Cell>
                      <Table.Cell>Cell</Table.Cell>
                      <Table.Cell>
                        <Label color="yellow">Waiting</Label>
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Cell</Table.Cell>
                      <Table.Cell>Cell</Table.Cell>
                      <Table.Cell>Cell</Table.Cell>
                      <Table.Cell>
                        <Label color="green">Approved</Label>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>

                </Table>
              </Card.Content>
            </Card>
          </Container> :
          role === 'Employee' ?
            <Container>
              <Card fluid color="red">
                <Card.Content header='Requested Activities' />
                <Card.Content>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Form.Input
                      loading={loading}
                      onChange={(e) => {
                        setSearchTN(e.target.value);
                        setSearchDate("");
                        setSearchLoc("");
                      }}
                      value={searchTN}
                      placeholder='Search by Tour Name'
                      className='mr-4'
                    />
                    <Form.Input
                      loading={loading}
                      onChange={(e) => {
                        setSearchTN("");
                        setSearchDate(e.target.value);
                        setSearchLoc("");
                      }}
                      value={searchDate}
                      placeholder='Search by Date'
                      className='mr-4'
                    />
                    <Form.Input
                      loading={loading}
                      onChange={(e) => {
                        setSearchTN("");
                        setSearchDate("");
                        setSearchLoc(e.target.value);
                      }}
                      value={searchLoc}
                      placeholder='Search by Location'
                    />
                  </div>
                </Card.Content>
                <Card.Content>
                  <Table celled fixed color="red">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Tour Name</Table.HeaderCell>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell>Location</Table.HeaderCell>
                        <Table.HeaderCell>Requested By</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>
                          <Button color="green">Approve</Button>
                          <Button color="red">Decline</Button>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>
                          <Button color="green">Approve</Button>
                          <Button color="red">Decline</Button>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>
                          <Button color="green">Approve</Button>
                          <Button color="red">Decline</Button>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>

                  </Table>
                </Card.Content>
              </Card>
            </Container> :
            null
      }
    </>
  );
}

export default ActivityManagement;
