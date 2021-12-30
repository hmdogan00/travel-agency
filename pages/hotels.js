import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Card, Form, Header, Label, Rating } from "semantic-ui-react";
import Navbar from "./Navbar";
import HotelCard from "../Components/Hotels/HotelCard.js";
import { includesNoCase } from "../util";

function Hotel() {
  const [role, setRole] = useState("");
  const [hotelArr, setHotelArr] = useState([]);
  const [openAddNewTour, setOpenAddNewTour] = useState(false);
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
      setRole(localStorage.getItem("role"));
    }
    if (hotelArr.length === 0) {
      axios
        .get("/api/hotel/getHotels")
        .then(res => setHotelArr([...res.data.results]));
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
          placeholder="Search by Tour Name"
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
        <label style={{marginTop:'8px'}}>Minimum rating:</label>
        <div style={{display:'flex', flexDirection:'column'}}>
          <Rating
            rating={ratingFilter.rating}
            maxRating={10}
            onRate={handleRateChange}
          ></Rating>
          <label style={{alignSelf:'center'}}>{`${ratingFilter.rating}/10`}</label>
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
          {hotelArr?.length === 0 && (
            <Header>There are no tours for reservation.</Header>
          )}
          {hotelArr && (
            <>
              <Header floated="left">Active Tours</Header>
              <Header floated="right">
                <Button
                  content="Add New Tour"
                  color="blue"
                  onClick={() => setOpenAddNewTour(true)}
                />
              </Header>
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
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {hotelArr.map((e, i) => {
                    const [startDate, startTime] = getDateTime(e.start_date);
                    const [endDate, endTime] = getDateTime(e.end_date);
                    return (
                      <Table.Row>
                        <Table.Cell>{i}</Table.Cell>
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
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
              {/* <AddNewTourModal
                state={openAddNewTour}
                setState={setOpenAddNewTour}
              /> */}
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Hotel;
