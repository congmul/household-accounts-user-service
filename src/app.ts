import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

// Start the server on the port
app.listen(3000, () => console.log(`Listening on PORT: 3000`));
