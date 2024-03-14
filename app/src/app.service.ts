import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  constructor (private readonly configService: ConfigService) {}

  getHello(): string {
    return `Welcome, This ${this.configService.get<string>('app_name')} is working!`;
  }
}
