module.exports = (req, res, next) => {
  const profile = req.profile;
  if (profile.role !== 1) return res.status(403).send("Only admin can do this");
  next();
};
