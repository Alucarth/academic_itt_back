import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException , HttpException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService    
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    return await this.usersService.findOne(email, password);
  }

  async login(user: any) {
    //try {
      /*const payload = { email: user.email, sub: user.id, role: user.role };
      return {
        ...payload,
        token: this.jwtService.sign(payload),
      };*/

     
      if(user.username != '5944242'){
         return ({
          "statusCode": 404,
          "message": [
            "Credenciales no coinciden  !!"
          ],
          "data": 0,
          "error": "Credenciales no coinciden  !!"
        });
      }

      const payload = { id: '82793', expiresIn: 60};

      return{
        statusCode: 200,
        user_id :82877,
        email: 'vallejos@gmail.com',
        username: 5944242,
        persona: 'Cristina Vallejos',
        roles: [
          {
            app_id: 1, 
            rol_id: 2  //tec sie nal       
          },
          {
            app_id: 2,
            rol_id: 5  // maestro
          },
        ],
         token: this.jwtService.sign(payload),
      }


    /*} catch (error) {
      throw new Error(`Error logging in ${error} user ${error.message}`);
    }*/
  }
}
