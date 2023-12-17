import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from './sign-in.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SignInService {
  constructor(private httpService: HttpService) {}

  async signin(username: string, password: string): Promise<SignInDto> {
    const headersRequest = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService.post<SignInDto>(
          'https://development.industry-fusion.com/auth/realms/iff/protocol/openid-connect/token',
          {
            grant_type: 'password',
            client_id: 'scorpio',
            username: username,
            password: password,
          },
          {
            headers: headersRequest,
          },
        ),
      );
      return data;
    } catch (e) {
      throw new HttpException('authorization failed', HttpStatus.UNAUTHORIZED);
    }
  }
}
