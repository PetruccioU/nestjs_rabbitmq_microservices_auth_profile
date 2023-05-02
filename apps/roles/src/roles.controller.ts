import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // @Get()
  // getHello(): string {
  //   return this.rolesService.getHello();
  // }
}
