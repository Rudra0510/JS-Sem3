// //Emitter- onabort() register event or event listner , emit(event)
// const EventEmitter=require('events');
// const events = new EventEmitter();
// events.on("greet" ,()=>{
// console.log("this is event emmitter");
    
// })
// events.on("exit" ,()=>{})
// events.emit("greet");
// events.emit("exit");

//custom emitter
const EventEmitter=require('events');
class MyEvent extends EventEmitter{}
const events = new MyEvent();
events.on("greet" ,(name)=>{
console.log(`hello everyone my name is ${name}`);//template literals-  `${variable name}`
    
})
events.on("exit" ,()=>{})
events.emit("greet" , "Rudra");
events.emit("exit");