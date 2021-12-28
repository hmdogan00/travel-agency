import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Form,
  Header,
  Rating,
  Dimmer,
  Loader,
  List,
  TextArea,
  Button,
} from "semantic-ui-react";
import { makeRatingString } from "../../util";
import Navbar from "../Navbar";

const ReviewPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [tour, setTour] = useState(null);
  const [guide, setGuide] = useState(null);

  const [tourComment, setTourComment] = useState("");
  const [guideComment, setGuideComment] = useState("");
  const [tourRating, setTourRating] = useState({ rating: 0, maxRating: 10 });
  const [guideRating, setGuideRating] = useState({ rating: 0, maxRating: 10 });

  const handleTourRate = (e, { rating, maxRating }) =>
    setTourRating({ rating, maxRating });
  const handleGuideRate = (e, { rating, maxRating }) =>
    setGuideRating({ rating, maxRating });

  useEffect(() => {
    if (!tour && id) {
      axios.get(`/api/getDetailedTour?id=${id}`).then(res => {
        setTour(res.data.results.tour);
        setGuide(res.data.results.guide);
      });
    }
  }, [tour, id, guide]);

  const makeReview = () => {
    const body = {
      tourId: id,
      guideId: guide.guide_id,
      customerId: localStorage.getItem('id'),
      tourComment: tourComment,
      tourRate: tourRating.rating / tourRating.maxRating,
      guideComment: guideComment,
      guideRate: guideRating.rating / guideRating.maxRating,
      tourOldRate: tour.rating,
      tourRateCnt: tour.ratingCount,
      guideOldRate: guide.rating,
      guideRateCnt: guide.ratingCount
    }
    axios.post(`/api/makeReview`, body).then(console.log).catch(console.log)
  };

  return (
    <>
      <Navbar activeType="dashboard" />
      <div style={{
        display:"flex",
        flexDirection:"column",
        alignContent:"center"
      }}>
        <div
          style={{
            margin: "10% 15%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {tour && guide ? (
            <>
              <div style={{ width: "100%", marginRight: "110px" }}>
                <Header as={"h2"} textAlign="center">
                  Tour Details
                </Header>
                <List relaxed celled verticalAlign="center" divided size="big">
                  <List.Item>
                    <Header as="h4">Tour Name:</Header> {tour.name}
                  </List.Item>
                  <List.Item>
                    <Header as="h4">Company:</Header> {tour.company}
                  </List.Item>
                  <List.Item>
                    <Header as="h4">Type:</Header> {tour.type}
                  </List.Item>
                  <List.Item>
                    <Header as="h4">Location:</Header> {tour.location}
                  </List.Item>
                  <List.Item>
                    <Header as="h4">Price:</Header> {tour.price}
                  </List.Item>
                </List>
              </div>
              <div style={{ width: "100%", marginLeft: "110px" }}>
                <Header as={"h2"} textAlign="center">
                  Guide Details
                </Header>
                <List relaxed celled verticalAlign="center" divided size="big">
                  <List.Item>
                    <Header as="h4">Guide Name:</Header> {guide.name}
                  </List.Item>
                  <List.Item>
                    <Header as="h4">Location:</Header> {guide.location}
                  </List.Item>
                  <List.Item>
                    <Header as="h4">Gender:</Header> {guide.gender}
                  </List.Item>
                  <List.Item>
                    <Header as="h4">Email:</Header> {guide.email}
                  </List.Item>
                  <List.Item>
                    <Header as="h4">Rating:</Header>
                    {makeRatingString(guide.rating)}
                  </List.Item>
                </List>
              </div>
            </>
          ) : (
            <Dimmer active>
              <Loader size="massive" />
            </Dimmer>
          )}
        </div>
        <Header as={"h2"} textAlign="center">
          Review
        </Header>
        <div
          style={{
            margin: "5% 15%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "100%", marginRight: "110px" }}>
            <Form>
              <label>What is your comment about the tour?</label>
              <TextArea
                rows={4}
                value={tourComment}
                onChange={e => setTourComment(e.target.value)}
              ></TextArea>
            </Form>
            <br />
            <label>How would you rate the tour?</label>
            <br />
            <br />
            <Rating size="massive" maxRating={10} onRate={handleTourRate} />
            <p
              style={{ fontSize: "18px", margin: "5px 50% 0 40%" }}
            >{`${tourRating.rating}/${tourRating.maxRating}`}</p>
          </div>
          <div style={{ width: "100%", marginLeft: "110px" }}>
            <Form>
              <label>What is your comment about the guide?</label>
              <TextArea
                rows={4}
                value={guideComment}
                onChange={e => setGuideComment(e.target.value)}
              ></TextArea>
            </Form>
            <br />
            <label>How would you rate the guide?</label>
            <br />
            <br />
            <Rating size="massive" maxRating={10} onRate={handleGuideRate} />
            <p
              style={{ fontSize: "18px", margin: "5px 50% 0 40%" }}
            >{`${guideRating.rating}/${guideRating.maxRating}`}</p>
          </div>
        </div>
        <Button
          className="tour-review-finish-btn"
          color="green"
          onClick={makeReview}
        >
          Finish Review
        </Button>
      </div>
    </>
  );
};

export default ReviewPage;
