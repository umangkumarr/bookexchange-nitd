const express = require("express");
const path = require("path")
const router3 = express.Router();
const crypto = require("crypto");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
const connection = require("../connection");

express().use(express.static(path.join(__dirname, "../public")))
//category change and lead to transaction page
router3.get("/action/:C/:isbn/:owner", (req, res) => {
    console.log("dsds");
    char = req.params.C;
    isbn = req.params.isbn;
    owner = req.params.owner;
    if (char == 'ED') {
        res.redirect("/bookupload/" + char + "/" + req.params.isbn + "/" + req.params.owner);
    } else if (char == "R") {
        console.log(req.session.Username);
        if (req.session.Username) {
            connection.query("select fname, lname from student where roll_no = ?", [owner], (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    res.send("No account exit with ? rollno in the database. Please checkout for invalid details and try again.", [owner]);
                } else {
                    connection.query("select cost from rent where isbn = ?", [isbn], (errr, result, fields) => {
                        if (errr) {
                            console.log(errr);
                        } else {
                            console.log(rows);
                            let name = rows[0]['fname'] + " " + rows[0]['lname']
                            var id = crypto.randomBytes(12).toString("hex");
                            data = { id: id, char, rollno: req.session.roll_no, isbn: isbn, s_name: req.session.Name, owner: owner, r_name: name, charge: result[0]['cost'] };
                            req.session.data = data;
                            res.render("transactionPage", { data: data, layout: 'trans' });
                        }
                    });
                }
            });
        } else {
            res.redirect("/login");
        }
    } else if (char == "S") {
        if (req.session.Username) {
            connection.query("select fname, lname from student where roll_no = ?", [owner], (err, rows, fields) => {
                if (err) {
                    res.send("No account exit with ? rollno in the database. Please checkout for invalid details and try again.", [owner]);
                    console.log(err);
                } else {
                    connection.query("select price from sell where isbn = ?", [isbn], (errr, result, fields) => {
                        if (errr) {
                            console.log(errr);
                        } else {
                            console.log(rows);
                            let name = rows[0]['fname'] + " " + rows[0]['lname']
                            var id = crypto.randomBytes(12).toString("hex");
                            data = { id: id, char, rollno: req.session.roll_no, isbn: isbn, s_name: req.session.Name, owner: owner, r_name: name, charge: result[0]['price'] };
                            req.session.data = data;
                            res.render("transactionPage", { data: data, layout: 'trans' });
                        }
                    });
                }
            });
        } else {
            res.redirect('/login')
        }
    }
});

router3.get("/transaction/:C", (req, res) => {
    data = req.session.data;
    char = req.params.C;
    if (req.params.C == 'S') {
        connection.query("insert into buybook (rollno, isbn, owner) values (?,?,?)", [req.session.roll_no, data.isbn, data.owner], (err, rows, fields) => {
            if (!err) {
                connection.query("insert into transaction (transid, isbn, sender_name, s_rollno, receiver_name, r_rollno, amount) value(?,?,?,?,?,?,?)", [data.id, data.isbn, data.s_name, data.rollno, data.r_name, data.owner, data.charge], (error, result, fileds) => {
                    if (error) {
                        console.log(error);
                        res.send("Transaction failed. Please try again after some time.");
                        connection.query("delete from buybook where isbn = ?", [data.isbn]);
                    }
                    else {
                        connection.query("update books set category = 'SD' where isbn = ?", [isbn]);
                        var link = "buy_log";
                        res.render("successall", { roll: req.session.roll_no, link: link, statement: "Buy successful. You can collect the book from the store." });
                    }
                });
            } else {
                res.render("successNoall", { category: char, statement: "Try again after some time." });
            }

        });
    } else if (req.params.C == 'R') {
        console.log("Hello");
        connection.query("insert into borrow_books(rollno, owner, isbn, startdate) values(?,?,?, CURDATE())", [req.session.roll_no, data.owner, data.isbn], (err, rows, fields) => {
            if (err) {
                res.render("successNoall", { category: char, statement: "Try again after some time." });
                console.log(err);
            } else {
                connection.query("insert into transaction (transid, isbn, sender_name, s_rollno, receiver_name, r_rollno, amount) value(?,?,?,?,?,?,?)", [data.id, data.isbn, data.s_name, data.rollno, data.r_name, data.owner, data.charge], (err, rows, fileds) => {
                    if (err) {
                        console.log(error);
                        res.send("Transaction failed. Please try again after some time.");
                        connection.query("delete from borrow_books where isbn = ?", [data.isbn]);
                    } else {
                        connection.query("update books set category = 'BR' where isbn = ?", [isbn]);
                        var link = "rent_log";
                        res.render("successall", { roll: req.session.roll_no, link: link, statement: "Lended successfully. You can collect the book from the store." });
                    }
                });

            }
        });

    }
})

router3.post("/feedback", encoder, (req, res) => {
    body = req.body;
    data = req.session.data;
    if (data == undefined) {
        connection.query("select rating, t_feedback from books where isbn = ?", [req.session.ex], (err, rows, fields) => {
            if (!err) {
                // console.log(rows);
                t_feedback = Number(rows[0]['t_feedback']);
                rating = (Number(rows[0]['rating']) * t_feedback + body.rating) / (t_feedback + 1);
                t_feedback += 1;
                connection.query("update books set rating = ? and t_feedback = ? where isbn = ?", [rating, t_feedback, req.session.ex], (err, row, fileds) => {
                    if (!err) {
                        connection.query("insert into rating( roll_no,isbn, stars, description, username) value(?,?,?,?,?)", [req.session.roll_no, req.session.ex, rating, body.description, req.session.Username], function (error, results, fields) {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                console.log("Insert successfull");
                                res.render("service", { name: req.session.Username, count: req.session.countBook, layout: 'services.handlebars' });
                            }
                        });

                    }
                })
            } else {
                res.redirect("exchange");
            }

        });


    }
    else {
        connection.query("select rating, t_feedback from books where isbn = ?", [data.isbn], (err, rows, fields) => {
            if (!err) {
                // console.log(rows);
                t_feedback = Number(rows[0]['t_feedback']);
                rating = (Number(rows[0]['rating']) * t_feedback + body.rating) / (t_feedback + 1);
                t_feedback += 1;
                connection.query("update books set rating = ? and t_feedback = ? where isbn = ?", [rating, t_feedback, data.isbn], (err, row, fileds) => {
                    if (!err) {
                        connection.query("insert into rating( roll_no,isbn, stars, description, username) value(?,?,?,?,?)", [req.session.roll_no, data.isbn, rating, body.description, req.session.Username], function (error, results, fields) {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                console.log("Insert successfull");
                                res.render("service", { name: req.session.Username, count: req.session.countBook, layout: 'services.handlebars' });
                            }
                        });

                    }
                })
            } else {
                res.redirect("exchange");
            }

        });
    }
});


module.exports = router3;

