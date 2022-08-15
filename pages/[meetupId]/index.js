import Head from "next/head";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { ObjectId, MongoClient } from "mongodb";

const MeetupDetails = (props) => {
  return (
    <>
      <Head>
        <title>Meetup Details</title>
        <meta name={props.meetup.title} content={props.meetup.description} />
      </Head>
      <MeetupDetail {...props.meetup} />
    </>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://feudal:feudal@cluster0.7to4nb8.mongodb.net/meetups"
  );

  const db = client.db();
  const meetups = db.collection("meetups");
  const meetupsList = await meetups.find({}, { _id: 1 }).toArray();
  client.close();

  return {
    paths: meetupsList.map((meetup) => ({
      params: {
        meetupId: meetup._id.toString(),
      },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;
  const client = await MongoClient.connect(
    "mongodb+srv://feudal:feudal@cluster0.7to4nb8.mongodb.net/meetups"
  );

  const db = client.db();
  const meetupsCollection = db.collection("meetups");
  let selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetup: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
      },
    },
    revalidate: 10,
  };
}

export default MeetupDetails;
