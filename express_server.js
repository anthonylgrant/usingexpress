
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; //default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

//USE
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
//tells the Express app to use EJS as its templating engine
app.set("view engine", "ejs");

// if (userDatabase[userId].urls[shortURL]);

// Database Objects
var userDatabase = {
  "ABC" :  {
    ID: "ABC",
    email: "corey@co.com",
    password: "x",
    urls: {
      'xcqt3r': 'https://twitter.com/',
      '2j2js3': 'https://example.com',
      }
    },
  "DEF" : {
    ID: "DEF",
    email: "anthony@an.com",
    password: "y",
    urls: {
      '2k329a': 'https://facebook.com/',
      '893lks': 'https://example.com',
      }
  },
};


//GET
app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urls);
  res.json(userDatabase);
});

//GET //RENDER
app.get('/urls', function (req, res) {
  var userid = req.cookies['userId'];
  var username = "";
  var urls = "";

  if (userid && userDatabase[userid]){
    username = userDatabase[userid].email;
    urls = userDatabase[userid].urls;
  }
  let templateVars = {
    urls: urls,
    username: username
  };
  res.render("urls_index", templateVars);
})

app.get("/urls/new", (req, res) => {
  var userid = req.cookies['userId'];

  let templateVars = {
    urls: userDatabase[userid].urls,
    username: userDatabase[userid].email
  };

  res.render("urls_new", templateVars);
  console.log("This is templateVars: ", templateVars);
  console.log("This is userDatabase: ", userDatabase);
});

app.get("/u/:shortURL", (req, res) => {
  // 1. search through each users object
  // 2. for each users object check for the matching short url userDatabase[user].urls[req.params.shortURL]
  // 3. if you find the short url in the user list, redirect
  // 4. if you go through the whole list of users and their urls and do not find the matching short url then 404 not found
  // let longURL = urls[req.params.shortURL];
  // debugger;
  console.log(req.params.shortURL);
  let shortURL = req.params.shortURL;
  console.log("This is req.params.shortURL: ", shortURL);
  console.log(userDatabase[req.cookies['userId']].urls[shortURL])
  let longURL = userDatabase[req.cookies['userId']].urls[shortURL];
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  let key = req.params.id;
  // console.log(key);
  let templateVars = {
    shortURL: key,
    longURL: userDatabase[req.cookies['userId']].urls[key],
    username: userDatabase[req.cookies['userId']].email
  };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.get("/urls/login", (req, res) => {
  res.render("urls_login");
});


//POST
app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = generateRandomString(6);
  let userId = req.cookies['userId'];

  userDatabase[userId].urls[shortURL] = longURL;
  // // var urls = userDatabase.urls;
  // urls[shortURL] = longURL;
  // userDatabase['urls'] = urls;
  console.log("added URL.  new uDB", userDatabase);
  // urls = userDatabase[]
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  delete urls[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = req.params.id;
  userDatabase[req.cookies['userId']].urls[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

  //POST W/ COOKIES
app.post("/urls/login", (req, res) => {
  let userEmail = req.body.email;
  let password = req.body.password;

  var userId = null;
  for (uid in userDatabase) {
    if (userDatabase[uid].email == userEmail){
      userId = uid;
    }
  }
  let user = userDatabase[userId];
  if (user && user.password === password) {
    res.cookie('userId', userId);
    res.redirect("/urls");
  } else {
    res.status(400).send("Invalid credentials.....");
  }
});

app.post("/urls/logout", (req, res) => {
  res.clearCookie('userId');
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  // let username = req.body.email;
  // let password = req.body.password;
  let userRandomID = generateRandomString(12);
  var user = {
    ID: userRandomID,
    email: req.body.email,
    password: req.body.password,
    urls: {}
  };
  //
  for (var id in userDatabase) {
    if (userDatabase[id].email === req.body.email) {
      res.status(400).send("Error, Email is already in use");
    }
  }
  if (req.body.email == "" || req.body.password == "") {
    res.status(400).send("Error, You didn't enter anything!");
  }
   if (req.body.password.length < 8) {
    res.status(400).send("Error, Your password is too short!");
  }
  // userRandomID === "hfjejhiwg734hu9g4"
  // userDatabase === {}
  // userDatabase[user.ID] = user;
  userDatabase[user.ID] = user;
  // userDatabase === {
  //   "hfjejhiwg734hu9g4": user
  // }
  res.cookie('userId', user.ID);
  console.log("done registering.  udb:", userDatabase);
  // if (req.body.email && req.body.password) {
  // res.redirect("/urls");
  // }
  res.redirect("/urls"); // need to change home path to "/" not "/urls"
});

function generateRandomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

//LISTEN
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
