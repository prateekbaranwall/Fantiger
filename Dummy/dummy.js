import * as fs from "fs";

let dummyUser = [];

for(let i=0;i<1000;i++) {
    let mobile = Math.floor(Math.random() * 9000000000) + 1000000000;
    let user = {
        name: 'a'+(i),
        phone: mobile
    };
    dummyUser.push(user);
}

const userJSON = JSON.stringify(dummyUser);

fs.writeFile("dummyUser.json",userJSON,(error)=>{
    if(error) {
        console.error(error);
        throw error;
    }
})
console.log(userJSON);