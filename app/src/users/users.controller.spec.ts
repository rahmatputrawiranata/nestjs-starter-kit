import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let userController: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            login: jest.fn().mockResolvedValue('token')
          }
        }
      ]
    }).compile();

    userController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService );
  });

  it('should return a JWT when loggin in',async () => {
    const result = 'token';
    const loginDTO = {username: 'admin', password: 'admin'}

    jest.spyOn(userService, 'login').mockResolvedValue(result);
    expect(await userController.login(loginDTO)).toBe(result);
  });
});
