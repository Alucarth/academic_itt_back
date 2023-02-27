import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException , HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)private userRepository: Repository<User>  
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


      const result = await this.userRepository.query(`SELECT
        usuario.username, 
        usuario.persona_id, 
        usuario.activo, 		
        usuario.id as user_id,
        persona.carnet_identidad, 
        persona.complemento, 
        persona.paterno, 
        persona.materno, 
        persona.nombre, 
        persona.fecha_nacimiento, 
        persona.telefono, 
        persona.email
      FROM
        usuario
        INNER JOIN
        persona
        ON 
          usuario.persona_id = persona."id"
      WHERE
        username = '${user.username }' and password = '123456'`);
      
      console.log('result: ', result);
      console.log('result size: ', result.length);
     
      if(result.length === 0){
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
        user_id :result[0].user_id,        
        username: result[0].username,
        persona: result[0].paterno + ' ' +  result[0].materno + ' ' + result[0].nombre,
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
