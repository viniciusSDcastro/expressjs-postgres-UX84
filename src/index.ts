require("dotenv").config();
import bodyParser from "body-parser";
const cors = require("cors")
import express from "express";
const Pool = require("pg").Pool;

// Connect to the database using the DATABASE_URL environment
//   variable injected by Railway

const proConfig = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString:proConfig 
});


const app = express();
const port = process.env.PORT || 3333;

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT NOW()");
  res.send(`Hello, World! The time from the DB is ${rows[0].now}`);
});

app.get("/filme",async (req, res) => {
    try {
      const allTodos = await pool.query("SELECT * FROM filme ORDER BY id ASC");
      res.json(allTodos.rows)
      //res.send(`LOL`);
    } catch (error) {
      console.log(error)
    }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
