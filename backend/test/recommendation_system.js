//////////////////// recommendation system : https://www.npmjs.com/package/collaborative-filter  ////////////////
const recommendations = require("collaborative-filter/lib/cf_api.js");

const userPWclick = [
  [1, 1, 1],
  [0, 0, 1],
  [1, 0, 0],
];

// Generate recommendations for a specific user
const a = recommendations.cFilter(userPWclick, 2);
console.log(a);
