import express from 'express';
import cors from "cors";
import mongoose from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import 'dotenv/config'
import * as fs from "fs";
import { resolve } from 'path';

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const ID = `mongodb+srv://prateek_bd:prateek1234@cluster0.onsao.mongodb.net/fantiger`;
const connectToMongo = async () => {
    try {
      mongoose.set("strictQuery", false);
    //   mongoose.set("useNewUrlParser", true);
    //   mongoose.set("useUnifiedTopology", true);
      mongoose.connect(ID);
      console.log("Connected to Mongo Successfully!");
    } catch (error) {
      console.log("error: ",error);
    }
  };

  connectToMongo();

  const blogSchema = new mongoose.Schema({
    heading: String,
    text: String
})
blogSchema.plugin(autoIncrement,'blog');

var Blog = new mongoose.model("blog", blogSchema);

(async function() {
    try {
      const data = await fs.promises.readFile('Blogs.json');
      const blogs = JSON.parse(data);
      for (const element of blogs) {
        const blog = new Blog({
          heading: element.heading,
          text: element.text
        });
        await blog.save();
        // console.log(element);
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
        mongoose.connection.close();
        console.log("Connection to MongoDB closed.");
    }
  })();


//   (async function() {
//     try {
//         const data = await fs.promises.readFile('Blogs.json');
//         const blogs = JSON.parse(data);
//       blogs.forEach(element => {
//         console.log(element);
//       });
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   })();

 