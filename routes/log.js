const express = require("express");
const path = require("path")
const router4 = express.Router();

const connection = require("../connection");

express().use(express.static(path.join(__dirname, "../public")))
//query for displaying the exchange logs of the users
router4.get("/exchange_log/:owner", async function (req, res) {
    owner = req.params.owner;
    connection.query("select * from books where category = 'E' and owner = ?", [owner], async function (err, rows1, field) {
        connection.query("select * from \
            (select TT.rollno, TT.owner, TT.isbn1, TT.isbn2, TT.title, TT.author, BB.title as title2, BB.author as author2, BB.image, BB.image as image2  from\
                (select T.rollno, T.owner, T.isbn1, T.isbn2, B.title, B.author, B.image from\
                    (select rollno, owner, isbn1, isbn2 from exchange_log where rollno = ?) as T\
            join books as B\
            on B.owner = T.rollno and T.isbn1 = B.isbn) as TT\
        join books BB\
        on BB.owner = TT.owner and TT.isbn2 = BB.isbn) as T\
    UNION\
    select * from\
                (select TT.rollno, TT.owner, TT.isbn1, TT.isbn2, TT.title, TT.author, BB.title as title2, BB.author as author2, BB.image, BB.image as image2  from\
                    (select T.rollno, T.owner, T.isbn1, T.isbn2, B.title, B.author, B.image from\
                        (select rollno, owner, isbn1, isbn2 from exchange_log where owner = ?) as T\
            join books as B\
            on B.owner = T.rollno and T.isbn1 = B.isbn) as TT\
        join books BB\
        on BB.owner = TT.owner and TT.isbn2 = BB.isbn) as T;", [owner, owner], async function (err, rows2, field) {
            if (!err) {
                data = { rows1, rows2 };
                // console.log(data);
                res.render("activitiesE", { data: data, layout: "activitiess" });
            }
        });
    })
});
//query for displaying the rent log of the users
router4.get("/rent_log/:owner", async function (req, res) {
    owner = req.params.owner;
    connection.query("select * from books where category = 'R' and owner = ?", [owner], async function (err, rows1, fields) {
        if (!err) {
            connection.query("select T.isbn, T.rollno, T.owner, T.startdate, T.enddate, B.title, B.author, B.image from (select * from borrow_books where rollno = ? union select * from borrow_books where owner = ?) as T join books B on B.isbn = T.isbn;", [owner, owner], async function (err, rows2, field) {
                data = { rows1, rows2 };
                res.render("activities", { data: data, category_1: "Your lended Books", category_2: "Your borrowed books", layout: "activitiess" });

            })
        }
    })
})
//query for displaying the buy log of the user
router4.get("/buy_log/:owner", async function (req, res) {
    owner = req.params.owner;
    connection.query("select * from books where category = 'S' and owner = ?", [owner], async function (err, rows1, fields) {
        if (!err) {
            connection.query("select T.isbn, T.rollno, T.owner, B.title, B.author, B.image from (select * from buybook where rollno = ? union select * from buybook where owner = ?) as T join books B on B.isbn = T.isbn;", [owner, owner], async function (err, rows2, field) {
                data = { rows1, rows2 };
                res.render("activities", { data: data, category_2: "Purchased Books", category_1: "Your books for sell", layout: "activitiess" });
            })
        }
    })
})


module.exports = router4;