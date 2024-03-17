import { ApiProperty } from "@nestjs/swagger";

export class FileUploadDTO {
    @ApiProperty({type: 'string', format: 'binary'})
    file: any;
}

export class CreateGeocodeDTO {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export class ImportedGeocodeDTO {
    Longitude: number;
    Latitude: number;
    Address: string;
    City: string;
    State: string;
    Country: string;
    PostalCode: string;
}