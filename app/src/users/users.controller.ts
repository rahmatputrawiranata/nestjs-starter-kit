import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDTO } from './dto/login.dto';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UsersController {

    constructor(private userService: UsersService) {}

    
    @Post('login')
    @ApiConsumes('application/json')
    @ApiBody({
        type: LoginDTO
    })
    @ApiResponse({
        status: 200,
        description: "The token is returned successfully.",
        schema: {
            type: "string",
            example: "eyJhbGciOi"
        }
    })
    async login(
        @Body() body: LoginDTO
    ): Promise<string> {
        return await this.userService.login(body.username, body.password)
    }

}
