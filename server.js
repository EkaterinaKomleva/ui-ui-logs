const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-write-stream');
const calculate = require('./calculate.service.js');

app.use(express.static(path.join(__dirname)));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/calculations', (_req, res) => {
  const countsOfModules = {};
  const countsOfModulesWithPrinting = {};
  const countsOfSystemConfigModules = {};
  const countsOfSystemConfigModulesWithPrinting = {};
  const countsOfInstances = {};
  const countsOfInstancesSeparately = calculate.countsOfInstancesSeparately;
  let countOfRequests = 0;

  fs.createReadStream('parsed_reports.csv')
    .pipe(csv())
    .on('data', (row) => {
      countOfRequests++;
      calculate.groupByModules(row, countsOfModules, countsOfModulesWithPrinting);
      calculate.groupSystemConfModules(row, countsOfSystemConfigModules, countsOfSystemConfigModulesWithPrinting);
      calculate.groupByInstances(row, countsOfInstances);
      calculate.groupByInstancesSeparately(row, countsOfInstancesSeparately);
    })
    .on('end', () => {
      const calculations = {
        countsOfModules,
        countsOfModulesWithPrinting,
        countsOfSystemConfigModules,
        countsOfSystemConfigModulesWithPrinting,
        countsOfInstances,
        countsOfInstancesSeparately,
        countOfRequests,
        countOfDays: csvFiles.length * 3
      };

      res.json(calculations);
      resetObjectValues(calculations.countsOfInstancesSeparately);
    })
    .on('error', (error) => {
      console.error("Error of reading file:", error);
    });
});

app.get('/instance-data', (req, res) => {
  const instance = req.query.instance;
  const withPrinting = req.query.print;
  const category = req.query.category;
  const isSystemConfiguration = req.query.isSystemConfiguration;

  const urls = [];

  fs.createReadStream('parsed_reports.csv')
  .pipe(csv())
  .on('data', (row) => {
    const url = row['url'];
    const domain = row['domain'];
    const print = row['withPrinting'];
    const module = row['module'];
    const systemModule = row['systemModule'];
    const systemConfiguration = row['isSystemConfiguration'];

    const instanceURL = calculate.instances[instance];

    if (withPrinting === 'true') {
      if (isSystemConfiguration === 'true') {
          if (domain === instanceURL && print === withPrinting && systemModule === category && systemConfiguration === isSystemConfiguration) {
          urls.push(`${url}\n`);
        }
      } else {
          if (domain === instanceURL && print === withPrinting && module === category) {
          urls.push(`${url}\n`);
        }
      }
    } else {
      if (isSystemConfiguration === 'true') {
          if (domain === instanceURL && print === withPrinting && systemModule === category && systemConfiguration === isSystemConfiguration) {
          urls.push(`${url}\n`);
        }
      } else {
          if (domain === instanceURL && print === withPrinting && module === category) {
          urls.push(`${url}\n`);
        }
      }
    }
  })
  .on('end', () => res.json(urls))
  .on('error', (error) => {
    console.error("Error of reading file:", error);
  });
});

function parseAndSaveUrls(csvFiles) {
  const csvWriter = createCsvWriter();
  const output = fs.createWriteStream('parsed_reports.csv');
  csvWriter.pipe(output);
  let count = 0;

  csvFiles.forEach(file => {
    fs.createReadStream(file)
    .pipe(csv())
    .on('data', (row) => {
      const message = row['message'];
      const urlMatch = message.match(/https?:\/\/[^\s]+/g);

      if (urlMatch) {
        const url = urlMatch[0];
        const urlData = calculate.getURLData(url);

        if (urlData) {
          csvWriter.write({
            url: urlData.fullUrl,
            domain: urlData.domain,
            module: urlData.module,
            withPrinting: urlData.withPrinting,
            isSystemConfiguration: urlData.isSystemConfiguration,
            systemModule: urlData.systemModule,
          });
        }
      }
    })
    .on('end', () => {
      count++;

      if (count === csvFiles.length) {
        csvWriter.end();
      }
    })
    .on('error', (error) => {
      console.error('Ошибка чтения файла:', error);
    });
  });
}

function resetObjectValues(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      resetObjectValues(obj[key]);
    } else {
      obj[key] = undefined;
    }
  }
}

// getting all reports in the directory
const getCsvFiles = (dir) => {
  return fs.readdirSync(dir)
    .filter(file => file.includes('report_'))
    .map(file => path.join(dir, file));
};

const csvFiles = getCsvFiles(__dirname);
parseAndSaveUrls(csvFiles);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
