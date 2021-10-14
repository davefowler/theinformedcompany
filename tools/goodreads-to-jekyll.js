const fs = require('fs');
const d3 = require('d3-dsv');
const path = require('path');
const yaml = require('js-yaml');
const toMarkdown = require('to-markdown');

d3.csvParse(
  fs.readFileSync('./goodreads_library_export.csv', 'utf8')
).filter(row => {
  return row['Exclusive Shelf'] !== 'to-read';
}).forEach(row => {
  if (row['Date Read'] === '') {
    row['Date Read'] = row['Date Added'];
  }
  row.published = row['Original Publication Year'] || row['Year Published'];
  row.goodreads_id = row['Book Id'];
  Object.keys(row).forEach(k => {
    if (row[k] === '' || row[k] === undefined) delete row[k];
  });
  if (row['My Rating'] === '0') {
    delete row['My Rating'] === '0';
  } else {
    row['Rating'] = row['My Rating'];
    delete row['My Rating'];
  }
  delete row['Book Id'];
  const description = row['My Review'];
  delete row['Number of Pages'];
  delete row['Average Rating'];
  delete row['Owned Copies'];
  delete row['Condition'];
  delete row['Author l-f'];
  delete row['Author l-f'];
  delete row['Original Publication Year'];
  delete row['Year Published'];
  delete row['My Review'];
  delete row['Exclusive Shelf'];
  delete row['Binding'];
  delete row['Date Added'];
  delete row['Read Count'];
  row['ISBN'] = row['ISBN'].replace(/[="]/g, '');
  row['ISBN13'] = row['ISBN13'].replace(/[="]/g, '');

  const r = {};

  for (let key in row) {
    r[key.replace(' ', '_').toLowerCase()] = row[key];
  }
  const timeFinished = new Date(r.date);
  let fileName = `${r.title
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/[^A-Z0-9-]/gi, '')
    .toLowerCase()
    .split('-')
    .slice(0, 5)
    .join('-')}.md`;
  fs.writeFileSync(path.join('books/', fileName), `---
${yaml.safeDump(r)}---

${toMarkdown(description || '')}
`);
});
