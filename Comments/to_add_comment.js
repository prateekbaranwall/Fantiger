import express from 'express';
import cors from "cors";
import mongoose from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import 'dotenv/config'
import * as fs from "fs";

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const ID = `mongodb+srv://prateek_bd:prateek1234@cluster0.onsao.mongodb.net/fantiger`;
const connectToMongo = async () => {
    try {
      mongoose.set("strictQuery", false);
      mongoose.connect(ID);
      console.log("Connected to Mongo Successfully!");
    } catch (error) {
      console.log("error: ",error);
    }
  };

connectToMongo();


{
    const userSchema = new mongoose.Schema({
        name: String,
        phone: String,
        comment: [String]
    })
    userSchema.plugin(autoIncrement,'user');
    
    var User = new mongoose.model("User", userSchema);
}

{
    const blogSchema = new mongoose.Schema({
        heading: String,
        text: String,
        user_comments: [String]
    })
    blogSchema.plugin(autoIncrement,'blog');
    
    var Blog = new mongoose.model("blog", blogSchema);
}

(async function() {
    try {
      let users = await User.find();
      let blogs = await Blog.find();

      for (const element of users) {
        let comments_on_blog = [];  
        const min = 2;
        const max = 11;
        const number_of_comments = Math. floor(Math. random() * (max-min) + min);
        for(let i = 0; i < number_of_comments; i++) {
            const random_blog = Math.floor(Math.random() * blogs.length);
            let blog = blogs[random_blog];
            blog.user_comments.push(element._id);
            await Blog.updateOne({_id: blog._id}, blog);
            comments_on_blog.push(blog._id);
        }
        let user = element;
        user.comment = comments_on_blog;
        await User.updateOne({_id:user._id}, user);
        
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
        mongoose.connection.close();
        console.log("Connection to MongoDB closed.");
    }
  })();

