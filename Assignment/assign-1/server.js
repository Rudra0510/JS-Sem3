import http from "http";
import fs from "fs";
const server = http.createServer((req, res) => {
    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Student Record System</title>
            </head>
            <body><center>
                <h1>Welcome to Student Record System</h1>
                <p>Manage and maintain student records easily.</p>
                <a href="/add-student">
                    <button>Add Student</button>
                </a>
                <br><br>
                <a href="/students">View Students</a></center>
            </body>
            </html>
        `);
    }
    else if (req.url === "/add-student" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Add Student</title>
            </head>
            <body><center>
                <h1>Add Student</h1>
                <form action="/save-student" method="POST">
                    <label>Student Name:</label><br>
                    <input type="text" name="name" required>
                    <br><br>

                    <label>Roll Number:</label><br>
                    <input type="text" name="rollNumber" required>
                    <br><br>

                    <label>Course:</label><br>
                    <input type="text" name="course" required>
                    <br><br>

                    <label>Email:</label><br>
                    <input type="email" name="email" required>
                    <br><br>
                    <button type="submit">Add Student</button>
                </form>
                <br>
                <a href="/">Back to Home</a></center>
            </body>
            </html>
        `);
    }
    else if (req.url === "/save-student" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            const formData = new URLSearchParams(body);
            const student = {
                name: formData.get("name"),
                rollNumber: formData.get("rollNumber"),
                course: formData.get("course"),
                email: formData.get("email")
            };
            let students = [];
            if (fs.existsSync("students.json")) {
                const data = fs.readFileSync("students.json", "utf-8");
                if (data) {
                    students = JSON.parse(data);
                }
            }
            students.push(student);
            fs.writeFileSync(
                "students.json",
                JSON.stringify(students, null, 2)
            );
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Success</title>
                </head>
                <body>
                    <center><h1>Student Added Successfully!</h1>
                    <a href="/add-student">
                        Add Another Student
                    </a>
                    <br><br>
                    <a href="/students">
                        View All Students
                    </a>
                    <br><br>
                    <a href="/">Go to Home</a></center>
                </body>
                </html>
            `);
        });
    }
    else if (req.url === "/students" && req.method === "GET") {
        let students = [];
        if (fs.existsSync("students.json")) {
            const data = fs.readFileSync("students.json", "utf-8");
            if (data) {
                students = JSON.parse(data);
            }
        }
        let studentList = "";
        if (students.length === 0) {
            studentList = `
                <p>No student records found.</p>
            `;
        } else {
            students.forEach((student, index) => {
                studentList += `
                    <h3>Student ${index + 1}</h3>
                    <p>Name: ${student.name}</p>
                    <p>Roll Number: ${student.rollNumber}</p>
                    <p>Course: ${student.course}</p>
                    <p>Email: ${student.email}</p>

                    <hr>
                `;
            });
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Student Records</title>
            </head>
            <body>
               <center> <h1>All Student Records</h1></center>
                ${studentList}
                <br>
                <a href="/">Go to Home</a>
            </body>
            </html>
        `);
    }
    else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(`
            <h1>404 - Page Not Found</h1>
            <a href="/">Go to Home</a>
        `);
    }
});
server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});