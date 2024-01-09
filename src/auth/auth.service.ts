import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import * as bcrypt from 'bcrypt';

import { ConfigService } from '@nestjs/config';
import { UsuarioRolService } from 'src/academico/modulos/usuario_rol/usuario_rol.service';
import { UsuarioRol } from 'src/users/entity/usuarioRol.entity';
import { UsuarioRolInstitucionEducativaService } from 'src/academico/modulos/usuario_rol_institucion_educativa/usuario_rol_institucion_educativa.service';
import { lstat } from 'fs';
import { UnidadTerritorialUsuarioRolService } from 'src/academico/modulos/unidad_territorial_usuario_rol/unidad_territorial_usuario_rol.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usuarioRolService: UsuarioRolService,
    private readonly usuarioRolInsitucionEducativaService: UsuarioRolInstitucionEducativaService,
    private readonly unidadTerritorialUsuarioRolService: UnidadTerritorialUsuarioRolService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,

  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    console.log("password.........", password);
    const user = await this.usersService.findOne(username, password);
    return user;
  }


  async singUp(user: User) {
    console.log("usuario de auth service es:", user)
    const { id, ...rest } = user;
    const payload = { sub: id };
    console.log("auth.service payload", payload);
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async login(user: User) {


    console.log("usuario autentificado", user);
    const roles = await this.usuarioRolService.findByUserId(user.id)
    const person = (await this.usersService.getById(user.id))?.persona
    console.log('obteniendo roles')
    const institutions = []
    const generalBag = []
    const unidadTerritorial = []
    await Promise.all(roles.map(async (user_rol) => {
      let instituciones = await this.usuarioRolInsitucionEducativaService.findByUsuarioRolId(user_rol.id)
      
      //for unidad_territorial_id
      let unidad_territorial_rol = await this.unidadTerritorialUsuarioRolService.findByUsuarioRolId(user_rol.id)
      await Promise.all(unidad_territorial_rol.map((unidad)=>{
        unidadTerritorial.push(unidad.unidadTerritorial)
      }))

      await Promise.all(instituciones.map(async (instituto) => {
        console.log('sucursal', instituto)
        generalBag.push({
          ie_id: instituto.institucionEducativaSucursal.institucionEducativa.id,
          ie_sid: parseInt(instituto.institucionEducativaSucursalId + ""),
          ie_nombre: instituto.institucionEducativaSucursal.institucionEducativa.institucionEducativa,
          ie_sucursal: instituto.institucionEducativaSucursal.sucursalNombre,
          rol_tipo_id: user_rol.rolTipoId,
          rol: user_rol.rolTipo.rol
        })
        let sucursal_id = parseInt(instituto.institucionEducativaSucursalId + "")
        let finded = false
        await Promise.all(institutions.map((institution) => {
          console.log('sid', institution)
          if (sucursal_id === institution) {
            finded = true
          }
        }))

        if (!finded) {
          institutions.push(sucursal_id)
        }


      }))

      if (instituciones.length === 0) //en caso de que no pertenescan a ninguna instituticon se le accina por defecto MINEDU
      {
        generalBag.push(({
          ie_id: 0,
          ie_sid: 0,
          ie_nombre: 'MINEDU',
          ie_sucursal: '',
          rol_tipo_id: user_rol.rolTipoId,
          rol: user_rol.rolTipo.rol
        }))
        institutions.push(0)
      }

      // console.log('instituciones ---------->',instituciones, user_rol)

    }))

    console.log('generalBag ', generalBag)
    console.log('uniques', institutions)

    // for unidad territorial
    

    
    const payload = {
      id: user.id,
      // sub: user.id,
      rolid: 100,
      appid: 2,
      expiresIn: 60,
    };

    let response = {
      statusCode: 200,
      gestion_tipo_id: 2023,
      user_id: user.id,
      p_id: user.personaId,
      username: user.username,
      persona: `${person.paterno} ${person.materno} ${person.nombre}`,
      institutos: [],
      unidadTerritorial: unidadTerritorial,
      token: this.jwtService.sign(payload) 
    }
    await Promise.all(institutions.map(async (sucursal_id) => {
      //todo: aqui armar respuesta para envio final con los parametros similares a los que se envia en la ultima estructura de roles armados
      let user_rol = {
        ie_id: 0,
        ie_sid: 0,
        ie_nombre: '',
        ie_sucursal: '',
        roles: []
      }

      await Promise.all(generalBag.map((general_rol) => {
        if (general_rol.ie_sid === sucursal_id) {
          user_rol.ie_id = general_rol.ie_id
          user_rol.ie_sid = general_rol.ie_sid
          user_rol.ie_nombre = general_rol.ie_nombre
          user_rol.ie_sucursal = general_rol.ie_sucursal
          user_rol.roles.push({
            rol_tipo_id: general_rol.rol_tipo_id,
            rol: general_rol.rol
          })
        }
      }))

      response.institutos.push(user_rol)

    }))

    return response
    // const result = await this.userRepository.query(`SELECT
    //   usuario.username, 
    //   usuario.persona_id, 
    //   usuario.activo, 		
    //   usuario.password,
    //   usuario.id as user_id,
    //   persona.carnet_identidad, 
    //   persona.complemento, 
    //   persona.paterno, 
    //   persona.materno, 
    //   persona.nombre, 
    //   persona.fecha_nacimiento, 
    //   persona.telefono, 
    //   persona.email        
    // FROM|
    //   usuario
    //   INNER JOIN
    //   persona
    //   ON 
    //     usuario.persona_id = persona."id"
    // WHERE
    //   username = '${user.username }'`);

    // console.log('result: ', result);
    // console.log('result size: ', result.length);

    // if(result.length === 0){
    //    return ({
    //     "statusCode": 404,
    //     "message": [
    //       "Credenciales No Coinciden !!"
    //     ],
    //     "data": 0,
    //     "error": "Credenciales No Coinciden !!"
    //   });
    // }

    //   const institutos = await this.userRepository.query(`
    //   SELECT
    //     maestro_inscripcion.id AS maestro_inscripcion_id, 
    //     maestro_inscripcion.persona_id, 
    //     maestro_inscripcion.cargo_tipo_id, 
    //     institucion_educativa_sucursal.id as institucion_educativa_sucursal_id, 
    //     institucion_educativa.id as institucion_educativa_id, 
    //     institucion_educativa.institucion_educativa, 
    //     cargo_tipo.cargo
    //   FROM
    //     maestro_inscripcion
    //     INNER JOIN
    //     institucion_educativa_sucursal
    //     ON 
    //       maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
    //     INNER JOIN
    //     institucion_educativa
    //     ON 
    //       institucion_educativa_sucursal.institucion_educativa_id = institucion_educativa.id
    //     INNER JOIN
    //     cargo_tipo
    //     ON 
    //       maestro_inscripcion.cargo_tipo_id = cargo_tipo.id
    //   WHERE
    //     maestro_inscripcion.persona_id = ${result[0].persona_id} 
    //   `);

    //  console.log('institutos',institutos)

    //   let arrayData = []
    //   let arrayInstitutos = []
    //   for (let index = 0; index < institutos.length; index++) {     

    //     //por cada uno chekar el cargo y buscar el rol
    //     let arrayRoles = []

    //     let rol_tipo = '';
    //     let rol_txt = '';
    //     //verificar si la logica es correcta se adiciono el id: 6 cargo_tipo otros administrativos 
    //     switch( institutos[index]['cargo_tipo_id'] ) {
    //       case 2: 
    //       case 12:
    //       // case 6: 
    //         rol_tipo = '5';
    //         rol_txt = 'DIRECTOR';
    //         break;
    //       case 1:
    //         rol_tipo = '6';
    //         rol_txt = 'MAESTRA/O - DOCENTE';
    //         break;
    //     }
    //     console.log('rol_tipo',rol_tipo)
    //     const roles = await this.userRepository.query(`
    //       select count(*) as existe_rol from usuario_rol where usuario_id = ${result[0].user_id}  and rol_tipo_id = ${rol_tipo}
    //     `);
    //     console.log('roles', roles)
    //     if(roles[0]['existe_rol'] == 1){
    //       arrayRoles.push({rol_tipo_id: rol_tipo, rol: rol_txt})
    //     }

    //     arrayData.push(
    //       {
    //         ie_id:  institutos[index]['institucion_educativa_id'],
    //         ie_sid:  institutos[index]['institucion_educativa_sucursal_id'],
    //         ie_nombre: institutos[index]['institucion_educativa'],
    //         roles: arrayRoles
    //       }
    //     )

    //   }

    //arrayData.push(arrayInstitutos);

    //si es alumno
    // const alumnosinstitutos = await this.userRepository.query(`
    // SELECT
    //   institucion_educativa_estudiante.id, 
    //   institucion_educativa.id as institucion_educativa_id, 
    //   institucion_educativa_estudiante.institucion_educativa_sucursal_id, 
    //   institucion_educativa_estudiante.persona_id, 
    //   institucion_educativa_sucursal.sucursal_codigo, 
    //   institucion_educativa.institucion_educativa
    // FROM
    //   institucion_educativa_sucursal
    //   INNER JOIN
    //   institucion_educativa
    //   ON 
    //     institucion_educativa_sucursal.institucion_educativa_id = institucion_educativa."id"
    //   INNER JOIN
    //   institucion_educativa_estudiante
    //   ON 
    //     institucion_educativa_sucursal."id" = institucion_educativa_estudiante.institucion_educativa_sucursal_id
    //   where institucion_educativa_estudiante.persona_id = ${result[0].persona_id} 

    // `);

    // for (let index = 0; index < alumnosinstitutos.length; index++) {     
    //   let arrayRoles = []
    //   arrayRoles.push({rol_tipo_id: 7, rol: 'ESTUDIANTE'});

    //   arrayData.push(
    //     {
    //       ie_id:  alumnosinstitutos[index]['institucion_educativa_id'],
    //       ie_sid:  alumnosinstitutos[index]['institucion_educativa_sucursal_id'],
    //       ie_nombre: alumnosinstitutos[index]['institucion_educativa'],
    //       roles: arrayRoles
    //     }
    //   )

    // }



    //vemos si es DGESTTLA
    //TODO: habra superadmin ?

    // const rolesDgesttla = await this.userRepository.query(`
    // select count(*) as existe_rol from usuario_rol where usuario_id = ${result[0].user_id}  and rol_tipo_id = 8
    // `);
    // if(rolesDgesttla[0]['existe_rol'] == 1){
    //   arrayData.push(
    //     {
    //       ie_id:  0,
    //       ie_sid:  0,
    //       ie_nombre: 'MINEDU',
    //       roles: [{
    //         rol_tipo_id: 8, 
    //         rol: 'DGESTTLA'
    //       }
    //       ]          
    //     }
    //   )
    // }

    // const payload = {
    //   id: result[0].user_id,
    //   //sub: result[0].user_id,
    //   rolid: 100,
    //   appid: 2,
    //   expiresIn: 60,
    // };
    // console.log("auth.service login payload", payload);
    // return {
    //   statusCode: 200,
    //   gestion_tipo_id: 2023,
    //   user_id: result[0].user_id,
    //   p_id: result[0].persona_id,
    //   username: result[0].username,
    //   persona:  result[0].paterno + " " + result[0].materno + " " + result[0].nombre,
    //   institutos: arrayData,
    //   token: this.jwtService.sign(payload)  
    // };



  }
}
