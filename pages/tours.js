import { useEffect, useState } from "react";
import { Card, Header } from "semantic-ui-react";
import Navbar from "./Navbar";
import { getDateTime } from "./util";

function Tours() {
  const [role, setRole] = useState("");
  const [tourArr, setTourArr] = useState([
    { name: "Anitkabir", location: "Ankara" },
    { name: "Kapadokya", location: "Nigde" },
    { name: "Alt Orman", location: "Sihirdar Vadisi" }
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role"));
    }
  }, []);

  return (
    <>
      <Navbar activeType="tours" />
      {role === "Customer" && (
        <div style={{ margin: "30px" }}>
          <Card.Group itemsPerRow={4}>
            {tourArr?.length === 0 && (
              <Header>There are no tours for reservation.</Header>
            )}
            {tourArr &&
              tourArr.map((e, i) => {
                //const [startDate, startTime] = getDateTime(e.start_date);
                //const [endDate, endTime] = getDateTime(e.end_date);
                return (
                  <Card
                    key={`card-${i}`}
                    color="red"
                    header={e.name}
                    meta={e.location}
                    //description={`Start Date: ${startDate} Start Time: ${startTime} End Date: ${endDate} End Time: ${endTime}`}
                    description="Dasdsadad"
                  />
                );
              })}
          </Card.Group>
        </div>
      )}
    </>
  );
}

export default Tours;
