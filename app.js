const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

const listNmber = "680c81fce6";
const apiKey = "72a30f1d3600f40729e70f1fe9b3ee84-us21";
var url = "https://us21.api.mailchimp.com/3.0/";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const options = {
        method: "POST",
        auth: "mark:" + apiKey
    }
    console.log(url + "lists/" + listNmber);
    const request = https.request(url + "lists/" + listNmber, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            const serverSideInfo = JSON.parse(data);
            console.log(serverSideInfo.error_count);
        })
    })

    request.write(jsonData);
    request.end();
    console.log(jsonData);
})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => (console.log("server is up and listning on 3000.")));