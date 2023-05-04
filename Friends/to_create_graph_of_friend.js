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
        comment: [String],
        friends: [String]
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
        let blogs = await Blog.find();
        let users = await User.find();
        let friend_of_users = new Map();

        for(const user of users) {
            friend_of_users.set(user._id,new Set());
            // const x = friend_of_users.get(user._id);
            // console.log(user._id);
        }
        // console.log(blogs);

        for(const blog of blogs) {
            const userComments = blog.user_comments;
            // console.log(userComments.length);
            for(let firstUserComment = 0; firstUserComment< userComments.length; firstUserComment++)
            {
                for(let secondUserComment = 0; secondUserComment< userComments.length; secondUserComment++ ) {
                    // console.log((userComments[firstUserComment]), (userComments[secondUserComment]));
                    // console.log(friend_of_users.get(userComments[firstUserComment]));
                    // console.log(typeof(+userComments[firstUserComment]));
                    friend_of_users.get(+userComments[firstUserComment]).add(userComments[secondUserComment]);
                }
            }
        }

        for(const user of users) {
            const x = friend_of_users.get(user._id).values();
            let cloneUser = user;
            
            let total_friend = [];
            for(const element of x) {
                total_friend.push(element);
            }
            cloneUser.friends = total_friend;
            await User.updateOne({_id:user._id}, cloneUser);
            // console.log(user._id);
        }

    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        mongoose.connection.close();
        console.log("Connection to MongoDB closed.");
    }
})();