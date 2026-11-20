C:\Users\RUDRA>mongosh
Current Mongosh Log ID: 6afff3c2484e4abc5d3eac8f
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.14.1
Using MongoDB:          9.0.4
Using Mongosh:          2.14.1
mongosh 2.14.2 is available for download: https://www.mongodb.com/try/download/shell

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2026-11-14T12:00:31.535+05:30: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
------

test> use studentDB
switched to db studentDB
studentDB> db.createCollection("students")
{ ok: 1 }
studentDB> db.students.insertMany([
|     {rollNo: 1, name: "Rahul", age: 19, course: "CSE"},
|     {rollNo: 2, name: "Aman", age: 21, course: "IT"},
|     {rollNo: 3, name: "Priya", age: 22, course: "CSE"},
|     {rollNo: 4, name: "Rohit", age: 20, course: "ECE"},
|     {rollNo: 5, name: "Neha", age: 23, course: "IT"}
| ])
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6afff3ea484e4abc5d3eac90'),
    '1': ObjectId('6afff3ea484e4abc5d3eac91'),
    '2': ObjectId('6afff3ea484e4abc5d3eac92'),
    '3': ObjectId('6afff3ea484e4abc5d3eac93'),
    '4': ObjectId('6afff3ea484e4abc5d3eac94')
  }
}
studentDB> db.students.find({age: {$gt: 20}})
[
  {
    _id: ObjectId('6afff3ea484e4abc5d3eac91'),
    rollNo: 2,
    name: 'Aman',
    age: 21,
    course: 'IT'
  },
  {
    _id: ObjectId('6afff3ea484e4abc5d3eac92'),
    rollNo: 3,
    name: 'Priya',
    age: 22,
    course: 'CSE'
  },
  {
    _id: ObjectId('6afff3ea484e4abc5d3eac94'),
    rollNo: 5,
    name: 'Neha',
    age: 23,
    course: 'IT'
  }
]
studentDB> db.students.updateOne(
|     {rollNo: 1},
|     {$set: {age: 21}}
| )
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
studentDB> db.students.deleteOne({rollNo: 5})
{ acknowledged: true, deletedCount: 1 }
studentDB> db.students.find()
[
  {
    _id: ObjectId('6afff3ea484e4abc5d3eac90'),
    rollNo: 1,
    name: 'Rahul',
    age: 21,
    course: 'CSE'
  },
  {
    _id: ObjectId('6afff3ea484e4abc5d3eac91'),
    rollNo: 2,
    name: 'Aman',
    age: 21,
    course: 'IT'
  },
  {
    _id: ObjectId('6afff3ea484e4abc5d3eac92'),
    rollNo: 3,
    name: 'Priya',
    age: 22,
    course: 'CSE'
  },
  {
    _id: ObjectId('6afff3ea484e4abc5d3eac93'),
    rollNo: 4,
    name: 'Rohit',
    age: 20,
    course: 'ECE'
  }
]
studentDB>