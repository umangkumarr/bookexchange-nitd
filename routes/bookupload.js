const connection = require("../connection");
const express = require("express");
const router2 = express.Router();
const path = require("path");

const fileupload = require('express-fileupload');

const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

express().use(express.static(path.join(__dirname, "../public")))
express().use(fileupload());
//uploading the books data with respect to their categories.
router2.get("/bookupload/:C/:isbn/:owner", (req, res) => {
    char = req.params.C
    category = {
        E: char == 'E',
        S: char == 'S',
        R: char == 'R',
        par: char,
        isbnn: req.params.isbn,
        owner: req.params.owner
    }
    // console.log(category);
    res.render("bookupload", { category, layout: "bookuploadmain" });
})

router2.post("/uploadbook/:C/:isbnn/:owner", encoder, (req, res) => {
    // console.log(req.files.samplefile)
    isbn2 = req.params.isbnn;
    owner2 = req.params.owner;
    request = req.params.C;
    console.log(request);
    title = req.body.title;
    author = req.body.author;
    year = req.body.year;
    isbn = req.body.isbn;
    semester = req.body.semester;
    edition = req.body.edition;
    language = req.body.language;
    owner = req.body.owner;
    book_category = req.body.book_category;
    publisher = req.body.publisher;
    highlight = req.body.highlight;
    description = req.body.description;
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    image = 1;
    console.log(sampleFile);

    // name of the input is sampleFile
    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/../public/img/' + String(isbn) + ".jpg";

    // Use mv() to place file on the server
    console.log(req.session.Username);
    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        console.log(req.session.Username);
    });

    if (request == 'R') {
        connection.query("insert into books (image, ISBN, title, author, year, edition, description, rating, category, owner, highlight, publisher, language, book_category) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [image, isbn, title, author, year, edition, description, 1, request, owner, highlight, publisher, language, book_category], (error, rows, fields) => {
            if (error) {
                console.log(error);
                res.redirect("/bookupload/R/?/?", [isbn2, owne2]);
            } else {
                cost = req.body.charges;
                connection.query("insert into rent(isbn, owner, cost) values(?,?,?)", [isbn, owner, cost], (error, rows, fields) => {
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect("/rent");
                    }
                })
            }
        });
    } else if (request == 'E') {
        connection.query("insert into books (image, ISBN, title, author, year, edition, description, rating, category, owner, highlight, publisher, language, book_category) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [image, isbn, title, author, year, edition, description, 1, request, owner, highlight, publisher, language, book_category], (error, rows, fields) => {
            if (error) {
                console.log(error);
                res.redirect("/bookupload/E/?/?", [isbn2, owner2]);
            } else {
                btitle = req.body.btitle;
                bauthor = req.body.bauthor;
                connection.query("insert into demand (ISBN, owner, btitle, bauthor) values(?,?,?,?)", [isbn, owner, btitle, bauthor], (error, rows, fields) => {
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect("/exchange");
                    }
                })
            }
        });
    } else if (request == 'S') {
        connection.query("insert into books (ISBN,image, title, author, year, edition, description, rating, category, owner, highlight, publisher, language, book_category) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [isbn, image, title, author, year, edition, description, 1, request, owner, highlight, publisher, language, book_category], (error, rows, fields) => {
            if (error) {
                res.send(error);
            } else {
                price = req.body.price
                connection.query("insert into sell(isbn, owner, price)  value(?,?,?)", [isbn, owner, price], (error, rows, fields) => {
                    if (error) {
                        res.send(error);
                    } else {
                        res.redirect("/buy");
                    }
                });
            }
        });
    } else if (request == 'ED') {
        console.log(req.session.Username);
        connection.query("insert into books (image, ISBN, title, author, year, edition, description, rating, category, owner, highlight, publisher, language, book_category) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [image, isbn, title, author, year, edition, description, 1, request, owner, highlight, publisher, language, book_category], (error, rows, fields) => {
            if (error) {
                console.log(error);
                res.redirect("/bookupload/R/?/?", [isbn2, owner2]);
            } else {
                connection.query("insert into exchange_log (rollno, owner, isbn1, isbn2) value(?,?,?,?)", [owner, owner2, isbn, isbn2], (error, rows, fields) => {
                    if (error) {
                        console.log(error);
                    } else {
                        req.session.ex=isbn;
                        connection.query("update books set category = 'ED' where isbn = ?", [isbn2], (error, rows, fields) => {
                            if (error) {
                                console.log(error);
                                return;
                            } else {
                                var link = "exchange_log";
                                res.render("successall", { roll: req.session.roll_no, link: link, statement: "Exchange successful. You can collect the book from the store." });
                            }
                        });
                    }
                });
            }
        });
    }

})

module.exports = router2;