import { Button, Card, Container, Form, Icon, Label, Search, Table, TextArea } from "semantic-ui-react";
import Navbar from "./Navbar";
import { useState, useEffect, useMemo, useReducer } from "react";

function ActivityManagement() {
  const [role, setRole] = useState();
  const [aTitle, setATitle] = useState('');
  const [aType, setAType] = useState('');
  const [aLoc, setALoc] = useState('');
  const [aDesc, setADesc] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [list, setList] = useState();
  const [searchTN, setSearchTN] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchLoc, setSearchLoc] = useState('');

  const searchList = useMemo(
    () => {
      list?.filter((item) => {
        if (searchTN !== "")
          return item.toLowerCase().includes(searchTN.toLowerCase());
        else if (searchType !== "")
          return String(item.userId).toLowerCase().includes(searchType);
        else if (searchLoc !== "")
          return item.groupName.toLowerCase().includes(searchLoc.toLowerCase());
        else
          return true;
      });
    },
    [list, searchTN, searchType, searchLoc]
  );

  const [state, dispatch] = useReducer(reducer, {
    column: null,
    data: searchList,
    direction: null,
  });

  function reducer(state, action) {
    switch (action.type) {
      case "CHANGE_SORT":
        if (state.column === action.column) {
          return {
            ...state,
            data: state.data.slice().reverse(),
            direction:
              state.direction === "ascending" ? "descending" : "ascending",
          };
        }

        return {
          column: action.column,
          data: _.sortBy(state.data, [action.column]),
          direction: "ascending",
        };
      case "UPDATE_DATA":
        return {
          ...state,
          data: searchList,
        };
      default:
        throw new Error();
    }
  }

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
                      <Table.HeaderCell>Type</Table.HeaderCell>
                      <Table.HeaderCell>Location</Table.HeaderCell>
                      <Table.HeaderCell>Description</Table.HeaderCell>
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
                        setSearchType("");
                        setSearchLoc("");
                      }}
                      value={searchTN}
                      placeholder='Search by Tour Name'
                      className='mr-4'
                      icon="search"
                    />
                    <Form.Input
                      loading={loading}
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
                      loading={loading}
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
                </Card.Content>
                <Card.Content>
                  <Table sortable celled fixed color="red">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Tour Name</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
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
