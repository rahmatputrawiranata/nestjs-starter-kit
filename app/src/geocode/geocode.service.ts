import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { InjectModel } from '@nestjs/mongoose';
import { Geocode } from './geocode.schema';
import { Model } from 'mongoose';
import { CreateGeocodeDTO, ImportedGeocodeDTO } from './dto/fileUpload.dto';
@Injectable()
export class GeocodeService {

    constructor(@InjectModel(Geocode.name) private geocodeModel: Model<Geocode>) {}

    private validateGeocodeData(input: CreateGeocodeDTO): boolean {
        
        if (input.longitude < -180 || input.longitude > 180) {
            throw new HttpException('Invalid longitude', HttpStatus.BAD_REQUEST);
        }
        if (input.latitude < -90 || input.latitude > 90) {
            throw new HttpException('Invalid latitude', HttpStatus.BAD_REQUEST);
        }
        if(!input.address || input.address.length === 0) {
            throw new HttpException('Address is required', HttpStatus.BAD_REQUEST);
        }
        if(!input.city || input.city.length === 0) {
            throw new HttpException('City is required', HttpStatus.BAD_REQUEST);
        }
        if(!input.state || input.state.length === 0) {
            throw new HttpException('State is required', HttpStatus.BAD_REQUEST);
        }
        if(!input.country || input.country.length === 0) {
            throw new HttpException('Country is required', HttpStatus.BAD_REQUEST);
        }
        if(!input.postalCode || input.postalCode.length === 0) {
            throw new HttpException('Postal code is required', HttpStatus.BAD_REQUEST);
        }
        return true
    }

    async prcessValidateAndStoreGeocodeData(data: ImportedGeocodeDTO[]) {

        const transformedData: CreateGeocodeDTO[] = data.map(item => {
            return {
                longitude: item.Longitude,
                latitude: item.Latitude,
                address: item.Address,
                city: item.City,
                state: item.State,
                country: item.Country,
                postalCode: item.PostalCode
            }
        })

        const isValid = transformedData.every(item => {
            return this.validateGeocodeData(item)
        })
        if(!isValid) {
            throw new HttpException('Invalid longitude or latitude', HttpStatus.BAD_REQUEST)
        }

        await this.storeGeocodeData(transformedData);

        return {
            message: 'Geocode data imported successfully'
        }
    }

    async import(filePath: string) {
        try {
            const results: ImportedGeocodeDTO[] = [];
            
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', resolve)
                    .on('error', reject);
            })

            return await this.prcessValidateAndStoreGeocodeData(results);
        }catch(e) {
            if (e instanceof HttpException) {
                throw new HttpException(e.message, e.getStatus());
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }finally{
            fs.unlinkSync(filePath);
        }
    }

    async multipleImport(filePaths: string[]) {
        try {
            const results: ImportedGeocodeDTO[] = [];
            
            for (let i = 0; i < filePaths.length; i++) {
                await new Promise((resolve, reject) => {
                    fs.createReadStream(filePaths[i])
                        .pipe(csv())
                        .on('data', (data) => results.push(data))
                        .on('end', resolve)
                        .on('error', reject);
                })
                fs.unlinkSync(filePaths[i]);
            }

            return await this.prcessValidateAndStoreGeocodeData(results);
        }catch(e) {
            if (e instanceof HttpException) {
                throw new HttpException(e.message, e.getStatus());
            } else {
                throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    async storeGeocodeData(data: CreateGeocodeDTO[]) {
        await this.geocodeModel.insertMany(data);
    }

}
