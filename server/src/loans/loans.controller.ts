import {
  Controller,
  Post,
  UseInterceptors,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  FileTypeValidator,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Define your destination folder
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async processCsvFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: 'text/csv' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return { data: await this.loansService.processCsvFile(file.path) };
  }

  /*
  @Get()
  async findAll() {
    return { data: await this.loansService.findAll() };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loansService.findOne(+id);
  }*/

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return this.loansService.update(+id, updateLoanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loansService.remove(+id);
  }*/
}
