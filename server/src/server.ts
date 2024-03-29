import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import "./env";
import { startWorkers } from "./workers";

process.on("uncaughtException", (error) => {
  console.log(error);
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  console.log(error);
  process.exit(1);
});

const port = process.env.PORT || 8080;
app.listen(Number(port), async () => {
  console.log(`Listening for requests on port ${port} ...`);
  await startWorkers();
});
