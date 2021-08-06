const { readEndpoints } = require("../models/api.models");

exports.getApiJson = async (req, res, err) => {
  try {
    const endpoints = await readEndpoints();
    res.status(200).send({ endpoints });
  } catch (err) {
    next(err);
  }
};
