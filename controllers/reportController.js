const CostItemModel = require("../models/costitemmodel");
const ReportModel = require("../models/reportmodel");

const reportController = {
  async getReport(req, res) {
    const { user_id, month, year } = req.query;

    const checkReport = await ReportModel.findOne({
      user_id: user_id,
      month: month,
      year: year,
    });

    if (!checkReport) {
      const report = new ReportModel({
        user_id: user_id,
        year: year,
        month: month,
      });

      console.log(
        `Report for user id: ${user_id} does not exist, creating new one`
      );
      const costItemsByQuery = await CostItemModel.find({
        user_id,
        month,
        year,
      });

      if (costItemsByQuery.length === 0) {
        report.total_sum = 0;
      } else {
        let total_sum = 0;
        costItemsByQuery.forEach(({ id, day, description, sum, category }) => {
          report[category].push({ id, day, description, sum });
          total_sum += sum;
        });
        report.total_sum = total_sum;
      }

      try {
        await report.save();
        res.status(201).json(report);
      } catch (error) {
        res.status(500).send(error);
      }
    } else {
      console.log(`Report for user id: ${user_id} exists`);
      res.status(200).json(checkReport);
    }
  },
};

module.exports = reportController;
