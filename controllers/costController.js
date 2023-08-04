const CostItemModel = require("../models/costitemmodel");
const ReportModel = require("../models/reportmodel");

const costController = {
  async addCostItem(req, res) {
    const costItem = new CostItemModel({
      user_id: req.body.user_id,
      year: req.body.year,
      month: req.body.month,
      day: req.body.day,
      description: req.body.description,
      category: req.body.category,
      sum: req.body.sum,
    });

    let id = "";
    await costItem
      .save()
      .then((savedCostItem) => {
        id = savedCostItem._id;
      })
      .catch((error) => res.error(error));
      console.log(id);

    let existingReport = await ReportModel.findOne({
      user_id: req.body.user_id,
      year: req.body.year,
      month: req.body.month,
    });

    if (existingReport) {
      const { day, description, sum, category } = req.body;
      
      existingReport[category].push({ id, day, description, sum });
      existingReport
        .save()
        .then(() =>
          res
            .status(201)
            .send("Cost item added successfully, Existing Report updated")
        )
        .catch((error) => res.status(500).send(error));
    } else {
      res.status(201).send("Cost item added successfully, no Existing Report");
    }
  },
};

module.exports = costController;
