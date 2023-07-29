function getDevelopersInfo(req, res) {
  const developers = [
    {
      firstname: "Adir",
      lastname: "Solomon",
      id: "11111",
      email: "adir199@gmail.com",
    },
  ];

  res.status(200).send(developers);
}

module.exports = { getDevelopersInfo };
