import express from 'express';
import cors from "cors";
import mongoose from 'mongoose';
import { autoIncrement } from 'mongoose-plugin-autoinc';
import 'dotenv/config'


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


connectToMongo();

class Queue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }
  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }
  peek() {
    return this.elements[this.head];
  }
  get length() {
    return this.tail - this.head;
  }
  isEmpty() {
    return this.length === 0;
  } 
}

app.get("/users", async (req,res) => {
  let users = await User.find();
  res.send(users); 
})
 
app.get("/friends", async (req,res) => {
  // console.log(req.query); 
  const {id, level} = req.query;
  let userData = await User.find();
  let visited = {};
  let q = new Queue();
  visited[id] = true;
  q.enqueue(id);
  let result = [];
  let lvl = 0;
  while(!q.isEmpty() && lvl < level) {
    let len = q.length;
    lvl++;
    for(let i = 0; i < len; i++) {
      let tp = q.dequeue();
      let user =  userData.find(obj => obj._id == tp);
      // console.log((user));
      for(let UserFrnd of user.friends) {
        if(!visited[UserFrnd]) {
          visited[UserFrnd] = true;
          q.enqueue(UserFrnd);
          if(lvl==level) result.push(UserFrnd);
        }
      }
    }
    if(lvl==level) break;
  }
  res.send(result);
}) 

app.listen(9000,()=>{
    console.log("started at port 9000");
}) 