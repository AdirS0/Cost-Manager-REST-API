const CostItemModel = require("../models/costitemmodel");
const ReportModel = require("../models/reportmodel");

async function getReport(req, res) {
  const categories = [
    "food",
    "health",
    "housing",
    "sport",
    "education",
    "transportation",
    "other",
  ];

  const { user_id, month, year } = req.query;

  const checkReport = await ReportModel.findOne({
    user_id: user_id,
    month: month,
    year: year,
  });

  if (!checkReport) {
    console.log("Report does not exist");
    const costItemsByQuery = await CostItemModel.find({
      user_id,
      month,
      year,
    });

    const report = new ReportModel({
      user_id: user_id,
      year: year,
      month: month,
    });

    if (costItemsByQuery.length === 0) {
      categories.forEach((category) => {
        report[category] = [];
      });
    } else {
      costItemsByQuery.forEach(({ id, day, description, sum, category }) => {
        if (!report[category]) {
          report[category] = [];
        }
        report[category].push({ id, day, description, sum });
      });
    }
    report
      .save()
      .then(() => {
        ReportModel.findOne({
          user_id: user_id,
          month: month,
          year: year,
        })
          .then((report) => res.status(201).json(report))
          .catch((error) => res.status(500).send(error));
      })
      .catch((error) => res.status(500).send(error));

    /*
      report.save()
      .then(() => res.send('report added successfully!'))
      .catch((error) => res.send(error));
      */
  } else {
    console.log("Report exists");
    res.status(201).json(checkReport);
  }
}

module.exports = { getReport };
