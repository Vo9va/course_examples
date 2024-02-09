import Testrail from 'testrail-api';

export const testrail = new Testrail({
  host: 'https://blackrockng.testrail.io',
  user: 'qa@protonixltd.com',
  password: 'Qwerty123@',
});

class TestRailHelper {
  getCaseIdFromTestTitle(test) {
    let title = test.title;
    try {
      return title.match(/C(\d+)/)[1];
    } catch (e) {
      console.log(`There is no caseId in test title '${title}'`);
    }
  }

  async updateTestStatusToAutomated(test) {
    const caseIdFromDescription = await testRailHelper.getCaseIdFromTestTitle(test.parent);
    const caseIdFromIt = await testRailHelper.getCaseIdFromTestTitle(test);

    if (caseIdFromDescription !== undefined) {
      await testrail.updateCase(caseIdFromDescription, { custom_automation_type: 1 });
    }
    if (caseIdFromIt !== undefined) {
      await testrail.updateCase(caseIdFromIt, { custom_automation_type: 1 });
    }
  }
}

export const testRailHelper = new TestRailHelper();
