import { getDateTime, makeRatingString } from "../../util.js"
import { useState } from "react";
import { Card, Button, Grid } from "semantic-ui-react";
import ReservationModal from "./ReservationModal.js";

const TourCard = ({ tour }) => {
  const [startDate, startTime] = getDateTime(tour.start_date);
  const [endDate, endTime] = getDateTime(tour.end_date);
  tour.desc = [`${startDate}(${startTime}) : ${endDate}(${endTime})`];
  tour.desc.push(`Company: ${tour.company}`);
  tour.desc.push(`Price: ${tour.price}`);
  tour.desc.push(
    tour.rating ? `Rating: ${makeRatingString(tour.rating)}` : `No rating`
  );
  tour.desc.push(`Type: ${tour.type}`);
  const [readMore, setReadMore] = useState(false);
  const [resModalOpen, setResModalOpen] = useState(false);
  return (
    <Card color="red">
      <Card.Content>
        <Card.Header>
          {tour.name}
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
        <Card.Meta>{tour.location}</Card.Meta>
        <Card.Description>
          <Grid>
            {readMore ? (
              tour.desc.map((e, i) => {
                return <Grid.Column width={16}>{e}</Grid.Column>;
              })
            ) : (
              <Grid.Column width={15}>{`${tour.desc[0]}...`}</Grid.Column>
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
                tour={tour}
              />
            </Grid.Column>
          </Grid>
        </Card.Description>
      </Card.Content>
    </Card>
  );
}

export default TourCard;