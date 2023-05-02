import { Controller, Get } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller()
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  // @Get()
  // getHello(): string {
  //   return this.tokenService.getHello();
  // }
}
