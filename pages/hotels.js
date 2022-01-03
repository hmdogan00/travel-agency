import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Form, Header, Label, Rating, Table } from "semantic-ui-react";
import Navbar from "./Navbar";
import HotelCard from "../Components/Hotels/HotelCard.js";
import AddNewHotelModal from "../Components/Hotels/AddNewHotelModal";
import { includesNoCase } from "../util";

function Hotel() {
  const [role, setRole] = useState("");
  const [hotelArr, setHotelArr] = useState([]);
  const [openAddNewHotel, setOpenAddNewHotel] = useState(false);
  const [searchN, setSearchN] = useState("");
  const [searchLoc, setSearchLoc] = useState("");
  const [searchType, setSearchType] = useState("");
  const [ratingFilter, setRatingFilter] = useState({
    rating: 0,
    maxRating: 10,
  });
  const [loading, setLoading] = useState(false);

  const handleRateChange = (e, { rating, maxRating }) =>
    setRatingFilter({ rating, maxRating });

  const searchData = useMemo(() => {
    return hotelArr?.filter(item => {
      return includesNoCase(item.name, searchN) && includesNoCase(item.location, searchLoc) && ratingFilter.rating <= item.rating * 10 && includesNoCase(item.name, searchN);
    });
  }, [hotelArr, searchN, ratingFilter, searchLoc, searchType]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");
      setRole(role);
      if (hotelArr.length === 0) {
        axios
          .get("/api/hotel/getHotels")
          .then(res => { setHotelArr([...res.data.results]); console.log([...res.data.results]) });
      }
    }
  }, []);

  return (
    <>
      <Navbar activeType="hotels" />
      <div style={{ display: "flex", flexDirection: "row", margin: "30px" }}>
        <Form.Input
          loading={loading}
          onChange={e => {
            setSearchN(e.target.value);
          }}
          value={searchN}
          placeholder="Search by Hotel Name"
          className="mr-4"
          icon="search"
        />
        <Form.Input
          loading={loading}
          onChange={e => {
            setSearchLoc(e.target.value);
          }}
          value={searchLoc}
          placeholder="Search by Location"
          className="mr-4"
          icon="search"
        />
        <label style={{ marginTop: '8px', fontWeight: 'bold' }}>Minimum rating:</label>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '3px', marginLeft: '5px' }}>
          <Rating
            rating={ratingFilter.rating}
            maxRating={10}
            onRate={handleRateChange}
          />
          <Label style={{ alignSelf: 'center', marginTop: '3px' }}>{`${ratingFilter.rating}/10`}</Label>
        </div>
      </div>
      {role === "Customer" && (
        <div style={{ margin: "30px" }}>
          <Card.Group itemsPerRow={4}>
            {searchData?.length === 0 && (
              <Header>There are no hotels with given filters.</Header>
            )}
            {searchData &&
              searchData.map((e, i) => {
                return <HotelCard hotel={e} key={`hotelCard-${i}`} />;
              })}
          </Card.Group>
        </div>
      )}
      {role === "Employee" && (
        <div style={{ margin: "30px" }}>
          {searchData?.length === 0 && (
            <Header>There are no tours for reservation.</Header>
          )}
          {searchData && (
            <>
              <Header floated="left">Active Hotels</Header>
              <Header floated="right">
                <Button
                  content="Add New Hotel"
                  color="blue"
                  onClick={() => setOpenAddNewHotel(true)}
                />
              </Header>
              <AddNewHotelModal state={openAddNewHotel} setState={setOpenAddNewHotel} />
              <Table celled color="red">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Location</Table.HeaderCell>
                    <Table.HeaderCell>Number Of Empty Rooms</Table.HeaderCell>
                    <Table.HeaderCell>Number Of Total Rooms</Table.HeaderCell>
                    <Table.HeaderCell>Hotel Phone</Table.HeaderCell>
                    <Table.HeaderCell>Rating</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {searchData.map((e, i) => {
                    return (
                      <Table.Row key={`hotelRow-${i}`}>
                        <Table.Cell>{i + 1}</Table.Cell>
                        <Table.Cell>{e.name}</Table.Cell>
                        <Table.Cell>{e.location}</Table.Cell>
                        <Table.Cell>{e.no_of_empty_room}</Table.Cell>
                        <Table.Cell>{e.no_of_total_room}</Table.Cell>
                        <Table.Cell>{e.phone_no}</Table.Cell>
                        <Table.Cell>{e.rating}</Table.Cell>
                        <Table.Cell>
                          <Button
                            content="Show Reservations"
                            color="blue"
                            size="tiny"
                            onClick={() => window.location.href = `/hotels/${e.hotel_id}`}
                          />
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Hotel;
