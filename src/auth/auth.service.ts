import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException , HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
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

      

      //const payload = { id:result[0].user_id , rolid:100, appid: 2, expiresIn: 60};

      //los roles del usuario
      //OJO:  UN ROL UN USUARIO POR AHORA
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

      // datos de la ue
      let es_director = false;
      let es_maestro = false;
      for(let i=0; i< result_roles.length; i++ ){
        if(result_roles[i].rol_tipo_id == 5 ){
          es_director = true;
        }
        if(result_roles[i].rol_tipo_id == 6 ){
          es_maestro = true;
        }
      }

      if(es_director === true || es_maestro == true) {        
        console.log('es_director o maestro: ', es_director);
        console.log('persona', result[0].persona_id);
        //TODO: aumentar gestion ?
        let rol = 0
        if (es_director === true) { rol = 5; }
        if (es_maestro === true) { rol = 6; }

        const instituto = await this.userRepository.query(`
            SELECT
              maestro_inscripcion.id, 
              maestro_inscripcion.persona_id, 
              maestro_inscripcion.institucion_educativa_sucursal_id, 
              institucion_educativa.id as institucion_educativa_id, 
              institucion_educativa.institucion_educativa
            FROM
              maestro_inscripcion
              INNER JOIN
              institucion_educativa_sucursal
              ON 
                maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
              INNER JOIN
              institucion_educativa
              ON 
                institucion_educativa_sucursal.institucion_educativa_id = institucion_educativa.id
              where maestro_inscripcion.persona_id = ${result[0].persona_id}
          `);
        console.log('instituto: ', instituto);
        if(instituto.length == 1){

          const payload = {
            id: result[0].user_id,
            rolid: rol, //5,
            p_id: result[0].persona_id,
            ie_id: instituto[0].institucion_educativa_sucursal_id,
            ie_sid: instituto[0].institucion_educativa_id,            
            appid: 2,
            expiresIn: 60,
          };

          return {
            statusCode: 200,
            user_id: result[0].user_id,
            username: result[0].username,
            persona:
              result[0].paterno +
              " " +
              result[0].materno +
              " " +
              result[0].nombre,
            roles: result_roles,
            ie_id: instituto[0].institucion_educativa_id,
            ie_sid: instituto[0].institucion_educativa_sucursal_id,
            ie_nombre: instituto[0].institucion_educativa,
            gestion_tipo_id: 2023,
            ie_tipo: "FISCAL",
            token: this.jwtService.sign(payload),
          };

        }



      }

      const payload = {
        id: result[0].user_id,
        rolid: 100,
        appid: 2,
        expiresIn: 60,
      };

      return {
        statusCode: 200,
        user_id: result[0].user_id,
        p_id: result[0].persona_id,
        username: result[0].username,
        persona:
          result[0].paterno + " " + result[0].materno + " " + result[0].nombre,
        roles: result_roles,
        ie_id: 80730841,
        ie_sid: 1542750,
        gestion_tipo_id: 2023,
        ie_nombre:
          "INSTITUTO TECNOLÓGICO - ESCUELA INDUSTRIAL SUPERIOR PEDRO DOMINGO MURILLO",
        ie_tipo: "FISCAL",
        token: this.jwtService.sign(payload),
      };


    /*} catch (error) {
      throw new Error(`Error logging in ${error} user ${error.message}`);
    }*/
  }
}
