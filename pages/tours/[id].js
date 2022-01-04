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
  const [role, setRole] = useState('')
  const [tour, setTour] = useState(null);
  const [guide, setGuide] = useState(null);

  const [tourComment, setTourComment] = useState("");
  const [guideComment, setGuideComment] = useState("");
  const [tourRating, setTourRating] = useState({ rating: 0, maxRating: 10 });
  const [guideRating, setGuideRating] = useState({ rating: 0, maxRating: 10 });
  const [isReviewed, setIsReviewed] = useState(false);
  const [reviews, setReviews] = useState(null);

  const handleTourRate = (e, { rating, maxRating }) =>
    setTourRating({ rating, maxRating });
  const handleGuideRate = (e, { rating, maxRating }) =>
    setGuideRating({ rating, maxRating });

  useEffect(() => {
    if (window.location !== undefined) setRole(localStorage.getItem('role'))
    if (!tour && id) {
      axios
        .get(`/api/getDetailedTour?id=${id}`)
        .then(res => {
          setTour(res.data.results.tour);
          setGuide(res.data.results.guide);
          const body = {
            tour_id: res.data.results.tour.tour_id,
            G_person_id: res.data.results.guide.guide_id,
            C_person_id: parseInt(localStorage.getItem("id")),
          };
          axios
            .post(`/api/reviews/getReview`, body)
            .then(res => {
              setIsReviewed(res.data.isReviewed);
              if (res.data.isReviewed) {
                setReviews(res.data.review[0]);
                setGuideRating({
                  ...guideRating,
                  rating: res.data.review[0].guide_rate * 10,
                });
                setTourRating({
                  ...tourRating,
                  rating: role === 'Customer' ? (res.data.review[0].tour_rate * 10).toFixed(2) : (res.data.review[0].rating * 10).toFixed(2),
                });
              }
            });
        });
    }
  }, [tour, id, guide]);

  const goBack = () => {
    window.location.href = role === 'Customer' ? '/dashboard' : '/tours';
  }

  const makeReview = () => {
    if (confirm('You are submiting your review. Are you sure?')) {
      const body = {
        tourId: id,
        guideId: guide.guide_id,
        customerId: localStorage.getItem("id"),
        tourComment: tourComment,
        tourRate: tourRating.rating / tourRating.maxRating,
        guideComment: guideComment,
        guideRate: guideRating.rating / guideRating.maxRating,
        tourOldRate: tour.rating,
        tourRateCnt: tour.ratingCount,
        guideOldRate: guide.rating,
        guideRateCnt: guide.ratingCount,
      };
      const guideBody = {
        tourId: id,
        guideId: localStorage.getItem('id'),
        tourOldRate: tour.rating,
        tourRateCnt: tour.ratingCount,
        tourComment: tourComment,
        tourRate: tourRating.rating / tourRating.maxRating,
      }
      axios
        .post(role === 'Customer' ? `/api/makeReview` : `/api/guide/giveFeedback`, role === 'Customer' ? body : guideBody)
        .then(() => {
          alert('Review made successfully!');
          window.location.href = role === 'Customer' ? '/dashboard' : '/tours'
        })
        .catch(e => alert(e.message));
    }
  };

  return (
    <>
      <Navbar activeType="dashboard" />
      <Button
        style={{ marginLeft: "20px" }}
        negative
        content="Back"
        icon="left arrow"
        circular
        onClick={goBack}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
        }}
      >
        <div
          style={{
            margin: "3% 15% 3%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {tour && guide ? (
            <>
              <div style={{ width: "100%", marginRight: "110px" }}>
                <Header as={"h2"} dividing textAlign="center">
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
              {role !== 'Guide' && <div style={{ width: "100%", marginLeft: "110px" }}>
                <Header as={"h2"} dividing textAlign="center">
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
              </div>}
            </>
          ) : (
            <Dimmer active>
              <Loader size="massive" />
            </Dimmer>
          )}
        </div>
        <Header as={"h2"} dividing textAlign="center">
          {isReviewed ? "Your review" : "Review"}
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
              {isReviewed ? (
                <textarea
                  readOnly
                  rows={4}
                  value={isReviewed && reviews ? (role === 'Customer' ? reviews.tour_comment : reviews.comment) : ""}
                ></textarea>
              ) : (
                <TextArea
                  rows={4}
                  value={tourComment}
                  onChange={e => setTourComment(e.target.value)}
                ></TextArea>
              )}
            </Form>
            <br />
            <label>How would you rate the tour?</label>
            <br />
            <br />
            <Rating
              disabled={isReviewed}
              size="massive"
              rating={tourRating.rating}
              maxRating={10}
              onRate={handleTourRate}
            />
            <p
              style={{ fontSize: "18px", margin: "5px 50% 0 40%" }}
            >{`${tourRating.rating}/${tourRating.maxRating}`}</p>
          </div>
          {role !== 'Guide' && <div style={{ width: "100%", marginLeft: "110px" }}>
            <Form>
              <label>What is your comment about the guide?</label>
              {isReviewed ? (
                <textarea
                  readOnly
                  rows={4}
                  value={isReviewed && reviews ? reviews.guide_comment : ""}
                ></textarea>
              ) : (
                <TextArea
                  rows={4}
                  value={guideComment}
                  onChange={e => setGuideComment(e.target.value)}
                ></TextArea>
              )}
            </Form>
            <br />
            <label>How would you rate the guide?</label>
            <br />
            <br />
            <Rating
              disabled={isReviewed}
              size="massive"
              rating={guideRating.rating}
              maxRating={10}
              onRate={handleGuideRate}
            />
            <p
              style={{ fontSize: "18px", margin: "5px 50% 0 40%" }}
            >{`${guideRating.rating}/${guideRating.maxRating}`}</p>
          </div>}
        </div>
        {!isReviewed && (
          <Button
            className="tour-review-finish-btn"
            color="green"
            onClick={makeReview}
          >
            Finish Review
          </Button>
        )}
      </div>
    </>
  );
};

export default ReviewPage;
