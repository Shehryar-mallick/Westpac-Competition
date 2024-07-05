import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { mkdir } from 'fs/promises';
import path from 'path';

@Injectable()
export class LoansService {
  constructor() {
    mkdir('./uploads')
      .then(() => {
        console.log('Storage Created');
      })
      .catch(() => {
        console.log('Storage Already exists');
      });
  }
  /*
  create(createLoanDto: CreateLoanDto) {
    return 'This action adds a new loan';
  } 
  */

  async processCsvFile(filePath: string) {
    const process = spawn('python', [
      `${__dirname}/model/westpac_model_pipeline.py`,
      filePath,
    ]);

    process.stdout.on('data', (data) => {
      console.log(JSON.stringify(data, null, 2));
    });

    process.stderr.on('data', (data) => {
      console.error(data.toString());
    });
  }

  /*
  findOne(id: number) {
    return `This action returns a #${id} loan`;
  }

  update(id: number, updateLoanDto: UpdateLoanDto) {
    return `This action updates a #${id} loan`;
  }

  remove(id: number) {
    return `This action removes a #${id} loan`;
  }*/
}
