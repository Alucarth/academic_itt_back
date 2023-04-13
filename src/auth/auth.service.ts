import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException , HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import * as bcrypt from 'bcrypt';

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
        usuario.password,
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
        username = '${user.username }'`);
      
      console.log('result: ', result);
      console.log('result size: ', result.length);
     
      if(result.length === 0){
         return ({
          "statusCode": 404,
          "message": [
            "Credenciales No Coinciden !!"
          ],
          "data": 0,
          "error": "Credenciales No Coinciden !!"
        });
      }

      //se encontro el usuario, se comprueba el password
      const password_db = result[0].password;
      console.log('password_db: ',password_db);
      const isMatch = await bcrypt.compare(user.password,password_db );
      console.log('compara password: ',isMatch);

      if(!isMatch){

        return ({
          "statusCode": 404,
          "message": [
            "Credenciales No Coinciden !!"
          ],
          "data": 0,
          "error": "Credenciales No Coinciden !!"
        });

      }

      

      const payload = { id:result[0].user_id , rolid:100, appid: 2, expiresIn: 60};

      //los roles del usuario
      const result_roles = await this.userRepository.query(`
      SELECT	
					usuario_rol.rol_tipo_id, rol_tipo.rol
				FROM
					usuario
					INNER JOIN
					usuario_rol
					ON 
						usuario.id = usuario_rol.usuario_id
					INNER JOIN
					rol_tipo
					ON 
						usuario_rol.rol_tipo_id = rol_tipo.id					
					where usuario.id = ${ result[0].user_id }`);

      return{
        statusCode: 200,
        user_id :result[0].user_id,        
        username: result[0].username,
        persona: result[0].paterno + ' ' +  result[0].materno + ' ' + result[0].nombre,
        roles: result_roles,
        token: this.jwtService.sign(payload),
      }


    /*} catch (error) {
      throw new Error(`Error logging in ${error} user ${error.message}`);
    }*/
  }
}
