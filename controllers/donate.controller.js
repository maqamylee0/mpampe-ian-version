const xtend = require("xtend");
const { donateService } = require("../services");

exports.fundCampaign = async function (req, res) {
  let fund = xtend(
    req.body,
    {
      campaign: req.params.campaignId,
    },
    req.session.user ? { donor: req.session.user.id } : {}
  );

  let donation = await donateService.fundCampaign(fund);
  res.json(donation);
};
