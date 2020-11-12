const fs = require('fs');
const path = require('path');
const rootdir = '';
const file = path.join(
  rootdir,
  'platforms/android/app/src/main/res/xml/config.xml'
);

fs.readFile(file, 'utf8', function (err, data) {
  if (err) return console.log(err);

  let result = data;
  result = result.replace('<access origin="*" />', '');

  fs.writeFile(file, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
