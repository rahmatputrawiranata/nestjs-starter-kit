import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './users.schema';

describe('UsersService', () => {
  let service: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn().mockResolvedValueOnce({ password: 'hashedPassword' })
          }
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token')
          }
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should return a JWT when loggin in', async() => {
    const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare' as any).mockResolvedValue(true);
    const result = await service.login('username', 'password');
    expect(result).toBe('token');
    expect(bcryptCompareSpy).toHaveBeenCalledWith('password', 'hashedPassword');
  });
});
