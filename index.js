const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: [process.env.CLIENT_ORIGIN, "https://your-client.vercel.app"], credentials: true }));
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});


const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ message: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });
    req.decoded = decoded;
    next();
  });
};

async function run() {
  await client.connect();
  const db = client.db("docappoint");
  const doctorsCol = db.collection("doctors");
  const appointmentsCol = db.collection("appointments");
  const reviewsCol = db.collection("reviews");

  
  app.post("/jwt", (req, res) => {
    const user = req.body; // 
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.send({ token });
  });

  // ---------- DOCTORS ----------
  app.get("/doctors", async (req, res) => {
    const { search = "", sort = "" } = req.query;
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    let cursor = doctorsCol.find(query);
    if (sort === "fee-asc") cursor = cursor.sort({ fee: 1 });
    if (sort === "fee-desc") cursor = cursor.sort({ fee: -1 });
    if (sort === "rating-desc") cursor = cursor.sort({ rating: -1 });
    res.send(await cursor.toArray());
  });

  app.get("/doctors/top", async (req, res) => {
    const top = await doctorsCol.find().sort({ rating: -1 }).limit(3).toArray();
    res.send(top);
  });

  app.get("/doctors/:id", async (req, res) => {
    const doc = await doctorsCol.findOne({ _id: new ObjectId(req.params.id) });
    res.send(doc);
  });

  // ---------- APPOINTMENTS ----------
  app.post("/appointments", verifyJWT, async (req, res) => {
    const result = await appointmentsCol.insertOne({ ...req.body, createdAt: new Date() });
    res.send(result);
  });

  app.get("/appointments", verifyJWT, async (req, res) => {
    const { email } = req.query;
    if (email !== req.decoded.email) return res.status(403).send({ message: "Forbidden" });
    const mine = await appointmentsCol.find({ userEmail: email }).toArray();
    res.send(mine);
  });

  app.patch("/appointments/:id", verifyJWT, async (req, res) => {
    const { patientName, gender, phone, appointmentDate, appointmentTime } = req.body;
    const result = await appointmentsCol.updateOne(
      { _id: new ObjectId(req.params.id), userEmail: req.decoded.email },
      { $set: { patientName, gender, phone, appointmentDate, appointmentTime } }
    );
    res.send(result);
  });

  app.delete("/appointments/:id", verifyJWT, async (req, res) => {
    const result = await appointmentsCol.deleteOne({
      _id: new ObjectId(req.params.id),
      userEmail: req.decoded.email,
    });
    res.send(result);
  });

  // ---------- REVIEWS ----------
  app.get("/reviews/:doctorId", async (req, res) => {
    const list = await reviewsCol.find({ doctorId: req.params.doctorId }).sort({ createdAt: -1 }).toArray();
    res.send(list);
  });

  app.post("/reviews", verifyJWT, async (req, res) => {
    // Optional: only allow if the user has an appointment with this doctor
    const result = await reviewsCol.insertOne({ ...req.body, createdAt: new Date() });
    res.send(result);
  });

  app.get("/", (req, res) => res.send("DocAppoint server is running"));

  app.listen(port, () => console.log(`Server on ${port}`));
}
run().catch(console.dir);

