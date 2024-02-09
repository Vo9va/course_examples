import superagent from 'superagent';
import fs from 'fs';
import { testrail } from '../test-utils/helpers/testRail.helper';

const dirCashier = './exportCasesInXML/cashier';
const dirTradeLogiq = './exportCasesInXML/tradelogiq';

const agent = superagent.agent();

async function createDir() {
  fs.mkdirSync(dirCashier, { recursive: true });
  fs.mkdirSync(dirTradeLogiq, { recursive: true });
}

async function getTestRuns(project) {
  const runsArray = [];

  await testrail
    .getRuns(project)
    .then((r) => {
      if (project === 3) {
        for (const data of r.body.runs) {
          if (runsArray.length === 20) {
            break;
          }
          runsArray.push({
            id: data.id,
            date: new Date(data.created_on * 1000).toISOString().slice(0, 10),
          });
        }
      }
      if (project === 1) {
        for (const value of r.body.runs) {
          if (value.name.includes('Smoke') || value.name.includes('Regression')) {
            runsArray.push({
              id: value.id,
              date: new Date(value.created_on * 1000).toISOString().slice(0, 10),
              name: value.name,
            });
            if (runsArray.length === 20) {
              break;
            }
          }
        }
      }
    })
    .catch((err) => {
      throw Error('getTestRuns: ' + err.response.statusMessage);
    });

  return runsArray;
}

async function exportsXmlTestCases(project, dir) {
  const stream = fs.createWriteStream(`${dir}/test_cases_${new Date().toISOString().slice(0, 10)}.xml`);

  return agent
    .get(`https://blackrockng.testrail.io/index.php?/suites/export/${project}`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .on('response', (response) => {
      if (response.statusCode !== 200) {
        throw Error('Test_cases: Status code is not 200: statusCode ' + response.statusCode);
      }
    })
    .pipe(stream);
}

async function exportsXmlTestRuns(project, dir) {
  const res = await getTestRuns(project);

  res.forEach((data) => {
    return agent
      .get(`https://blackrockng.testrail.io/index.php?/runs/export/${data.id}`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .on('response', (response) => {
        if (response.statusCode !== 200) {
          throw Error('Test_runs: Status code is not 200: statusCode ' + response.statusCode);
        }
      })
      .pipe(fs.createWriteStream(`${dir}/${data.date}_test_run_${data.id}.xml`));
  });
}

async function createFileTestCases(project, dir) {
  return agent
    .post('https://blackrockng.testrail.io/index.php?/auth/login')
    .send({
      name: 'qa@protonixltd.com',
      password: 'Qwerty123@',
      rememberme: '1',
    })
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .then(async () => {
      await exportsXmlTestCases(project, dir);
      await exportsXmlTestRuns(project, dir);
      console.log('Export completed successfully!');
    })
    .catch((e) => {
      throw Error('Login to TestRail: ' + e.status);
    });
}

try {
  createDir().then(async () => {
    await createFileTestCases(3, dirCashier);
    await createFileTestCases(1, dirTradeLogiq);
  });
} catch (e) {
  throw Error(e);
}
