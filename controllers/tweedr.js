const sha256 = require("js-sha256");
const SALT = require("../salt");

module.exports = db => {
  const showHomepage = (request, response) => {
    const userID = request.cookies.userID;
    const username = request.cookies.username;
    const loggedIn = request.cookies.loggedIn;
    if (loggedIn !== undefined) {
      db.tweedr.getTweeds(userID, (err, result) => {
        const data = {
          userID: userID,
          username: username,
          loggedIn: loggedIn,
          tweeds: result
        };
        response.render("index", data);
      });
    } else {
      const data = {
        userID: userID,
        username: username,
        loggedIn: loggedIn
      };
      response.render("index", data);
    }
  };

  const showRegisterForm = (request, response) => {
    const data = {
      header: "Register",
      actionPath: "/register"
    };
    response.render("register", data);
  };

  const showLoginForm = (request, response) => {
    const data = {
      header: "Login",
      actionPath: "/login"
    };
    response.render("register", data);
  };

  const registerUser = (request, response) => {
    const username = request.body.username;
    const password = sha256(SALT + request.body.password);
    db.tweedr.registerUser(username, password, (err, result) => {
      if (err) {
        const data = {
          errorMessage:
            "Username already exists! Please choose a different username."
        };
        response.render("error", data);
      } else {
        const userID = result.id;
        const username = result.username;
        const hashedLogin = sha256(SALT + result.id);
        response.cookie("userID", userID);
        response.cookie("username", username);
        response.cookie("loggedIn", hashedLogin);
        response.redirect("/");
      }
    });
  };

  const loginUser = (request, response) => {
    const username = request.body.username;
    const password = sha256(SALT + request.body.password);
    db.tweedr.loginUser(username, password, (err, result) => {
      if (err === "User doesn't exist!") {
        const data = {
          errorMessage: err
        };
        response.render("error", data);
      } else if (err === "Wrong password!") {
        const data = {
          errorMessage: err
        };
        response.render("error", data);
      } else {
        const userID = result.id;
        const username = result.username;
        const hashedLogin = sha256(SALT + result.id);
        response.cookie("userID", userID);
        response.cookie("username", username);
        response.cookie("loggedIn", hashedLogin);
        response.redirect("/");
      }
    });
  };

  const logoutUser = (request, response) => {
    response.clearCookie("userID");
    response.clearCookie("username");
    response.clearCookie("loggedIn");
    response.redirect("/");
  };

  const newTweed = (request, response) => {
    response.render("newTweed");
  };

  const postTweed = (request, response) => {
    const tweed = request.body.tweed;
    const userID = request.cookies.userID;
    db.tweedr.postTweed(tweed, userID, (err, result) => {
      if (err) response.send(err);
      else {
        response.redirect("/");
      }
    });
  };

  return {
    showHomepage: showHomepage,
    showRegisterForm: showRegisterForm,
    showLoginForm: showLoginForm,
    registerUser: registerUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
    newTweed: newTweed,
    postTweed: postTweed
  };
};