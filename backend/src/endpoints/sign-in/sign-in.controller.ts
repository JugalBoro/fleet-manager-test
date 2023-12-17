import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { SignInService } from './sign-in.service';
import { HttpService } from '@nestjs/axios';
import { SignInDto } from './sign-in.dto';

@Controller('sign-in')
export class SignInController {
  constructor(private readonly signInService: SignInService) {}

  @Get(':username')
  signin(
    @Param('username') username: string,
    @Query('password') password: string,
  ): Promise<SignInDto> {
    const headersRequest = {
      'Content-Type': 'application/x-www-form-urlencoded', // afaik this one is not needed
    };

    try {
      const val = this.signInService.signin(username, password);
      return val;
    } catch (e) {
      throw new HttpException('authorization failed', HttpStatus.UNAUTHORIZED);
    }
  }
}
