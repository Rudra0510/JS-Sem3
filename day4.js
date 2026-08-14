// async function test() {
//     console.log("Message : 1 ") ; 
//     const response=await fetch("./studentdata.json");
//     console.log(response.status );
//     const stdn=await response.json();
//     return stdn;
//     console.log("message : 3");
// }
// test().then((res)=>{
//     console.log(res);
// }
// )

// const f1=()=>{
// console.log("synchrous task");
// }
const f1=()=>{
    console.log("f1");
    
}
const f1=()=>{
    console.log("f2");
    
}
function main(){
    console.log("this event loop");
    setTimeout(f1,1000);
    setTimeout(f2,1000);
    new Promise((resolve,reject)=>{
        resolve("i am promise1")
    }).then((result)=>{
        console.log(result);
    })
    new Promise((resolve,reject)=>{
        resolve("this is promise2")
    }).then((res)=>{
        console.log(res);
    })
}
main();