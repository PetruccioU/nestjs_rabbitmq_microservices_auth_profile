import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

describe('RolesController', () => {
  let rolesController: RolesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService],
    }).compile();

    rolesController = app.get<RolesController>(RolesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(rolesController.getHello()).toBe('Hello World!');
    });
  });
});
