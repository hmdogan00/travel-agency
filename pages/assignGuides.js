import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Button, Card, Form, Header, Table } from "semantic-ui-react";
import Navbar from "./Navbar";
import { getDateTime, makeRatingString, includesNoCase } from "../util";
import GuideSelectionModal from "../Components/Tours/GuideSelectionModal.js";

const AssignGuides = () => {
  const [role, setRole] = useState("");
  const [tourArr, setTourArr] = useState([]);
  const [searchN, setSearchN] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchLoc, setSearchLoc] = useState("");
  const [searchType, setSearchType] = useState("");
  const [loading, setLoading] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  const searchData = useMemo(() => {
    return tourArr?.filter(item => {
      if (searchN !== "")
        return includesNoCase(item.name, searchN);
      else if (searchDate !== "") {
        const [d, t] = getDateTime(item.start_date);
        return includesNoCase(d, searchDate) || includesNoCase(t, searchDate);
      } else if (searchLoc !== "")
        return includesNoCase(item.location, searchLoc);
      else if (searchType !== "") return includesNoCase(item.type, searchType);
      else return true;
    });
  }, [tourArr, searchN, searchDate, searchLoc, searchType]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
    if (tourArr.length === 0) {
      axios
        .get("/api/employee/seeGuidelessTours")
        .then(res => setTourArr([...res.data.results]));
    }
  }, []);

  return (
    <>
      <Navbar activeType="tours" />
      <div style={{ display: "flex", flexDirection: "row", margin: "30px" }}>
        <Form.Input
          loading={loading}
          onChange={e => {
            setSearchN(e.target.value);
            setSearchDate("");
            setSearchLoc("");
            setSearchType("");
          }}
          value={searchN}
          placeholder="Search by Tour Name"
          className="mr-4"
          icon="search"
        />
        <Form.Input
          loading={loading}
          onChange={e => {
            setSearchN("");
            setSearchType(e.target.value);
            setSearchLoc("");
            setSearchDate("");
          }}
          value={searchType}
          placeholder="Search by Type"
          className="mr-4"
          icon="search"
        />
        <Form.Input
          loading={loading}
          onChange={e => {
            setSearchN("");
            setSearchType("");
            setSearchLoc(e.target.value);
            setSearchDate("");
          }}
          value={searchLoc}
          placeholder="Search by Location"
          className="mr-4"
          icon="search"
        />
        <Form.Input
          loading={loading}
          onChange={e => {
            setSearchN("");
            setSearchType("");
            setSearchLoc("");
            setSearchDate(e.target.value);
          }}
          value={searchDate}
          placeholder="Search by Date"
          icon="search"
        />
      </div>
      <div style={{ margin: "30px" }}>
        {tourArr?.length === 0 && (
          <Header>There are no tours for reservation.</Header>
        )}
        {tourArr && (
          <>
            <Header floated="left">Tours with Unassigned Guides</Header>
            <Table celled color="red">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>ID</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Location</Table.HeaderCell>
                  <Table.HeaderCell>Price</Table.HeaderCell>
                  <Table.HeaderCell>Dates</Table.HeaderCell>
                  <Table.HeaderCell>Capacity</Table.HeaderCell>
                  <Table.HeaderCell>Type</Table.HeaderCell>
                  <Table.HeaderCell>Company</Table.HeaderCell>
                  <Table.HeaderCell>Rating</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {searchData.map((e, i) => {
                  const [startDate, startTime] = getDateTime(e.start_date);
                  const [endDate, endTime] = getDateTime(e.end_date);
                  return (
                    <>
                      <Table.Row>
                        <Table.Cell>{i + i}</Table.Cell>
                        <Table.Cell>{e.name}</Table.Cell>
                        <Table.Cell>{e.location}</Table.Cell>
                        <Table.Cell>{e.price}</Table.Cell>
                        <Table.Cell>
                          {`${startDate}(${startTime}) - ${endDate}(${endTime})`}
                        </Table.Cell>
                        <Table.Cell>{e.capacity}</Table.Cell>
                        <Table.Cell>{e.type}</Table.Cell>
                        <Table.Cell>{e.company}</Table.Cell>
                        <Table.Cell>{makeRatingString(e.rating)}</Table.Cell>
                        <Table.Cell>
                          <Button
                            onClick={() => {
                              setTourIndex(i);
                              setAssignModalOpen(true);
                            }}
                          >
                            Make Reservation
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    </>
                  );
                })}
              </Table.Body>
            </Table>
            <GuideSelectionModal
              state={assignModalOpen}
              setState={setAssignModalOpen}
              tour={tourArr[tourIndex]}
            />
          </>
        )}
      </div>
    </>
  );
};

export default AssignGuides;
