require("dotenv").config();
import bodyParser from "body-parser";
//mudei abaixo
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
//mudei abaixo
app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})


app.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT NOW()");
  res.send(`Hello, World! The time from the DB is ${rows[0].now}`);
});

app.get("/filmes",async (req, res) => {
    try {
      const allTodos = await pool.query("SELECT * FROM filmes ORDER BY id ASC");
      res.json(allTodos.rows)
      //res.send(`LOL`);
    } catch (error) {
      console.log(error)
    }
})

app.get("/ator",async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM ator ORDER BY id ASC");
    res.json(allTodos.rows)
    //res.send(`LOL`);
  } catch (error) {
    console.log(error)
  }
})

app.get("/atua",async (req, res) => {
  try {
    /*
    const allAtua = await pool.query(`SELECT filme.id as id_f, filme.nome as filme, ator.nome as ator, ator.id as id_a, atua.personagem, atua.id
         FROM atua
         JOIN filme ON (atua.filme = filme.id)
         JOIN ator ON (atua.ator = ator.id)`);
         */
        
        const allAtua = await pool.query("SELECT * FROM atua ORDER BY id ASC");
    res.json(allAtua.rows)
    //res.send(`LOL`);
  } catch (error) {
    console.log(error)
  }
})

app.post("/filmes", async(req,res) => {
  try {
      const{nome,class_indicativa,duracao} = req.body
      const newTodo = await pool.query('INSERT INTO filmes (nome,class_indicativa, duracao) VALUES ($1, $2, $3) RETURNING *',[nome,class_indicativa, duracao] );

      res.json(newTodo.rows[0])
  } catch (error) {
    console.log(error)
  }
})

app.post("/ator", async(req,res) => {
  try {
      const{nome,pais,idade} = req.body
      const newAtor = await pool.query('INSERT INTO ator (nome,pais, idade) VALUES ($1, $2, $3) RETURNING *',[nome,pais, idade] );

      res.json(newAtor.rows[0])
  } catch (error) {
     console.log(error)
    
  }
})

app.post("/atua", async(req,res) => {
  try {
      const{filme,ator,personagem} = req.body
      const newAtua= await pool.query('INSERT INTO atua (filme,ator,personagem) VALUES ($1, $2, $3) RETURNING *',[filme,ator,personagem] );

      res.json(newAtua.rows[0])
  } catch (error) {
    //console.log(error)
    res.status(500).send(error)
  }
})

app.put("/filmes/:id",async(req,res) => {
  try {
      const {id} = req.params;
      const {nome,class_indicativa,duracao} = req.body
      const updateFilme = await pool.query("UPDATE filmes SET nome = $1 where id = $2",[nome,id]);
      const updateFilme2 = await pool.query("UPDATE filmes SET class_indicativa = $1 where id = $2",[class_indicativa,id]);
      const updateFIlme3 = await pool.query("UPDATE filmes SET duracao = $1 where id = $2",[duracao,id]);
      res.json("Todo foi atualizado!")
  } catch (error) {
    console.log(error)
      
  }
})

app.put("/ator/:id",async(req,res) => {
  try {
      const {id} = req.params;
      const {nome,pais,idade} = req.body
      const updateTodo = await pool.query("UPDATE ator SET nome = $1 where id = $2",[nome,id]);
      const updateTodo2 = await pool.query("UPDATE ator SET pais = $1 where id = $2",[pais,id]);
      const updateFIlme3 = await pool.query("UPDATE ator SET idade = $1 where id = $2",[idade,id]);
      res.json("Todo foi atualizado!")
  } catch (error) {
    console.log(error)
      
  }
})

app.put("/atua/:id",async(req,res) => {
  try {
      const {id} = req.params;
      const {filme,ator, personagem} = req.body
      console.log(`filme = ${filme}/ ator = ${ator} / personagem = ${personagem}`)
      //console.log(id,nome,nascimento)
      const updateAtua = await pool.query("UPDATE atua SET filme = $1 where id = $2",[filme,id]);
      const updateAtor2 = await pool.query("UPDATE atua SET ator = $1 where id = $2",[ator,id]);
      const updateAtor3 = await pool.query("UPDATE atua SET personagem = $1 where id = $2",[personagem,id]);
      res.json("Todo foi atualizado!")
  } catch (error) {
      console.log(error)
  }
  
})

app.delete("/filmes/:id",async(req,res) => {
  try {
      const {id} = req.params;
      const deletFilme = await pool.query("DELETE FROM filmes WHERE id = $1",[id]);
      res.json("filme foi deletado!!")
  } catch (error) {
    res.status(500).send(error)
}
})

app.delete("/ator/:id",async(req,res) => {
  try {
      const {id} = req.params;
      const deletAtor = await pool.query("DELETE FROM ator WHERE id = $1",[id]);
      res.json("Ator foi deletado!!")
  } catch (error) {
    res.status(500).send(error)
}
})

app.delete("/atua/:id",async(req,res) => {
  try {
      const {id} = req.params;
      const deletFilme = await pool.query("DELETE FROM atua WHERE id = $1",[id]);
      res.json("Elenco foi deletado!!")
  } catch (error) {
    console.log(error)
}
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
