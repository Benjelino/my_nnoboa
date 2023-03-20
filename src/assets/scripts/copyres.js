var fs = require("fs-extra");

module.exports = function () {
  fs.copy("google-services.json", "android/app/", function (err) {
    if (err) return console.error(err);
    console.log("src/assets/res copied successfully!");
  });
};
