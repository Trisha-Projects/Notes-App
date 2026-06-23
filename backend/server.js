import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import jwt from "jsonwebtoken";
import winston from "winston";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
//import dotenv from "dotenv";
import 'dotenv/config' ;
import Joi from "joi";


const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),

  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/app.log",
    }),
  ],
});

const app = express();
const SECRET_KEY = process.env.SECRET_KEY;
console.log("SECRET KEY",SECRET_KEY);
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {

  logger.info(
    `${req.method} ${req.url}`
  );

  next();
});

const db = new sqlite3.Database("./notes.db");


db.run(`
CREATE TABLE IF NOT EXISTS notes(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content TEXT,
  user_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id)
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
 email TEXT UNIQUE,
  password TEXT
)
`);

const notesSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string(),

});
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({
      message: "Token Missing",
    });

  jwt.verify(token,SECRET_KEY,(err, user) => {
      if (err)
        return res.status(403).json({
          message: "Invalid Token",
          
        
        });

      req.user = user;
      next();
    }
  );
}

app.post("/login", (req, res) => {

  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username=?",
    [username],

    (err, user) => {

      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      if (!user) {
        return res.status(401).json({
          message: "Invalid Credentials",
        });
      }

      const match = bcrypt.compareSync(
        password,
        user.password
      ); // true or false

      if (!match) {
        return res.status(401).json({
          message: "Invalid Credentials",
        });
      }

const token = jwt.sign(
  {
    id: user.id,
          username: user.username 
        },
  SECRET_KEY
);
      res.json({
        token,
      });4

    }
  );

});

// app.post("/send-mail", async (req, res) => {

//   const { username, email } = req.body;

//   try {

//     await transporter.sendMail({
//       from: "jaintrisha146@gmail.com",
//       to: email,
//       subject: "Welcome to KeepNote 📝",
//       text: `Hello ${username},

// Your account has been created successfully.

// Welcome to KeepNote! 🎉`
//     });

//     res.json({
//       message: "Mail Sent Successfully"
//     });

//   } catch (err) {

//     console.log(err);

//     res.status(500).json({
//       message: "Mail Sending Failed"
//     });

//   }

// });

// app.post("/send-mail", async (req, res) => {

//   const { username, email } = req.body;

//   try {
//     

//     res.json({
//       message: "Mail Sent Successfully"
//     });

//   }

//   catch (err) {

//     console.log(err);

//     res.status(500).json({
//       message: "Mail Sending Failed"
//     });

//   }

// });

app.post("/register", async (req, res) => {

  const { username, email, password } = req.body;

  try {

    const hashedPassword =
      await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users(username,email,password) VALUES (?,?,?)",
      [username, email, hashedPassword],

      function (err) {

        if (err) {
          console.log(err);

          return res.status(500).json({
            message: err.message,
          });
        }

        console.log("abcd");
          transporter.sendMail({

      from: "jaintrisha146@gmail.com",
      to: [email],
      subject: "Welcome to KeepNote 📝",
      text: `Hello ${username},
            Your account has been created successfully.
            Welcome to KeepNote! 📝`
    });

            res.json({
          message: "Registration Successful",
        });
        
      },
      
       


    );

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

});

app.get( "/api/notes", authenticateToken, (req, res) => {
     db.all(
  "SELECT * FROM notes WHERE user_id=?",
  [req.user.id],

      (err, rows) => {
        res.json(rows);
      }
    );
  }
);

app.post("/api/notes", authenticateToken, (req, res) => {

  const { error } = notesSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

  const { title, content } = req.body;
console.log("userid",req.user.id );
  db.run(
    "INSERT INTO notes(title,content,user_id) VALUES (?,?,?)",
    [title, content, req.user.id],


    function (err) {

      if (err) {
        console.log(err);

        return res.status(500).json({
          message: err.message
        });
      }

      res.json({
        id: this.lastID,
        title,
        content
      });

    }

  );

});

app.put("/api/notes/:id", authenticateToken, (req, res) => {

  const { id } = req.params;
  const { title, content } = req.body;

  db.run(
    "UPDATE notes SET title=?, content=? WHERE id=? AND user_id=?",
    [title, content, id, req.user.id],

    function(err) {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }
      res.json({
        id,
        title,
        content
      });

    }
  );

});

app.delete("/api/notes/:id", authenticateToken, (req, res) => {

  const { id } = req.params;

  db.run(
    "DELETE FROM notes WHERE id=? AND user_id=?",
    [id, req.user.id],

    function(err) {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.json({
        message: "Deleted"
      });

    }
  );

});

app.get("/route", (req, res) => {
  const { name, age } = req.query;
  res.json({ name, age });
});

app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  res.json({ id });
});

app.listen(3001, () => {
  console.log(
    "Server running on port 3001"
  );
});