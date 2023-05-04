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

const connectToMongo = async () => {
    try {
      mongoose.set("strictQuery", false);
      mongoose.connect(process.env.ID);
      console.log("Connected to Mongo Successfully!");
    } catch (error) {
      console.log("error: ",error);
    }
  };

  connectToMongo();

  const userSchema = new mongoose.Schema({
    name: String,
    phone: String
})
userSchema.plugin(autoIncrement,'user');

var User = new mongoose.model("User", userSchema);

(async function() {
    try {
      const data = await fs.promises.readFile('dummyUser.json');
      const users = JSON.parse(data);
      for (const element of users) {
        const user = new User({
          name: element.name,
          phone: element.phone
        });
        await user.save();
        // console.log(user);
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
        mongoose.connection.close();
        console.log("Connection to MongoDB closed.");
    }
  })();

 