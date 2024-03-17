import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


@Schema({collection: 'geocodes'})
export class Geocode {
    @Prop({
        type: Number,
        required: true,
        min: -180,
        max: 180
    })
    longitude: number;

    @Prop({
        type: Number,
        required: true,
        min: -90,
        max: 90
    })
    latitude: number;

    @Prop({
        type: String,
        required: true
    })
    address: string;

    @Prop({
        type: String,
        required: true
    })
    city: string;

    @Prop({
        type: String,
        required: true
    })
    state: string;

    @Prop({
        type: String,
        required: true
    })
    country: string;

    @Prop({
        type: String,
        required: true
    })
    postalCode: string;
}

export type GeocodeDocument = HydratedDocument<Geocode>;
export const GeocodeSchema = SchemaFactory.createForClass(Geocode);

