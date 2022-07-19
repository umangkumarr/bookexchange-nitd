const mysql = require("mysql");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");//for reading form data
const encoder = bodyParser.urlencoded();
let instance = null;

var connection = require("../connection");
const app = express();
/*this file we are creating so that we pass all data to javascript file 
index.js in js folder */

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }
    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM student;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = DbService;


