



var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; //default port 8080
const bodyParser = require("body-parser");
//USE
app.use(bodyParser.urlencoded({extended: true}));

//tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

//GET
app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//GET //RENDER
app.get('/urls', function (req, res) {
  // let templateVars = { urls: urlDatabase };
  res.render("urls_index", { urls: urlDatabase });
})

  // WILDCARD STRINGS
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  // debugger;
  res.redirect(longURL);
});


app.get("/urls/:id", (req, res) => {
  let key = req.params.id;
  // console.log(key);
  let templateVars = { shortURL: key, longURL: urlDatabase[key] };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

//POST
app.post("/urls", (req, res) => {
  //console.log(req.body);  // debug statement to see POST parameters
  let longURL = req.body.longURL;
  let shortURL = generateRandomString(6);
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = req.params.id;
  urlDatabase[shortURL] = longURL;
  // console.log("LKSDJF:KLJWE----------------");
  // console.log(shortURL);
  res.redirect(`/urls/${shortURL}`);
});

function generateRandomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

//LISTEN
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
