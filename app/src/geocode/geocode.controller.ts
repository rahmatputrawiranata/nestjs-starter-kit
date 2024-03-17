import { Controller, ParseFilePipeBuilder, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import * as multer from 'multer';
import { FileUploadDTO } from './dto/fileUpload.dto';
import { GeocodeService } from './geocode.service';
import { UserGuard } from 'src/users/user.guard';

@ApiTags('geocode')
@Controller('geocode')
export class GeocodeController {


    constructor(private readonly geocodeService: GeocodeService) {}

    @UseGuards(UserGuard)
    @Post('single-import')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'CSV file to import',
        type: FileUploadDTO
    })
    @ApiBearerAuth()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: multer.diskStorage({
                destination: './storages/temp/geocode',
                filename: (_, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => (Math.round(Math.random() * 16)).toString(16))
                        .join('');
                    const extension = file.originalname.split('.').pop();
                    return cb(null, `${randomName}.${extension}`)
                }
            })
        })
    )
    async import(
        @UploadedFile(
            new ParseFilePipeBuilder()
                    .addFileTypeValidator({
                        fileType: 'csv',
                    })
                    .build()
        ) file: Express.Multer.File
    ): Promise<{
        message: string
    }> {
        await this.geocodeService.import(file.path);
        return {
            message: 'File imported successfully'
        }
    }

    @UseGuards(UserGuard)
    @Post('bulk-import')
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @ApiBody({
        required: true,
        schema: {
          type: "object",
          properties: {
            files: {
              type: "array",
              items: {
                type: "string",
                format: "binary"
              }
            }
          }
        }
      })
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: multer.diskStorage({
                destination: './storages/temp/geocode',
                filename: (_, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => (Math.round(Math.random() * 16)).toString(16))
                        .join('');
                    const extension = file.originalname.split('.').pop();
                    return cb(null, `${randomName}.${extension}`)
                }
            })
        })
    )
    async multipleImport(
        @UploadedFiles(
            new ParseFilePipeBuilder()
                    .addFileTypeValidator({
                        fileType: 'csv',
                    })
                    .build()
        ) files: Array<Express.Multer.File>
    ): Promise<{
        message: string
    }> {
        const paths = files.map(file => file.path);
        await this.geocodeService.multipleImport(paths);
        return {
            message: 'File imported successfully'
        }
    }


}
