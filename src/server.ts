import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const mongoUrl = process.env.DATABASE_URL
if (!mongoUrl) {
  console.log("DATABASE_URL is not set");
  process.exit(1);
}
mongoose.connect(mongoUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("MongoDB connected!");
});

const articleSchema = new mongoose.Schema({
  _id: String,
  name: String,
  description: { type: String, unique: true },
  tags: [String],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, { collection: "articles" });

const Article = mongoose.model("Article", articleSchema);

const app: Express = express();

app.use(express.json());
app.use(cors());

type requestArticleObject = {
  name: string;
  description: string;
  tags: string[];
}

app.post("/articles", async (req: Request<{}, {}, requestArticleObject>, res: Response) => {
  let { name, description, tags } = req.body;
  const id = uuidv4();

  // check if there are more than 100 articles
  const articlesCount = await Article.countDocuments();
  if (articlesCount >= 100) {
    res.status(400).json({ error: "You can't have more than 100 articles" });
    return;
  }

  // parse tags depending on the type
  if (typeof tags === "string") {
    tags = JSON.parse(tags);
  }

  if (!Array.isArray(tags) || !tags.every((t) => typeof t === "string")) {
    res.status(400).json({ error: "Tags must be an array of strings" });
    return;
  }

  try {
    const article = new Article({
      _id: id,
      name: name,
      description: description,
      tags: tags,
    });
    await article.save();
    res.status(200).json(article);
  }
  catch (err: any) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

app.get("/articles", async (req: Request, res: Response) => {
  const articles = await Article.find({}, {
    id: "$_id",
    _id: 0,
    name: 1,
    description: 1,
    tags: 1,
    created_at: 1,
    updated_at: 1,
  })

  res.status(200).json(articles);
})

app.put("/articles/:id", async (req: Request<{ id: string }, {}, requestArticleObject>, res: Response) => {
  const { id } = req.params;
  console.log(id)
  console.log("id")
  console.log(id)
  let { name, description, tags } = req.body;

  // check if exists
  const article = await Article.findById(id);
  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  if (typeof tags === "string") {
    tags = JSON.parse(tags);
  }

  if (!Array.isArray(tags) || !tags.every((t) => typeof t === "string")) {
    res.status(400).json({ error: "Tags must be an array of strings" });
    return;
  }

  try {
    article.name = name;
    article.description = description;
    article.tags = tags;
    article.updated_at = new Date();
    await article.save();
    res.status(200).json(article);
  }
  catch (err: any) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

app.delete("/articles/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  // check if exists
  const article = await Article.findById(id);
  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  try {
    await article.remove();
    res.status(200).json(article);
  }
  catch (err: any) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

app.listen(process.env.SERVER_PORT, () => {
  console.log("Server is running on port 3001");
});
