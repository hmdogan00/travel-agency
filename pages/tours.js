import { stubString } from "lodash";
import { useEffect, useState } from "react";
import { Button, Card, CardDescription, Header, Icon } from "semantic-ui-react";
import Navbar from "./Navbar";
import { getDateTime } from "./util";

function Tours() {
  const [role, setRole] = useState("");
  const [tourArr, setTourArr] = useState([
    { name: "Anitkabir", location: "Ankara", desc: "dashgfjasdbfguhabf fb jhbfjdhasfb fbsdabf jdfbsdja bhjfbasd jbfhjb fhjds bfhjsd fbsdjbfjasfb hjasdbfhj bfj a" },
    { name: "Kapadokya", location: "Nigde", desc: "gujiasfnk dhs asdjf" },
    { name: "Alt Orman", location: "Sihirdar Vadisi", desc: " gafdfhadbnf hj bdj bfjh abfsd" }
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
                  <TourCard tour={e} key={`tourCard-${i}`} />
                );
              })}
          </Card.Group>
        </div>
      )}
    </>
  );
}

function TourCard({ tour }) {
  const [readMore, setReadMore] = useState(false);
  return (
    <Card
      color="red"
    //description={`Start Date: ${startDate} Start Time: ${startTime} End Date: ${endDate} End Time: ${endTime}`}
    >
      <Card.Content>
        <Card.Header>
          {tour.name}
          <Button positive compact circular size="tiny" floated="right">Reserve</Button>
        </Card.Header>
        <Card.Meta>{tour.location}</Card.Meta>
        <Card.Description>
          {readMore ? tour.desc : `${tour.desc.substring(0, 50)}` + "..."}
        </Card.Description>
        <Card.Description>
          <Button size="mini" compact circular onClick={() => setReadMore(!readMore)}>
            {readMore ? "Show Less" : "Show More"}
            &nbsp;&nbsp;
            {readMore ? <Icon name='minus circle' /> : <Icon name='plus circle' />}
          </Button>
        </Card.Description>
      </Card.Content>
    </Card>
  );
}

export default Tours;
