var connection = require("../connection");
const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const bcrypt = require('bcryptjs');
const dbService = require('./dbservices');
const router1 = express.Router();
const bodyParser = require("body-parser");//for reading form data
const mysqlConnection = require("../connection");
const encoder = bodyParser.urlencoded();
express().use(express.static(path.join(__dirname, "../public")));

var sessionUsername, category, searchValue, emailPass;

//signup request
router1.post("/signup", encoder, async function (req, res) {
    var rollno = req.body.rollno;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var branch = req.body.branch;
    var email = req.body.email;
    var phoneNo = req.body.phoneNo;
    var gender = req.body.gender;
    var year = req.body.year;
    var sem = req.body.sem;
    var username = req.body.username;
    var password = req.body.password;
    var pcheck = req.body.psw_repeat;
    if (pcheck === password) {
        const hashpsw = await bcrypt.hash(password, 6);
        connection.query("insert into student(roll_no,fname,lname,branch,email,phone_no,gender,year,sem,username,password) values (?,?,?,?,?,?,?,?,?,?,?)", [rollno, fname, lname, branch, email, phoneNo, gender, year, sem, username, hashpsw], function (error, results, fields) {
            if (error) {
                throw error;
            }
            else {
                console.log("Signup successfull");
                res.redirect("/login")
            }
            res.end();
        })
    }
    else {
        console.log("Please enter the password again");
        res.redirect("/login");

    }
})

//home page
router1.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/html/main.html"))
})

//login code
router1.post("/login", encoder, async function (req, res) {
    username = req.body.username;
    var password = req.body.password;
    connection.query("select password,roll_no, fname, lname from student where username = ? ", [username], async function (error, results, fields) {
        results = JSON.parse(JSON.stringify(results))
        // console.log(results[0].password);
        if (await bcrypt.compare(password, results[0].password)) {
            // console.log(results)
            console.log("Login successful");
            req.session.Username = username;
            req.session.password = password;
            req.session.roll_no = results[0].roll_no;
            req.session.Name = results[0].fname + " " + results[0].lname;
            // console.log(results[0].fname + " " + results[0].lname);
            sessionUsername = req.session.Username;
            // console.log(req.session.Username);
            res.redirect("/service");
        } else {
            res.redirect("/loginunsuccess");
        }
        res.end();
    })
})

//login unsuccess
router1.get("/loginunsuccess", function (req, res) {
    res.render("loginunsuccess");
})

//forget password
router1.post("/forget_password", encoder, async function (req, res) {
    var password;
    connection.query("select password,email from student where username = ? ", [req.body.username], async function (error, results, fields) {
        if(error)
        {
            res.render("")
        }
        results = JSON.parse(JSON.stringify(results))
        req.session.username = req.body.username;
        // console.log(results[0].password);
        emailPass = results[0].password;
        const output = `
    <p>Your password is <a style="color:blue" >${results[0].password}</a></p>
    <p>Please update your password!!</p>`;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'bookexchangecentre.nitd@gmail.com',
                pass: 'hello123@1234'
            }
        });

        var mailOptions = {
            from: 'bookexchangecentre.nitd@gmail.com',
            to: results[0].email,
            subject: 'Book Exchange centre',
            text: 'Hello vaibhav8101 !',
            html: output
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                // console.log("Hell");
                console.log('Email sent: ' + info.response);
            }
        });
        res.redirect("/upPassnew1");


        res.end();
    })


})
//update password page
router1.get("/upPassnew1", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/html/updatepass.html"))
})
//updating forget password
router1.post("/upPassnew", encoder, async function (req, res) {
    var email_password = req.body.prev_password;
    var new_password = req.body.new_password;
    // console.log(email_password);
    // console.log(emailPass);    


    if (emailPass === email_password) {
        // console.log(req.session.username); 
        const hashpsw = await bcrypt.hash(new_password, 6);
        connection.query("update student set password=? where username = ? ", [hashpsw, req.session.username], async function (error, results, fields) {
            if (error) {
                res.redirect("/unsuccess");
                throw error;
            }
            else {
                res.redirect("/login");
            }
            res.end();
        })
    }
    else
    {
        res.redirect("/upPassnew1");
    }
})



//giving data to the signup form js so we analyse this username exist or not
router1.get("/getAll", function (req, res) {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();

    result
        .then(data => res.json({ data: data }))
        .catch(err => console.log(err));

})

//services page with the count of books
var countBook=0;
router1.get("/service", function (req, res) {
    // console.log(req.session.Username);
    connection.query("select count(isbn) as count from books where category=? or category=? or category=?", ["S", "E", "R"], async function (error, results, fields) {
        if (error) {
            throw error;
        }
        else {
            results = JSON.parse(JSON.stringify(results))
            // console.log(results[0].count);
            countBook = results[0].count;
        }
        res.end();
    })
    if (req.session.Username) {
        req.session.countBook=countBook;
        res.render("service", { name:req.session.Username,count:countBook, layout: "services" });
    }
    else {
        res.redirect("/login");
    }
})


//logout request
router1.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            res.redirect("/login");
        }
    })
    res.redirect("/login");
})


//user profile
router1.get("/profile", (req, res) => {
    connection.query("select roll_no,img,username,fname,lname,branch,email,phone_no,gender,year,sem  from student where username = ?", [sessionUsername], (error, results, fields) => {
        if (!error) {
            results = JSON.parse(JSON.stringify(results))
            res.render("userDash", { results: results, layout: "mainUserDash.handlebars" });

        } else {
            console.log(error);
            res.redirect("/login");
        }

    })
})

//logint page redirection
router1.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/html/login.html"))
})


//search bar
router1.post("/search/:category", encoder, async function (req, res) {
    searchValue = req.body.search;
    category = req.params.category;
    // console.log(category);
    // console.log(searchValue);
    res.redirect("/search");
})
//search bar implementation
router1.get("/search", function (req, res) {
    // res.sendFile(path.join(__dirname, "../public/html/login.html"))
    mysqlConnection.query("Select * from books where category = ? and title like ?", [category, '%' + searchValue + '%'], (err, rows, fields) => {
        if (!err) {
            console.log(category);

            if (category == 'E') {
                rows['category'] = category;
                rows['Name'] = "Exchange"
            }
            else if (category == 'S') {
                rows['category'] = category;
                rows['Name'] = "Sell"
            }
            else if (category == 'R') {
                rows['category'] = category;
                rows['Name'] = "Rent"
            }
            // var cG = rows['category'];
            res.render("books", { rows: rows, category: category, layout: 'ListBook.handlebars' })
        } else {
            // res.send(err);
            console.log(err);
            return;
        }
    })
})

router1.get("/updateRecord", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/html/updateRecord.html"))
})

//update records code start from here
router1.post("/upRoll", encoder, async function (req, res) {
    var rollno = req.body.rollno;
    console.log(req.session.Username);
    connection.query("update student set roll_no=? where username = ? ", [rollno, req.session.Username], async function (error, results, fields) {
        if (error) {
            res.redirect("/unSuccess");
            throw error;
        }
        else {
            res.redirect("/uSuccess");
        }
        res.end();
    })
})


router1.post("/upfname", encoder, async function (req, res) {
    var fname = req.body.fname;
    console.log(req.session.Username);
    connection.query("update student set fname=? where username = ? ", [fname, req.session.Username], async function (error, results, fields) {
        if (error) {
            res.redirect("/unSuccess");
            throw error;
        }
        else {
            res.redirect("/uSuccess");
        }
        res.end();
    })
})


router1.post("/uplname", encoder, async function (req, res) {
    var lname = req.body.lname;
    console.log(req.session.Username);
    connection.query("update student set lname=? where username = ? ", [lname, req.session.Username], async function (error, results, fields) {
        if (error) {
            res.redirect("/unSuccess");
            throw error;
        }
        else {
            res.redirect("/uSuccess");
        }
        res.end();
    })
})

router1.post("/upBranch", encoder, async function (req, res) {
    var branch = req.body.branch;
    console.log(req.session.Username);
    connection.query("update student set branch=? where username = ? ", [branch, req.session.Username], async function (error, results, fields) {
        if (error) {
            res.redirect("/unSuccess");
            throw error;
        }
        else {
            res.redirect("/uSuccess");
        }
        res.end();
    })
})

router1.post("/upEmail", encoder, async function (req, res) {
    var email = req.body.email;
    console.log(req.session.Username);
    connection.query("update student set email=? where username = ? ", [email, req.session.Username], async function (error, results, fields) {
        if (error) {
            res.redirect("/unSuccess");
            throw error;
        }
        else {
            res.redirect("/uSuccess");
        }
        res.end();
    })
})

router1.post("/upPhone", encoder, async function (req, res) {
    var phoneNo = req.body.phoneNo;
    console.log(req.session.Username);
    connection.query("update student set phone_no=? where username = ? ", [phoneNo, req.session.Username], async function (error, results, fields) {
        if (error) {
            res.redirect("/unSuccess");
            throw error;
        }
        else {
            res.redirect("/uSuccess");
        }
        res.end();
    })
})

router1.post("/upGen", encoder, async function (req, res) {
    var gender = req.body.gender;
    console.log(req.session.Username);
    connection.query("update student set gender=? where username = ? ", [gender, req.session.Username], async function (error, results, fields) {
        if (error) {
            res.redirect("/unSuccess");
            throw error;
        }
        else {
            res.redirect("/uSuccess");
        }
        res.end();
    })
})

router1.post("/upYear", encoder, async function (req, res) {
    var year = req.body.year;
    console.log(req.session.Username);
    connection.query("update student set year=? where username = ? ", [year, req.session.Username], async function (error, results, fields) {
        if (error) {
            res.redirect("/unSuccess");
            throw error;
        }
        else {
            res.redirect("/uSuccess");
        }
        res.end();
    })
})

router1.post("/upSem", encoder, async function (req, res) {
    var sem = req.body.sem;
    console.log(req.session.Username);
    connection.query("update student set sem=? where username = ? ", [sem, req.session.Username], async function (error, results, fields) {
        if (error) {
            res.redirect("/unSuccess");
            throw error;
        }
        else {
            res.redirect("/uSuccess");
        }
        res.end();
    })
})

router1.post("/upPass", encoder, async function (req, res) {
    var prev_password = req.body.prev_password;
    var new_password = req.body.new_password;
    console.log(req.session.Username);
    console.log(req.session.password);
    if (req.session.password == prev_password) {
        const hashpsw = await bcrypt.hash(new_password, 6);
        connection.query("update student set password=? where username = ? ", [hashpsw, req.session.Username], async function (error, results, fields) {
            if (error) {
                res.redirect("/unSuccess");
                throw error;
            }
            else {
                res.redirect("/uSuccess");
            }
            res.end();
        })
    }
})




router1.get("/uSuccess", function (req, res) {
    res.render("updateSuccess");
})
router1.get("/unSuccess", function (req, res) {
    res.render("updateunsuccess");
})

//creating a route for directing to the activities page
router1.get("/activities/:category", async function (req, res) {
    category = req.params.category;
    if (category == "E") {
        res.render("activitiesE", { roll_no: req.session.roll_no, category: "exchange_log", layout: "activitiess" });
    }
    else {

        res.render("activities_exchange", { category: undefined, layout: "activities_exchange_main.handlebars" });
    }
})

//uploading image
router1.post("/image", encoder, async function (req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // name of the input is sampleFile
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/upload/' + sampleFile.name;

    console.log(sampleFile);

    // Use mv() to place file on the server
    console.log(req.session.Username);
    sampleFile.mv(uploadPath, function (err) {

        if (err) return res.status(500).send(err);
        console.log(req.session.Username);
        //   res.send('File Uploaded');
        connection.query('UPDATE student SET img = ? WHERE username =?', [sampleFile.name, req.session.Username], (err, rows) => {
            if (!err) {
                console.log("Image uploaded successfully");
                res.redirect('/profile');
            } else {
                console.log(err);
            }
        });
    });

})

module.exports = router1;

