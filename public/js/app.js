// const express = require("express");

let username;
let  socket = io()


do{
    username =  prompt('Enter your name');
}while(!username)


const textarea = document.querySelector('#textarea')
const submitBtn = document.querySelector('#submitBtn')
const commentBox = document.querySelector('.comment__box')


submitBtn.addEventListener('click', (e)=>{
    e.preventDefault();

    let comment = textarea.value;

    if(!comment){
        return
    }
    postComment(comment)
})



function postComment (comment){
    // comment append to dom

    let data = {
        username:username,
        comment:comment
    }
    appendToDom(data)
       textarea.value = ''
    

       // Broadcast 
       BroadcastComment(data)

    // Sync with Mongodb
    syncWithDb(data)
}




function appendToDom(data){
    let lTag = document.createElement('li')
    lTag.classList.add('comment')

    let markup = `
    
                        <div class="card border-light my-3">
                            <div class="card-body">
                                <h5>${data.username}</h5>
                                <p>${data.comment}</p>
                                <div>
                                    <img src="./images/bx-time.svg" alt="time" width="17px" height="17px" >
                                    <small>${moment(data.time).format('LT')}</small>
                                </div>
                            </div>
                        </div>
    `

    lTag.innerHTML =  markup;

    commentBox.prepend(lTag);
}

function BroadcastComment(data){
    // socket
    socket.emit('comment' , data)
}

socket.on('comment', (data)=>{
    appendToDom(data);
})



//live typing

textarea.addEventListener('keyup', (e)=>{
    socket.emit('typing',{username})
})

let timerId = null
function debounce(func, timer){
    
    if(timerId){
       clearTimeout(timerId);
    }
    
    timerId  = setTimeout(()=>{
       func()
    },timer)
}

let textValue = document.querySelector('.typing')

socket.on('typing' ,(data)=>{
     textValue.innerText = `${data.username} is typing...`
     
     debounce(function(){
        textValue.innerText = ''
     },1000);
})


//Api calls

function syncWithDb(data){
    
    const headers = {
        'Content-Type' : 'application/json'
    }

    fetch('/api/comments', {method : 'Post', body: JSON.stringify(data), headers} )
    .then(response => response.json())
    .then(result => {
        console.log(result)
    })
}


function fetchComment (){
    fetch('/api/comments')
    .then(res => res.json())
    .then((result) => {
        result.forEach(comment =>{
            comment.time = comment.createdAt
            appendToDom(comment)
        })
    })
}

window.onloadeddata = fetchComment();


