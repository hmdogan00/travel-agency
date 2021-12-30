import { getDateTime, makeRatingString } from "../../util.js"
import { useState } from "react";
import { Card, Button, Grid } from "semantic-ui-react";
import ReservationModal from "./ReservationModal.js";

const TourCard = ({ hotel }) => {
  hotel.desc = [`Total Rooms: ${hotel.no_of_total_room}`];
  hotel.desc.push(
    hotel.rating ? `Rating: ${makeRatingString(hotel.rating)}` : `No rating`
  );
  hotel.desc.push(`Phone: ${hotel.phone_no}`);
  const [readMore, setReadMore] = useState(false);
  const [resModalOpen, setResModalOpen] = useState(false);
  return (
    <Card color="red">
      <Card.Content>
        <Card.Header>
          {hotel.name}
          <Button
            content="Reserve"
            positive
            compact
            circular
            size="tiny"
            floated="right"
            onClick={() => setResModalOpen(true)}
          />
        </Card.Header>
        <Card.Meta>{hotel.location}</Card.Meta>
        <Card.Description>
          <Grid>
            {readMore ? (
              hotel.desc.map((e, i) => {
                return <Grid.Column width={16}>{e}</Grid.Column>;
              })
            ) : (
              <Grid.Column width={15}>{`${hotel.desc[0]}`}</Grid.Column>
            )}
            <Grid.Column width={15}>
              <Button
                content={readMore ? "Show Less" : "Show More"}
                icon={readMore ? "minus circle" : "plus circle"}
                onClick={() => setReadMore(!readMore)}
                compact
                circular
                size="mini"
                labelPosition="right"
              />
              <ReservationModal
                state={resModalOpen}
                setState={setResModalOpen}
                hotel={hotel}
              />
            </Grid.Column>
          </Grid>
        </Card.Description>
      </Card.Content>
    </Card>
  );
}

export default TourCard;