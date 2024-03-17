import { ApiProperty } from "@nestjs/swagger";

export class LoginDTO {

    @ApiProperty({ description: 'The username of the user.', default: 'admin' })
    username: string;

    @ApiProperty({ description: 'The username of the user.', default: 'admin' })
    password: string;
}