const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; 
    const decoded = jwt.verify(token, "this_is_dummy_secret"); 
        next(); 
    req.userData = decoded; 
    // if(verify.userType === "admin") {
    //     next(); 
    // }else{
    //     return res.status(403).json({ message: "Access denied" }); // Respond with forbidden if user is not admin
    // }
  } catch (error) {
    return res.status(401).json({ message: "Auth failed" }); // Respond with an error if verification fails
  }
}