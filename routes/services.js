const express = require("express");
const path = require("path")
const router = express.Router();

const mysqlConnection = require("../connection");
const router2 = require("./bookupload");

express().use(express.static(path.join(__dirname, "../public")))

//here with the help of queries we are displaying the number of books available at particular 
//category.
router.get("/bookdetails/:bookISBN", (req, res) => {
    isbn = req.params.bookISBN;
    mysqlConnection.query("Select * from books where isbn = " + String(isbn), (err, rows, fields) => {
        let char = rows[0]['category'];
        rows[0]['cat'] = {
            E: char == 'E',
            R: char == 'R',
            S: char == 'S'
        }
        rows[0]['char'] = char;
        if (!err) {
            if (char == 'E' || char == 'ED') {
                rows[0]['category'] = "Exchange Book"
                mysqlConnection.query("select * from demand where isbn = ?", [isbn], (error, result, field) => {
                    if (!error) {
                        if (char == 'E') {
                            rows[0]['D_Book'] = result[0]['btitle'];
                            rows[0]['D_Author'] = result[0]['bauthor'];
                            rows[0]['char'] = 'ED';
                            rows[0]['dikhao'] = '1';
                            res.render("book_details", { rows: rows, layout: 'main.handlebars' })
                        } else {
                            res.render("book_details", { rows: rows, layout: 'main.handlebars' })
                        }
                    }
                })
            } else if (char == 'S' || char == 'SD') {
                rows[0]['category'] = "Buy Book"
                mysqlConnection.query("select * from sell where isbn = ?", [isbn], (error, result, fld) => {
                    if (!error) {
                        rows[0]['price'] = result[0]['price'];
                        if (char == 'S') {
                            rows[0]['dikhao'] = '1';
                            res.render("book_details", { rows: rows, layout: 'main.handlebars' })
                        } else {
                            res.render("book_details", { rows: rows, layout: 'main.handlebars' })
                        }
                    }
                })
            } else if (char == 'R' || char == 'BR') {
                // console.log("Hello")
                rows[0]['category'] = "Rent Book"
                mysqlConnection.query("select * from rent where isbn = ?", [isbn], (error, result, fld) => {
                    if (!error) {
                        rows[0]['cost'] = result[0]['cost'];
                        if (char == 'R') {
                            rows[0]['dikhao'] = '1';
                            res.render("book_details", { rows: rows, layout: 'main.handlebars' })
                        } else {
                            res.render("book_details", { rows: rows, layout: 'main.handlebars' })
                        }
                    }
                })
            }
        } else {
            // res.send(err);
            console.log(err);
            return;
        }
    })
})

router.get("/exchange", (req, res) => {
    mysqlConnection.query("Select * from books where category = 'E' and owner != ?", [req.session.roll_no], (err, rows, fields) => {
        if (!err) {
            // console.log(rows);
            rows['category'] = 'E';
            rows['Name'] = "Exchange"
            var cG = rows['category'];
            res.render("books", { rows: rows, category: cG, category_name: "exchange_log", roll_no: req.session.roll_no, layout: 'ListBook.handlebars' })
            // console
        } else {
            // res.send(err);
            console.log(err);
            return;
        }
    })
})

//rentbook
router.get("/rent", (req, res) => {
    mysqlConnection.query("Select * from books where category = 'R'and owner != ?", [req.session.roll_no], (err, rows, fields) => {
        if (!err) {
            rows['category'] = 'R';
            rows['Name'] = "Rent"
            var cG = rows['category'];
            res.render("books", { rows: rows, category: cG, category_name: "rent_log", roll_no: req.session.roll_no, layout: 'ListBook.handlebars' })
        } else {
            // res.send(err);
            console.log(err);
            return;
        }
    })
})


//buybook
router.get("/buy", (req, res) => {
    mysqlConnection.query("Select * from books where category = 'S'and owner != ?", [req.session.roll_no], (err, rows, fields) => {
        if (!err) {
            // console.log(rows);
            rows['category'] = 'S';
            rows['Name'] = "Sell"
            // res.render("books", { rows: rows, layout: 'ListBook.handlebars' })
            var cG = rows['category'];
            res.render("books", { rows: rows, category: cG, category_name: "buy_log", roll_no: req.session.roll_no, layout: 'ListBook.handlebars' })
        } else {
            // res.send(err);
            console.log(err);
            return;
        }
    })
});
router.get("/writereview", (req, res) => {
    res.sendFile(path.join(__dirname + "/../public/html/writereview.html"));
})

module.exports = router;