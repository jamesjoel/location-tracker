import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import requestIp from 'request-ip'
import srs from 'secure-random-string'
import path from 'path'
const DB_URL = "mongodb+srv://jamessteppingstone:wPlVhhEuxtSm1xHM@cluster0.pp2xrpj.mongodb.net/";

mongoose
.connect(DB_URL)
.then(()=>console.log("CONNCTED"))
.catch((err)=>console.log(err, "NOT CONNCTED"))

let Tracker = mongoose.model("tracker", mongoose.Schema({
    sender_lat : Number,
    sender_long : Number,
    receiver_lat : { type : Number, default : null },
    receiver_long : {type : Number, default : null },
    unique_str : String,
    ip_addr : String,
    name : String,

}, {timestamps : true}));


let app = express();
app.use(cors())
app.use(express.json());
app.use(requestIp.mw());
app.use(express.urlencoded({extended : true}));

const root = path.join(path.resolve()+"/dist")
app.use(express.static(root));


app.post("/api/v1/",async(req, res)=>{
    let randStr = srs({length : 100})
    let saveData = { 
            sender_lat : req.body.latitude, 
            sender_long : req.body.longitude, 
            ip_addr : req.clientIp, 
            name : req.body.name,
            unique_str : randStr 
        }
    let result =await Tracker.create(saveData);
    res.send({success:true, result});
})
app.get("/api/v1", async(req, res)=>{
    let result = await Tracker.find();
    res.send(result);
})


app.get("/api/v1/delete", async(req, res)=>{
    await Tracker.deleteMany();
    res.send({msg : "Deleted"});
})
app.get("/api/v1/getdatabyunique/:u", async(req, res)=>{
    let result = await Tracker.find({unique_str : req.params.u});
    res.send({result : result[0]});

})


app.get("/api/v1/:id", async(req, res)=>{
    let result = await Tracker.find({_id : req.params.id});
    res.send({result : result[0]});
})


app.put("/api/v1/:u", async(req, res)=>{
    console.log(req.body);
    let result1 =await Tracker.updateMany({unique_str : req.params.u}, {receiver_lat : req.body.latitude, receiver_long : req.body.longitude})
    let result2 = await Tracker.find({unique_str : req.params.u});
    res.send({success:true, result : result2[0]});
    // console.log(result)
})


app.get("/{*splat}", (req, res)=>{
    res.sendFile("index.html", {root});
    
})

let port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", ()=>console.log("Server Running"))