import { HttpService } from '@nestjs/axios';
import { Controller, Get, Headers } from '@nestjs/common';
import { map } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  @Get('/verifyUser')
  async userVerify(@Headers() headers) {
    const token = headers.authorization.split(' ')[1];
    return this.httpService.get('http://localhost:3000/jwks').pipe(
      map(async (res) => {
        const jwkPair = res.data.find((current) => current.keyid === 'key1');
        const publicKey = jwkPair.publicKey;
        let verifiedUserDetails;
        await jwt.verify(
          token,
          publicKey,
          { algorithms: ['RS256'] },
          (err, decoded) => {
            verifiedUserDetails = { userName: decoded.userName };
          },
        );
        return verifiedUserDetails;
      }),
    );
  }
}
