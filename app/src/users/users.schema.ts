import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({collection: 'users'})
export class User {
    @Prop({
        type: String,
        required: true
    })
    username: string;

    @Prop({
        type: String,
        required: true
    })
    password: string;
}

export type UserSchema = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
