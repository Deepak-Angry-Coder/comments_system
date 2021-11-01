require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());


//db connection

const db = require('./db')

db();

const Comment = require('./models/comment')

app.post('/api/comments', (req,res) =>{
    const commentModel = new Comment({
        username : req.body.username,
        comment : req.body.comment
    })

    commentModel.save().then((response) => {
        res.send(response)
    }).catch((e)=>console.log('something went wrong'))
})

app.get('/api/comments' ,(req,res)=>{
    
    Comment.find().then((comments) =>{
        res.send(comments)
    }).catch((e)=>console.log('something went wrong'))
})



const server =  app.listen(port ,()=>{
    console.log(`Listing port on ${port}`);
})

let io = require('socket.io')(server)

io.on('connection' , (socket)=>{
    console.log(`New connection : ${socket.id}`)
    
    socket.on('comment' , (data)=>{
        data.time = Date()
        socket.broadcast.emit('comment', data)
    })

    socket.on('typing', (data)=>{
        socket.broadcast.emit('typing', data)
    })
})





