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

  async validateUser(username: string, password: string): Promise<any> {
    console.log("password.........",password);
    const user = await this.usersService.findOne(username, password);
    return user;
  }


    async singUp(user: User) {
    console.log("usuario de auth service es:",user)
    const { id, ...rest } = user;
    const payload = { sub: id };
    console.log("auth.service payload", payload);
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

 async login(user: User) {
  console.log("userrrr",user);
  //async login(user: User) {
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
/*
      //se encontro el usuario, se comprueba el password
      const password_db = result[0].password;
      console.log('password_db: ',password_db);
      const isMatch = await bcrypt.compare(user.password,password_db );
      console.log('compara password: ',isMatch);

      if(!isMatch){

        return ({
          "statusCode": 404,
          "message": [
            "Password  No Coinciden !!"
          ],
          "data": 0,
          "error": "Password  No Coinciden !!"
        });

      }
*/
      const institutos = await this.userRepository.query(`
      SELECT
        maestro_inscripcion.id AS maestro_inscripcion_id, 
        maestro_inscripcion.persona_id, 
        maestro_inscripcion.cargo_tipo_id, 
        institucion_educativa_sucursal.id as institucion_educativa_sucursal_id, 
        institucion_educativa.id as institucion_educativa_id, 
        institucion_educativa.institucion_educativa, 
        cargo_tipo.cargo
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
        INNER JOIN
        cargo_tipo
        ON 
          maestro_inscripcion.cargo_tipo_id = cargo_tipo.id
      WHERE
        maestro_inscripcion.persona_id = ${result[0].persona_id} 
      `);

     console.log('institutos',institutos)

      let arrayData = []
      let arrayInstitutos = []
      for (let index = 0; index < institutos.length; index++) {     
        
        //por cada uno chekar el cargo y buscar el rol
        let arrayRoles = []
        
        let rol_tipo = '';
        let rol_txt = '';
        //verificar si la logica es correcta se adiciono el id: 6 cargo_tipo otros administrativos 
        switch( institutos[index]['cargo_tipo_id'] ) {
          case 2: 
          case 12:
          // case 6: 
            rol_tipo = '5';
            rol_txt = 'DIRECTOR';
            break;
          case 1:
            rol_tipo = '6';
            rol_txt = 'MAESTRA/O - DOCENTE';
            break;
        }
        console.log('rol_tipo',rol_tipo)
        const roles = await this.userRepository.query(`
          select count(*) as existe_rol from usuario_rol where usuario_id = ${result[0].user_id}  and rol_tipo_id = ${rol_tipo}
        `);
        console.log('roles', roles)
        if(roles[0]['existe_rol'] == 1){
          arrayRoles.push({rol_tipo_id: rol_tipo, rol: rol_txt})
        }

        arrayData.push(
          {
            ie_id:  institutos[index]['institucion_educativa_id'],
	          ie_sid:  institutos[index]['institucion_educativa_sucursal_id'],
            ie_nombre: institutos[index]['institucion_educativa'],
            roles: arrayRoles
          }
        )
        
      }
      
      //arrayData.push(arrayInstitutos);

      //si es alumno
      const alumnosinstitutos = await this.userRepository.query(`
      SELECT
        institucion_educativa_estudiante.id, 
        institucion_educativa.id as institucion_educativa_id, 
        institucion_educativa_estudiante.institucion_educativa_sucursal_id, 
        institucion_educativa_estudiante.persona_id, 
        institucion_educativa_sucursal.sucursal_codigo, 
        institucion_educativa.institucion_educativa
      FROM
        institucion_educativa_sucursal
        INNER JOIN
        institucion_educativa
        ON 
          institucion_educativa_sucursal.institucion_educativa_id = institucion_educativa."id"
        INNER JOIN
        institucion_educativa_estudiante
        ON 
          institucion_educativa_sucursal."id" = institucion_educativa_estudiante.institucion_educativa_sucursal_id
        where institucion_educativa_estudiante.persona_id = ${result[0].persona_id} 
      
      `);
      
      for (let index = 0; index < alumnosinstitutos.length; index++) {     
        let arrayRoles = []
        arrayRoles.push({rol_tipo_id: 7, rol: 'ESTUDIANTE'});

        arrayData.push(
          {
            ie_id:  alumnosinstitutos[index]['institucion_educativa_id'],
	          ie_sid:  alumnosinstitutos[index]['institucion_educativa_sucursal_id'],
            ie_nombre: alumnosinstitutos[index]['institucion_educativa'],
            roles: arrayRoles
          }
        )

      }
      


      //vemos si es DGESTTLA
      //TODO: habra superadmin ?

      const rolesDgesttla = await this.userRepository.query(`
      select count(*) as existe_rol from usuario_rol where usuario_id = ${result[0].user_id}  and rol_tipo_id = 8
      `);
      if(rolesDgesttla[0]['existe_rol'] == 1){
        arrayData.push(
          {
            ie_id:  0,
	          ie_sid:  0,
            ie_nombre: 'MINEDU',
            roles: [{
              rol_tipo_id: 8, 
              rol: 'DGESTTLA'
            }
            ]          
          }
        )
      }

      const payload = {
        id: result[0].user_id,
        //sub: result[0].user_id,
        rolid: 100,
        appid: 2,
        expiresIn: 60,
      };
      console.log("auth.service login payload", payload);
      return {
        statusCode: 200,
        gestion_tipo_id: 2023,
        user_id: result[0].user_id,
        p_id: result[0].persona_id,
        username: result[0].username,
        persona:  result[0].paterno + " " + result[0].materno + " " + result[0].nombre,
        institutos: arrayData,
        token: this.jwtService.sign(payload)  
      };


      
      /*
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
            p_id: result[0].persona_id,
            rolid: rol, //5,
            ie_id: instituto[0].institucion_educativa_sucursal_id,
            ie_sid: instituto[0].institucion_educativa_id,            
            appid: 2,
            expiresIn: 60,
          };

          return {
            statusCode: 200,
            user_id: result[0].user_id,
            p_id: result[0].persona_id,
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
      };*/


    /*} catch (error) {
      throw new Error(`Error logging in ${error} user ${error.message}`);
    }*/
  }
}
