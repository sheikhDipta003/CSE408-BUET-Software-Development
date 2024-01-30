const verifyRoles = (allowedRole) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const userRole = req.roles.toLowerCase();
    const requiredRoleLower = allowedRole.toLowerCase();

    const result = userRole === requiredRoleLower;
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
