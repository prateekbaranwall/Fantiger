import * as fs from "fs";

let blogs = [];

for(let i=0;i<100;i++) {
    let blog = {
        heading: 'heading'+(i),
        text: 'text'+(i)
    };
    blogs.push(blog);
}

const Blog = JSON.stringify(blogs);

fs.writeFile("Blogs.json",Blog,(error)=>{
    if(error) {
        console.error(error);
        throw error;
    }
})
console.log(Blog);