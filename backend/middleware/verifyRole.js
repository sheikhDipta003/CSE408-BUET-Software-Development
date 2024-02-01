const ROLES_LIST = require("../config/roles");

const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        console.log(allowedRoles);
        console.log(req.roles);
        const result = allowedRoles.includes(ROLES_LIST[req.roles]);
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRole;