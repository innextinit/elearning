const jwt = require("jsonwebtoken");
const User = require("../models/user");

class auth{
  static async ensureAuthenticated (req, res, next) {
    try {
      console.log("ensureAuthenticated");
      if(req.isAuthenticated()){
        return next();
      }
      res.redirect("/users/login");
    } catch (error) {
      res.status(400).send(error);
    }
  };

  static async verifyToken (req, res, next) {  
    try {
      console.log(`verifyToken`);
      const token = req.user.token;
      const user = await User.findById(req.user._id);
      const data = jwt.verify(token, process.env.TOKEN_KEY);
      console.log(`${data}, ${user}`);

      if (!user) {
        throw new Error();
      }
      
      req.user = user;
      req.token = token;
      next()
    
    } catch (error) {
      return res.status(401).send(`${req.user.username} you are not authorized to access this resource`);
    }
  };

  static async isAdmin (req, res, next) {
    try {
      console.log("isAdmin")
      if (req.user.role === "admin") {
        next();
      } else {
        res.redirect("/users/logout");
        throw new Error();
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };

  static async isTutor (req, res, next) {
    try {
      console.log("isTutor")
      if (req.user.role === "tutor") {
        next();
      } else {
        res.redirect("/users/logout");
        throw new Error();
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };

  static async hasActivated (req, res, next) {
    try {
      console.log("hasActivated")
      if (req.user.hasActivated) {
        next();
      } else {
        req.flash("failed", "please activate account");
        console.log("hasActivated is false");
        throw new Error();
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };

  static async isDisable (req, res, next) {
    try {
      console.log("isDisable")
      if (!req.user.isDisable) {
        next();
      } else {
        req.flash("failed", `${req.user.username} your account is disabled, contact us`);
        console.log(`${req.user.username} your account is disabled, contact us`);
        throw new Error();
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };

  static async isStudent (req, res, next) {
    try {
      console.log("isStudent")
      if (req.user.role === "student") {
        next();
      } else {
        res.redirect("/users/logout");
        throw new Error();
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async makeTutor (req, res, next) {
    try {
      if (!req.user) {
        console.log("no user")
        req.flash("you have to login first");
        return res.redirect(401, "/users/logout");
      }
      if (req.user.role === "student") {
        const setRole = await User.findByIdAndUpdate(req.user._id, {role: "tutor", hasActivated: "false"}, {useFindAndModify: false, new: true, upsert: true });
        console.log("setrole to tutor");
        req.flash("success", "You now a tutor");
        next()
      }
      if (req.user.role === "tutor") {
        req.flash("success", "You are a tutor before.");
        console.log("you are tutor before");
        next()
      } else {
        res.status(403);
        console.log("forbidden");
        req.flash("failed", "forbidden")
      }
      next()
    } catch (error) {
      res.status(400).send(error);
    }
  };

  static async makeAdmin (req, res, next) {
    try {
      if (!req.user) {
        console.log("no user")
        req.flash("you have to login first");
        return res.redirect(401, "/users/logout");
      }
      if (req.user.role === "student") {
        console.log("student want admin, forbidden");
        res.status(403);
        req.flash("failed", "forbidden")
        next()
      }
      if (req.user.role === "tutor") {
        const setRole = await User.findByIdAndUpdate(req.user._id, {role: "admin", hasActivated: "false"}, {useFindAndModify: false, new: true, upsert: true });
        console.log(`new admin ${req.user.username} added`);
        req.flash("success", "You  now an admin"); 
        next()
      }
      if (req.user.role === "admin") {
        console.log("You were an admin before");
        req.flash("failed", "You were an admin before");
      } else {
        res.status(403);
        req.flash("failed", "forbidden")
      }
      next()
    } catch (error) {
      res.status(400).send(error);
    }
  };

  static async revokeAdmin (req, res, next) {
    try {
      if (req.user.role === "admin") {
        const setRole = await User.findByIdAndUpdate(req.user._id, {role: "tutor", hasActivated: "false"}, {useFindAndModify: false, new: true, upsert: true });
        console.log(`${req.user.username}'s admin access is revoked`);
        req.flash("success", `${req.user.username}'s admin access is revoked`); 
        next()
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };

  static async revokeTutor (req, res, next) {
    try {
      if (req.user.role === "admin") {
        const setRole = await User.findByIdAndUpdate(req.user._id, {role: "student", hasActivated: "false"}, {useFindAndModify: false, new: true, upsert: true });
        console.log(`${req.user.username}'s tutor access is revoked`);
        req.flash("success", `${req.user.username}'s tutor access is revoked`); 
        next()
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };

  static async removeUser (req, res, next) {
    try {
      if (req.user.role === "admin" && !req.user.hasActivated && req.user.isDisable) {
        const query = {username: username};
        const setRole = await User.findByIdAndDelete(query, {useFindAndModify: false, new: true });
        console.log(`${query}'s admin access is revoked`);
        req.flash("success", `${query}'s admin access is revoked`); 
        next()
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };



}
module.exports = auth;