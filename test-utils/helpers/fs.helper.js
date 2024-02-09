import fs from 'fs';
import { product } from '../../config';
import * as ignoredFilesForProd from '../../test-data/ignoredFiles.data.js';

let ignoredFilesData;

export default {
  files: [],

  getMainTestsDirectoryByConfigProduct() {
    // get needed directory based on product
    let mainDirectory;

    switch (product) {
      case 'BO':
        mainDirectory = 'e2e-bo/specs';
        break;
      case 'FO':
        mainDirectory = 'e2e-fo/specs';
        break;
      case 'Google Page Speed':
        mainDirectory = 'page-speed-specs/specs';
        break;
    }
    return mainDirectory;
  },

  getAllSpecFiles(specs) {
    const specsDirectoryPath = `${specs}`;
    // get all directories names from the main directory
    fs.readdirSync(specsDirectoryPath).forEach((fileName) => {
      if (!fileName.includes('.js')) {
        return this.getAllSpecFiles(specsDirectoryPath + '/' + fileName);
      }
      this.files.push(specsDirectoryPath + '/' + fileName);
    });
  },

  excludeFilesToRunOnProd() {
    if (product === 'BO') {
      ignoredFilesData = ignoredFilesForProd.bo;
    } else {
      ignoredFilesData = ignoredFilesForProd.fo;
    }

    if (process.env.ENV === 'prod') {
      ignoredFilesData.forEach((file) => {
        let index = this.files.indexOf(file);
        if (index !== -1) {
          this.files.splice(index, 1);
        }
      });
    }

    return this.files;
  },
};
