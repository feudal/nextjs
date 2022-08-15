import { MongoClient } from "mongodb";

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;

    const client = await MongoClient.connect(
      "mongodb+srv://feudal:feudal@cluster0.7to4nb8.mongodb.net/meetups"
    );

    const db = client.db();
    const meetups = db.collection("meetups");
    const result = await meetups.insertOne(data);

    client.close();
    res.status(201).json({ message: "Meetup created" });
  }
}

export default handler;
