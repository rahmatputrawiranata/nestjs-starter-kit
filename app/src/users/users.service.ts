import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    async login(username: string, password: string): Promise<string> {
        
        const user = await this.userModel.findOne({username: username})
        
        if(!user) throw new HttpException('Invalid Username', 401)

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        
        if(!isPasswordMatch) throw new HttpException('Invalid Password', 401)
        
        const payload = {sub: user._id, username: user.username}
        
        return await this.jwtService.signAsync(payload)
    }
}
