import { Button, ButtonGroup, Card, Container, Form, Header, Label, Table, TextArea } from "semantic-ui-react";
import Navbar from "./Navbar";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ApproveActModal from "../Components/ActivityManagement/ApproveActModal";

function ActivityManagement() {
  const [role, setRole] = useState();
  const [aTitle, setATitle] = useState('');
  const [aType, setAType] = useState('');
  const [aLoc, setALoc] = useState('');
  const [aDesc, setADesc] = useState('');

  const [list, setList] = useState([]);
  const [searchTN, setSearchTN] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchLoc, setSearchLoc] = useState('');

  var [approveActOpen, setApproveActOpen] = useState(false);
  var [selectedIdea, setSelectedIdea] = useState(null);
  const [listType, setListType] = useState("waiting");

  const searchList = useMemo(() => {
    return list?.filter((item) => {
      if (searchTN !== "")
        return item.name.toLowerCase().includes(searchTN.toLowerCase());
      else if (searchType !== "")
        return item.type.toLowerCase().includes(searchType);
      else if (searchLoc !== "")
        return item.location.toLowerCase().includes(searchLoc.toLowerCase());
      else
        return true;
    });
  },
    [list, searchTN, searchType, searchLoc]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem('role');
      setRole(role);
      if (list && list.length === 0) {
        if (role === 'Customer' || role === 'Guide') {
          axios
            .get(`/api/customer/offeredActivities?id=${localStorage.getItem('id')}`)
            .then(res => setList(res.data.result));
        }
        else {
          const body = {
            res_type: 'waiting'
          }
          axios
            .post(`/api/employee/getActivityIdeas`, body)
            .then(res => setList(res.data.result));
        }
      }
    }
  }, []);

  const submitForm = () => {
    const body = {
      activity: {
        name: aTitle,
        type: aType,
        location: aLoc,
        description: aDesc
      },
      id: localStorage.getItem('id')
    };
    axios
      .post(`/api/customer/createActivity`, body)
      .then(res => {
        res.status === 200 ? alert(res.statusText) : null;
      })
  };

  const declineActivityIdea = id => {
    if (confirm("Are you sure about declining this activity idea?")) {
      const body = {
        id: id
      }
      axios
        .post(`/api/employee/declineActivityIdea`, body)
        .then(res => {
          res.status === 200 ? alert(res.statusText) : null;
        });
      window.location.reload();
    }
  };

  const expandModal = idea => {
    setSelectedIdea(idea);
    setApproveActOpen(true);
  };

  const closeModal = () => {
    setSelectedIdea(null);
    setApproveActOpen(false);
  };


  const listWaiting = () => {
    setListType('waiting');
    const body = {
      res_type: 'waiting'
    }

    axios
      .post(`/api/employee/getActivityIdeas`, body)
      .then(res => {
        const tempArr = res.data.result;
        if (tempArr.length !== 0) {
          setList(tempArr);
        }
        else {
          setList(null);
          alert("There are no waiting activity ideas!");
        }
      })
      .catch(console.error);
  }

  const listAccepted = () => {
    setListType('accepted');
    const body = {
      res_type: 'accepted'
    }

    axios
      .post(`/api/employee/getActivityIdeas`, body)
      .then(res => {
        const tempArr = res.data.result;
        if (tempArr.length !== 0) {
          setList(tempArr);
        }
        else {
          setList(null);
          alert("There are no accepted activity ideas!");
        }
      })
      .catch(console.error);
  }

  const listDeclined = () => {
    setListType('declined');
    const body = {
      res_type: 'rejected'
    }

    axios
      .post(`/api/employee/getActivityIdeas`, body)
      .then(res => {
        const tempArr = res.data.result;
        if (tempArr.length !== 0) {
          setList(tempArr);
        }
        else {
          setList(null);
          alert("There are no declined activity ideas!");
        }
      })
      .catch(console.error);
  }


  return (
    <>
      <Navbar activeType="activityManagement" />
      {
        role === 'Customer' || role === 'Guide' ?
          <Container>
            <Card fluid color="red">
              <Card.Content header='Activity Request Form' />
              <Card.Content>
                <Form>
                  <Form.Input
                    label='Activity Title'
                    placeholder='Enter title of the activity'
                    value={aTitle}
                    onChange={(e) => setATitle(e.target.value)}
                    required
                  />
                  <Form.Input
                    label='Activity Type'
                    placeholder='Enter type of the activity'
                    value={aType}
                    onChange={(e) => setAType(e.target.value)}
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
                  <Button onClick={submitForm}>Submit</Button>
                </Form>
              </Card.Content>
            </Card>
            <Card fluid color="red">
              <Card.Content header='Requests Sent' />
              <Card.Content className="activity-requests">
                <Table fixed color="red">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Tour Name</Table.HeaderCell>
                      <Table.HeaderCell>Type</Table.HeaderCell>
                      <Table.HeaderCell>Location</Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
                      <Table.HeaderCell></Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {searchList && searchList.map((e, i) => {
                      return <Table.Row>
                        <Table.Cell>{e.name}</Table.Cell>
                        <Table.Cell>{e.type}</Table.Cell>
                        <Table.Cell>{e.location}</Table.Cell>
                        <Table.Cell>{e.description}</Table.Cell>
                        <Table.Cell>
                          {e.is_accepted === 'waiting' && <Label color="yellow">Waiting</Label>}
                          {e.is_accepted === 'accepted' && <Label color="green">Accepted</Label>}
                          {e.is_accepted === 'rejected' && <Label color="red">Declined</Label>}
                        </Table.Cell>
                      </Table.Row>
                    })}
                  </Table.Body>

                </Table>
              </Card.Content>
            </Card>
          </Container> :
          role === 'Employee' ?
            <div style={{ margin: "30px" }}>
              <div style={{ display: "flex", flexDirection: "row", marginBottom: '30px' }}>
                <Form.Input
                  onChange={(e) => {
                    setSearchTN(e.target.value);
                    setSearchType("");
                    setSearchLoc("");
                  }}
                  value={searchTN}
                  placeholder='Search by Tour Name'
                  className='mr-4'
                  icon="search"
                />
                <Form.Input
                  onChange={(e) => {
                    setSearchTN("");
                    setSearchType(e.target.value);
                    setSearchLoc("");
                  }}
                  value={searchType}
                  placeholder='Search by Type'
                  className='mr-4'
                  icon="search"
                />
                <Form.Input
                  onChange={(e) => {
                    setSearchTN("");
                    setSearchType("");
                    setSearchLoc(e.target.value);
                  }}
                  value={searchLoc}
                  placeholder='Search by Location'
                  icon="search"
                />
              </div>
              <Header floated="left">
                Requested Activities
                <div>
                  <ButtonGroup>
                    <Button
                      content="Waiting"
                      color="yellow"
                      size="tiny"
                      basic={listType !== 'waiting'}
                      onClick={listWaiting}
                    />
                    <Button.Or />
                    <Button
                      content="Accepted"
                      color="green"
                      size="tiny"
                      basic={listType !== 'accepted'}
                      onClick={listAccepted}
                    />
                    <Button.Or />
                    <Button
                      content="Declined"
                      color="red"
                      size="tiny"
                      basic={listType !== 'declined'}
                      onClick={listDeclined}
                    />
                  </ButtonGroup>
                </div>
              </Header>

              <Table celled color="red">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Tour Name</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Location</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell>Requested By</Table.HeaderCell>
                    {listType === 'waiting' && <Table.HeaderCell></Table.HeaderCell>}
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {
                    searchList && searchList.map((e, i) => {
                      return <Table.Row>
                        <Table.Cell>{e.name}</Table.Cell>
                        <Table.Cell>{e.type}</Table.Cell>
                        <Table.Cell>{e.location}</Table.Cell>
                        <Table.Cell>{e.description}</Table.Cell>
                        <Table.Cell>{e.role}</Table.Cell>
                        {listType === 'waiting' && <Table.Cell>
                          <Button
                            color="green"
                            onClick={() => expandModal(e)}>
                            Approve
                          </Button>
                          <Button
                            color="red"
                            onClick={() => declineActivityIdea(e.act_idea_id)}
                          >
                            Decline
                          </Button>
                        </Table.Cell>}
                      </Table.Row>
                    })}
                  <ApproveActModal state={approveActOpen} closeModal={closeModal} actIdea={selectedIdea} />
                </Table.Body>
              </Table>
            </div> :
            null
      }
    </>
  );
}

export default ActivityManagement;
