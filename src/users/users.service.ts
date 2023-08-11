import { HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/users.entity';
import { UsuarioRol } from './entity/usuarioRol.entity';
import { UnidadTerritorialUsuarioRolAppMenu } from './entity/unidadTerritorialUsuarioRolAppMenu.entity';
import * as bcrypt from 'bcrypt';
import { Client } from 'pg';
import { NotFoundException , HttpException} from '@nestjs/common';
import { EntityManager, getConnection, getManager } from 'typeorm';
import { UsuarioUniTerrRol } from './entity/usuarioUniTerrRol.entity';
import { UnidadTerritorialUsuarioRolApp } from '../academico/entidades/unidadTerritorialUsuarioRolApp.entity';

import { RespuestaSigedService } from '../shared/respuesta.service'
import { PersonaService } from './persona/persona.service'
import { PersonaBusquedaCiFechaNacDTO, PersonaMReadDto } from './dto/persona.dto'
import { CreaPersonaDTO } from './dto/crea-persona.dto';
import { Persona } from './entity/persona.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from "@nestjs/jwt";

import { AppTipo } from "../academico/entidades/appTipo.entity";
import { SegipService } from "src/segip/segip.service";
import { RolTipo } from 'src/academico/entidades/rolTipo.entity';



@Injectable()
export class UsersService {
  logger: Logger;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Persona) private personaRepository: Repository<Persona>,
    @InjectRepository(AppTipo) private appRepository: Repository<AppTipo>,
    @InjectRepository(RolTipo) private rolTipoRepository: Repository<RolTipo>,
    @InjectRepository(UsuarioUniTerrRol)
    private uturRepository: Repository<UsuarioUniTerrRol>,
    private _serviceResp: RespuestaSigedService,
    private _servicePersona: PersonaService,
    private jwtService: JwtService,
    private readonly segipService: SegipService
  ) {
    this.logger = new Logger();
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new User();
      const hashPassword = await bcrypt.hash(createUserDto.password, 10);
      user.username = createUserDto.username;
      // user.email = createUserDto.email;
      user.password = hashPassword;
      //user.role = createUserDto.role;
      return this.userRepository.save(user);
    } catch (err) {
      throw new Error(`Error creating ${err} user ${err.message}`);
    }
  }

  async getOne(id: number, userEntity?: User) {
    const user = await this.userRepository.findOneBy({'id':id})
      .then(u => (!userEntity ? u : !!u && userEntity.id === u.id ? u : null));
    console.log("usuario es", user)
    if (!user)
      throw new NotFoundException('Usuario no existe o no esta autorizado');

    return user;
  }

  async findOne(username: string, password: string): Promise<User | undefined> {
    console.log("findOne");
    try {
      //let id = 100;
      const user = await this.userRepository.findOneBy({'username': username});
      if(!user){
        throw new Error(`Nombre de Usuario no existe`);
      }
      //console.log(user);
      const isMatch = await bcrypt.compare(password, user.password);
      if (user && isMatch) {
        return user;
      } else {
        throw new Error(`Contraseña no coinciden`);
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  async getAllBySearch(ci: string, fechanac: string, complemento: string) {
    //const result = await this.userRepository.query(`SELECT count(*) FROM us_lex`);

    /*const result = await this.userRepository
    .createQueryBuilder("a")
    .take(10)
    .getMany();*/

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
      carnet_identidad = '${ci}' and fecha_nacimiento = '${fechanac}'`);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      //throw new NotFoundException('No se encontraron registros');
      return {
        statusCode: 201,
        message: ["Registro No Encontrado !!"],
        data: [],
        code: "",
      };
    }

    //return result;
    return {
      statusCode: 201,
      message: ["Registro Encontrado !!"],
      data: result,
      code: "",
    };
  }

  async getAllRoles() {
    const result = await this.userRepository.query(`SELECT
      id, rol
    FROM
      rol_tipo order by 2`);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      throw new NotFoundException("No se encontraron registros");
    }

    return this._serviceResp.respuestaHttp201(
      result,
      "Registro Encontrado !!",
      ""
    );

    //return result;
  }

  async getAllRolesByUserId(userId: number) {
    const result = await this.userRepository.query(`SELECT
      usuario."id", 
      usuario_rol.id as usuario_rol_id,
      usuario_rol.rol_tipo_id, 
      rol_tipo."id", 
      rol_tipo.rol, 
      rol_tipo.activo
    FROM
      usuario
      INNER JOIN
      usuario_rol
      ON 
        usuario."id" = usuario_rol.usuario_id
      INNER JOIN
      rol_tipo
      ON 
        usuario_rol.rol_tipo_id = rol_tipo."id"
        where usuario.id = ${userId}`);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      throw new NotFoundException("No se encontraron registros");
    }

    return this._serviceResp.respuestaHttp201(
      result,
      "",
      "Registro Encontrado !!"
    );

    //return result;
  }

  async getAllUtByUserRolId(urid: number) {
    const result = await this.userRepository
      .query(`select * from unidad_territorial_usuario_rol utur 
        inner join unidad_territorial ut on ut.id = utur.unidad_territorial_id 
        where utur.usuario_rol_id=${urid};`);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      console.log("not found");
      return this._serviceResp.respuestaHttp404(
        "",
        "",
        "Registro No Encontrado !!"
      );
    }

    //return result;
    return this._serviceResp.respuestaHttp201(
      result,
      "",
      "Registro Encontrado !!"
    );
  }

  async getAllNewRolesByUserId(userId: number) {
    //subiendo todo nuevamente

    /*await this.userRepository
                .createQueryBuilder()
                .update(User)
                .set({username:'test' })
                .where("id = :userId", { userId: 44590 })
                .execute();
    
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
          { firstName: "Timber", lastName: "Saw" },
          { firstName: "Phantom", lastName: "Lancer" },
      ])
      .execute()*/

    const result = await this.userRepository.query(`
    select * from rol_tipo 
    where id not in
    (
    SELECT
      	usuario_rol.rol_tipo_id	
    FROM
      usuario
      INNER JOIN
      usuario_rol
      ON 
        usuario."id" = usuario_rol.usuario_id
      INNER JOIN
      rol_tipo
      ON 
        usuario_rol.rol_tipo_id = rol_tipo."id"
        where usuario.id = ${userId})`);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      throw new NotFoundException("No se encontraron registros");
    }

    return this._serviceResp.respuestaHttp201(
      result,
      "Registro Encontrado !!",
      ""
    );
    //return result;
  }

  async insertNewRolUser(userId: number, rolTipoId: number) {
    //TODO VALIDAR SI YA EXISTE
    try {
      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(UsuarioRol)
        .values([{ usuario_id: userId, rol_tipo_id: rolTipoId, activo: true }])
        .execute();

      console.log("rol adicionado");
      //return 1;
      return this._serviceResp.respuestaHttp201(null, "Registro Creado !!", "");
    } catch (error) {
      console.log("Error insertar nuevo rol usuario: ", error);
      return this._serviceResp.respuestaHttp409(
        null,
        "Dato/Recurso Inexistente !!",
        error.driverError.detail
      );
    }
  }

  async insertNewUnidadTerritorialUser(
    userRolId: number,
    unidadTerrId: number,
    fechaInicio: string,
    fechaFin: string,
    userId: number,
    apps: []
  ) {
    for (let i = 0; i < apps.length; i++) {
      const appTipo = await this.appRepository.findOne({
        where: { id: apps[i] },
      });

      if (!appTipo) {
        return this._serviceResp.respuestaHttp404(
          apps[i],
          "AppId No Existe !!",
          ""
        );
      }
    }

    try {
      var parsedDate = Date.parse(fechaInicio);
      console.log(parsedDate);
      //valida fecha en formato yyyy-mm-dd
      if (isNaN(parsedDate)) {
        console.log("error fecha inicio");
        //return { 'status': 0, 'mensaje': 'Error en fecha'}
        //return new HttpException('No available fuel stations', HttpStatus.NOT_FOUND);
        //throw new NotFoundException('No se encontraron registros');
      }

      var parsedDate = Date.parse(fechaFin);
      console.log(parsedDate);
      //valida fecha en formato yyyy-mm-dd
      if (isNaN(parsedDate)) {
        console.log("error fechaFin");
        //return { 'status': 0, 'mensaje': 'Error en fecha'}
        //return new HttpException('No available fuel stations', HttpStatus.NOT_FOUND);
        //throw new NotFoundException('No se encontraron registros');
      }

      const nuevoRegistro = await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(UsuarioUniTerrRol)
        .values([
          {
            unidad_territorial_id: unidadTerrId,
            usuario_rol_id: userRolId,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            usuario_id: userId,
          },
        ])
        .execute();

      let idCreado = nuevoRegistro.identifiers[0].id;
      const nuevoUTRol = await this.uturRepository.findOne({
        where: { id: idCreado },
      });

      for (let i = 0; i < apps.length; i++) {
        const appTipo = await this.appRepository.findOne({
          where: { id: apps[i] },
        });

        await this.userRepository
          .createQueryBuilder()
          .insert()
          .into(UnidadTerritorialUsuarioRolApp)
          .values([
            {
              appTipo: appTipo,
              usuarioId: 1,
              unidadTerritorialUsuarioRol: nuevoUTRol,
            },
          ])
          .execute();
      }

      console.log("Unidad Territorial adicionada");
      //return 1;
      return this._serviceResp.respuestaHttp201(
        nuevoUTRol,
        "Registro Creado !!",
        ""
      );
    } catch (error) {
      console.log("Error insertar nueva Unidad Territorial: ", error);
      //throw new Error(`Error insertar nueva Unidad Territorial: ${error.message}`);
      //throw new HttpException('Error en la operacion: ', error.message);
      //throw new HttpException(new Error(`Error insertar nueva Unidad Territorial: ${error.message}`), HttpStatus.BAD_REQUEST)
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error insertar nueva Unidad Territorial: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
      //return 0;
    }
  }

  async getPersonaBySearch(ci: string, fechanac: string, complemento: string) {
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
      carnet_identidad = '${ci}' and fecha_nacimiento = '${fechanac}'`);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      return 0;
    }

    return result;
  }

  async createNewUser(dto: CreateUserDto) {
    //1:BUSCAR LA PERSONA

    /*this.logger.log('log');
    this.logger.error('error');
    this.logger.debug('debug');
    this.logger.warn('warn');*/

    try {
      /*let persona = await this.getPersonaBySearch(
        dto.carnet,
        dto.fechaNacimiento,
        dto.complemento
      );*/

      const persona = await this.personaRepository.findOne({
        where: {
          //id: 33013287,
          carnetIdentidad: dto.carnet,
          complemento: dto.complemento,
          paterno: dto.paterno,
          materno: dto.materno,
          nombre: dto.nombres,
          //TODO: fechaNacimiento: dto.fechaNacimiento
        },
      });
     
      //dto.tipoCarnet = 1 NACIONAL, 2 EXTRANJERO;

      // SI LA PERSONA YA EXISTE, PASA SIN VALIDACION, SE ENTIENDE QUE
      //SUS DATOS SON VALIDOS
      if (!persona) {
        // se debe crear la persona, antes se VALIDA SEGIP
        let arrayaux = dto.fechaNacimiento.split("-");
        //console.log(arrayaux);
        const fechaSegip = arrayaux[2] + "/" + arrayaux[1] + "/" + arrayaux[0];
        //console.log("fechaSegip", fechaSegip);

        const personasegip = {
          nombres: dto.nombres.toUpperCase(),
          paterno: dto.paterno.toUpperCase(),
          materno: dto.materno.toUpperCase(),
          ci: dto.carnet,
          fechaNacimiento: fechaSegip, //'19/02/2014 ',
          complemento: dto.complemento,
        };
        //console.log("personasegip", personasegip);

        const segipdata = await this.segipService.contrastar(
          personasegip,
          dto.tipoCarnet
        );
        //console.log("segipdata", segipdata);
        if (segipdata["finalizado"] === false) {
          return { message: "Datos SEGIP no corresponden", segipdata };
        }
        console.log("CONSTRASTACION VALIDA");
        //si NO existe la persona, se crea el usuario, que por regla de base de datos
        //NO deberia existir

        const nuevaPersona = await this.userRepository
          .createQueryBuilder()
          .insert()
          .into(Persona)
          .values([
            {
              carnetIdentidad: dto.carnet,
              complemento: dto.complemento,
              paterno: dto.paterno,
              materno: dto.materno,
              nombre: dto.nombres,
              fechaNacimiento: dto.fechaNacimiento,
              generoTipoId: dto.generoTipoId,
              sangreTipoId: dto.sangreTipoId,
              maternoIdiomaTipoId: dto.maternoIdiomaTipoId,
              expedidoUnidadTerritorialId: dto.expedidoUnidadTerritorialId,
              nacimientoUnidadTerritorialId: dto.nacimientoUnidadTerritorialId,
              dobleNacionalidad: dto.dobleNacionalidad,
              tieneDiscapacidad: dto.tieneDiscapacidad,
              segipTipoId: 1, //verificado segip
            },
          ])
          .returning("id")
          .execute();

        console.log("nueva persona id: ", nuevaPersona.identifiers[0].id);
        const persona_id = nuevaPersona.identifiers[0].id;

        //TODO: el password por defecto es const password = '123456';
        const hashPassword = await bcrypt.hash("123456", 10);

        //creamos el usuario
        await this.userRepository
          .createQueryBuilder()
          .insert()
          .into(User)
          .values([
            {
              personaId: persona_id,
              username: dto.carnet,
              password: hashPassword,
              activo: true,
            },
          ])
          .execute();

        return this._serviceResp.respuestaHttp201(
          nuevaPersona.identifiers[0].id,
          "Registro Creado !!",
          ""
        );
      } else {
        //la persona ya existe, verificamos si existe el usuario
        // OJO, no deberia tener mas de un usuario (REGLA DE BASE DATOS)

        const roles = await this.userRepository.query(`
        select count(*) as existe from usuario where persona_id = ${persona.id}  `);

        //console.log("personaid", persona.id);
        //console.log('roles', roles);

        if (roles[0].existe == 0) {
          // no existe el usuario, se crea
          const hashPassword = await bcrypt.hash("123456", 10);

          await this.userRepository
            .createQueryBuilder()
            .insert()
            .into(User)
            .values([
              {
                personaId: persona.id,
                username: dto.carnet,
                password: hashPassword,
                activo: true,
              },
            ])
            .execute();

          return this._serviceResp.respuestaHttp201(
            persona.id,
            "Registro Creado !!",
            ""
          );
        } else {
          return this._serviceResp.respuestaHttp400(
            null,
            "Usuario y Persona ya existen !!",
            ""
          );
        }
      }

      //return this._serviceResp.respuestaHttp200(300, '','mensaje');
      return this._serviceResp.respuestaHttp201(
        //persona.identifiers[0].id,
        "Registro Creado !!",
        ""
      );
    } catch (error) {
      console.log("Error insertar persona/usuario: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `xError insertar nueva Unidad Territorial: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
      //return 0;
    }
  }

  async getAllGeneroTipo() {
    const result = await this.userRepository.query(`
    select id,genero from genero_tipo where id in (1,2) order by 1
    `);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      throw new NotFoundException("No se encontraron registros");
    }

    //return result;
    return {
      statusCode: 201,
      message: [""],
      data: result,
      code: "",
    };
  }

  async getAllSangreTipo() {
    const result = await this.userRepository.query(`
    select id,sangre from sangre_tipo order by 1
    `);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      throw new NotFoundException("No se encontraron registros");
    }

    //return result;
    return {
      statusCode: 201,
      message: [""],
      data: result,
      code: "",
    };
  }

  async getAllEstadoCivilTipo() {
    const result = await this.userRepository.query(`
    select id,estado_civil from estado_civil_tipo order by 1
    `);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      throw new NotFoundException("No se encontraron registros");
    }

    //return result;
    return {
      statusCode: 201,
      message: ["Registro Encontrado !!"],
      data: result,
      code: "",
    };
  }

  async getAllIdiomaTipo() {
    const result = await this.userRepository.query(`
    select id,idioma from idioma_tipo order by 1
    `);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      throw new NotFoundException("No se encontraron registros");
    }

    //return result;
    return this._serviceResp.respuestaHttp200(result, "", "");
  }

  async getAllDeptoTipo(idPais: number) {
    //unidad_territorial_tipo_id = 6 censo_2014

    const result = await this.userRepository.query(`
    SELECT
      unidad_territorial.ID,
      comentario AS sigla,
      lugar 
    FROM
      unidad_territorial 
    WHERE
      unidad_territorial_tipo_id = 8
      AND unidad_territorial_id = ${idPais}
    ORDER BY
      2 ASC
    `);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      throw new NotFoundException("No se encontraron registros");
    }

    //return result;
    return this._serviceResp.respuestaHttp200(result, "", "");
  }

  async getAllPaisTipo() {
    //unidad_territorial_tipo_id = 6 censo_2014

    const result = await this.userRepository.query(`
    SELECT
      unidad_territorial.ID,
      comentario AS sigla,
      lugar 
    FROM
      unidad_territorial 
    WHERE
      unidad_territorial_tipo_id = 0   and lugar <> 'NINGUNO'   
    ORDER BY
      2 ASC
    `);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      throw new NotFoundException("No se encontraron registros");
    }

    //return result;
    return this._serviceResp.respuestaHttp200(result, "", "");
  }

  async getAllExpedidoTipo() {
    const result = await this.userRepository.query(`
    SELECT	
        unidad_territorial.id, 	
        sigla, 
        departamento as lugar
      FROM
        ci_expedido_tipo
        INNER JOIN
        unidad_territorial
        ON 
          ci_expedido_tipo.codigo = unidad_territorial.codigo
        where unidad_territorial_tipo_id = 1
      ORDER BY
        1 ASC
    `);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      throw new NotFoundException("No se encontraron registros");
    }

    //return result;
    return this._serviceResp.respuestaHttp200(result, "", "");
  }

  async getAllProvinciaByDeptoCodigo(codigoDepto: number) {
    /*const result = await this.userRepository.query(`
      SELECT
        id, lugar, codigo
      FROM
        unidad_territorial 
      WHERE
        unidad_territorial_tipo_id = 2
        AND unidad_territorial_id in (select id from unidad_territorial where codigo = '${codigoDepto}' and unidad_territorial_tipo_id = 1)
        order by codigo
    `);*/

    const result = await this.userRepository.query(`
      SELECT
        id, lugar, codigo
      FROM
        unidad_territorial 
      WHERE
        unidad_territorial_tipo_id = 9
        AND unidad_territorial_id  = ${codigoDepto} order by 2
    `);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      throw new NotFoundException("No se encontraron registros");
    }

    //return result;
    return this._serviceResp.respuestaHttp200(result, "", "");
  }

  async deleteRolUser(user_rol_id: number) {
    //TODO: Validar las tablas dependientes
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .delete()
        .from(UsuarioRol)
        .where("id = :user_rol_id", { user_rol_id })
        .execute();

      console.log("result: ", result);
      console.log("result delete: ", result.affected);

      if (result.affected === 0) {
        throw new NotFoundException(
          "No es posible la operacion, existen datos relacionados !"
        );
      }

      //devuelve 1 si la operacion se ha realizado con exito
      //return result.affected ===1 ? true: false;

      return this._serviceResp.respuestaHttp203(
        user_rol_id,
        "Registro Eliminado !!",
        ""
      );
    } catch (err) {
      //throw new Error(`Error eliminando registro: ${err.message}`);
      throw new HttpException(
        "No es posible la operacion, existen datos relacionados !",
        HttpStatus.FORBIDDEN
      );
      /*return this._serviceResp.respuestaHttp400(
          user_rol_id,
          'No es posible la operacion, existen datos relacionados !',
          err.driverError.detail,
        );*/
    }
  }

  async deleteUnidadTerritorialUser(id: number) {
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .delete()
        .from(UsuarioUniTerrRol)
        .where("id = :id", { id })
        .execute();

      console.log("result: ", result);
      console.log("result delete: ", result.affected);

      if (result.affected === 0) {
        throw new NotFoundException(
          "No es posible la operacion, existen datos relacionados !"
        );
      }

      //devuelve 1 si la operacion se ha realizado con exito
      //return result.affected ===1 ? true: false;
      return this._serviceResp.respuestaHttp203(
        id,
        "Registro Eliminado !!",
        ""
      );
    } catch (err) {
      //throw new Error(`Error eliminando registro: ${err.message}`);
      throw new HttpException(
        "No es posible la operacion, existen datos relacionados !",
        HttpStatus.FORBIDDEN
      );
    }
  }

  async updateUser(dto: UpdateUserDto, request: Request) {
    //0: validar token
    let user_id = 0;
    console.log("updateUser:", request.headers["token"]);
    try {
      const payload = await this.jwtService.decode(request.headers["token"]);
      console.log("payload:", payload["id"]);
      if (!payload) {
        throw new UnauthorizedException();
      }
      user_id = parseInt(payload["id"]) + 0;
    } catch {
      throw new UnauthorizedException();
    }
    console.log("updateUserId:", user_id);

    //1:BUSCAR LA PERSONA

    //const result = await this.userRepository.query(`SELECT count(*) as existe FROM persona whwre `);
    const persona = await this.personaRepository.findOne({
      where: { id: dto.id },
    });
    console.log("persona:", persona);

    if (!persona) {
      return this._serviceResp.respuestaHttp404(
        dto.id,
        "Registro No Encontrado !!",
        ""
      );
    }

    try {
      await this.userRepository
        .createQueryBuilder()
        .update(Persona)
        .set({
          generoTipoId: dto.generoTipoId,
          sangreTipoId: dto.sangreTipoId,
          maternoIdiomaTipoId: dto.maternoIdiomaTipoId,
          expedidoUnidadTerritorialId: dto.expedidoUnidadTerritorialId,
          nacimientoUnidadTerritorialId: dto.nacimientoUnidadTerritorialId,
          dobleNacionalidad: dto.dobleNacionalidad,
          tieneDiscapacidad: dto.tieneDiscapacidad,
        })
        .where("id = :id", { id: dto.id })
        .execute();

      return this._serviceResp.respuestaHttp202(
        dto,
        "Registro Actualizado !!",
        ""
      );
    } catch (error) {
      console.log("Error update user: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error Actualizando Datos Usuario: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
      //return 0;
    }
  }

  async resetPasswordUser(body) {
    //TODO: validar que sea numero

    const id_user = parseInt(body.id);

    //1:BUSCAR usuario
    const user = await this.userRepository.findOne({
      where: { id: id_user },
    });
    console.log("persona:", user);

    if (!user) {
      return this._serviceResp.respuestaHttp404(
        id_user,
        "Registro No Encontrado !!",
        ""
      );
    }

    try {
      const hashPassword = await bcrypt.hash("123456", 10);

      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          password: hashPassword,
        })
        .where("id = :id", { id: id_user })
        .execute();

      return this._serviceResp.respuestaHttp202(
        id_user,
        "Registro Actualizado !!",
        ""
      );
    } catch (error) {
      console.log("Error reset password: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error reset Password Usuario: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
    }
  }

  async changePasswordUser(body) {
    //TODO: validar que sea numero ?

    const id_user = parseInt(body.id);

    //1:BUSCAR usuario
    const user = await this.userRepository.findOne({
      where: { id: id_user },
    });
    console.log("persona:", user);

    if (!user) {
      return this._serviceResp.respuestaHttp404(
        id_user,
        "Registro No Encontrado !!",
        ""
      );
    }

    try {
      const hashPassword = await bcrypt.hash(body.password, 10);

      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          password: hashPassword,
        })
        .where("id = :id", { id: id_user })
        .execute();

      return this._serviceResp.respuestaHttp202(
        id_user,
        "Registro Actualizado !!",
        ""
      );
    } catch (error) {
      console.log("Error reset password: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error reset Password Usuario: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
    }
  }

  async getAllMunicipioByProvinciaId(provId: number) {
    const result = await this.userRepository.query(`
      SELECT
        id, lugar
      FROM
        unidad_territorial 
      WHERE
        unidad_territorial_tipo_id = 10 and unidad_territorial_id = ${provId} 
		order by 2
    `);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      throw new NotFoundException("No se encontraron registros");
    }

    //return result;
    return this._serviceResp.respuestaHttp200(result, "", "");
  }

  async getAllComunidadByMunicipioId(provId: number) {
    const result = await this.userRepository.query(`
      SELECT
        id, lugar
      FROM
        unidad_territorial 
      WHERE
        unidad_territorial_tipo_id = 11 and unidad_territorial_id = ${provId} 
		order by 2
    `);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      throw new NotFoundException("No se encontraron registros");
    }

    //return result;
    return this._serviceResp.respuestaHttp200(result, "", "");
  }

  async changeStatusUser(userId) {
    //1:BUSCAR el usuario

    //const result = await this.userRepository.query(`SELECT count(*) as existe FROM persona whwre `);
    const usuario = await this.userRepository.findOne({
      where: { id: userId },
    });
    console.log("persona:", usuario);

    if (!usuario) {
      return this._serviceResp.respuestaHttp404(
        userId,
        "Registro No Encontrado !!",
        ""
      );
    }

    try {
      const nuevoEstado = !usuario.activo;

      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          activo: nuevoEstado,
        })
        .where("id = :id", { id: userId })
        .execute();

      return this._serviceResp.respuestaHttp202(
        userId,
        "Registro Actualizado !!",
        ""
      );
    } catch (error) {
      console.log("Error update user: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error Actualizando Estado Usuario: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
      //return 0;
    }
  }

  async changeStatusRolUser(userRolId) {
    const result = await this.userRepository.query(
      `SELECT * FROM usuario_rol where id = ${userRolId}`
    );

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      return this._serviceResp.respuestaHttp404(
        userRolId,
        "Registro No Encontrado !!",
        ""
      );
    }

    try {
      const nuevoEstado = !result[0].activo;

      await this.userRepository
        .createQueryBuilder()
        .update(UsuarioRol)
        .set({
          activo: nuevoEstado,
        })
        .where("id = :id", { id: userRolId })
        .execute();

      return this._serviceResp.respuestaHttp202(
        userRolId,
        "Registro Actualizado !!",
        ""
      );
    } catch (error) {
      console.log("Error update user: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error Actualizando Estado Usuario: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
      //return 0;
    }
  }

  async getDistritoByDeptoId(deptoId) {
    return await this.userRepository.query(
      `SELECT
        id, lugar 
      FROM
        unidad_territorial 
      WHERE
        unidad_territorial_tipo_id = 7 
        AND SUBSTRING ( codigo, 1, 1 ) = '${deptoId}'`
    );
  }

  async getAllMenuByUserRolId(userRolId: number) {
    const result = await this.userRepository
      .query(`select unidad_territorial_usuario_rol_app_menu.id as unidad_territorial_usuario_rol_app_menu_id, app_tipo.url_sistema as app, rol_tipo.rol, menu_tipo.detalle_menu as menu, unidad_territorial_usuario_rol_app_menu.activo
    from usuario_rol
    inner join unidad_territorial_usuario_rol on unidad_territorial_usuario_rol.usuario_rol_id = usuario_rol.id
    inner join unidad_territorial_usuario_rol_app on unidad_territorial_usuario_rol_app.unidad_territorial_usuario_rol_id = unidad_territorial_usuario_rol.id 
    inner join unidad_territorial_usuario_rol_app_menu on unidad_territorial_usuario_rol_app_menu.unidad_territorial_usuario_rol_app_id = unidad_territorial_usuario_rol_app.id
    --inner join menu_sistema_rol on menu_sistema_rol.rol_tipo_id = usuario_rol.rol_tipo_id 
    --inner join menu_sistema on menu_sistema.id = menu_sistema_rol.menu_sistema_id and unidad_territorial_usuario_rol_app.app_tipo_id = menu_sistema.app_tipo_id 
    inner join menu_tipo on menu_tipo.id = unidad_territorial_usuario_rol_app_menu.menu_tipo_id 
    inner join app_tipo on app_tipo.id = unidad_territorial_usuario_rol_app.app_tipo_id 
    inner join rol_tipo on rol_tipo.id = usuario_rol.rol_tipo_id
    where usuario_rol.id = ${userRolId}`);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      throw new NotFoundException("No se encontraron registros");
    }

    return this._serviceResp.respuestaHttp200(
      result,
      "",
      "Registro Encontrado !!"
    );

    //return result;
  }

  async changeStatusUserRolUtAppMenu(userRolUtAppMenuId) {
    const result = await this.userRepository.query(
      `select * from unidad_territorial_usuario_rol_app_menu where id  = ${userRolUtAppMenuId}`
    );

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      return this._serviceResp.respuestaHttp404(
        userRolUtAppMenuId,
        "Registro No Encontrado !!",
        ""
      );
    }

    try {
      const nuevoEstado = !result[0].activo;

      await this.userRepository
        .createQueryBuilder()
        .update(UnidadTerritorialUsuarioRolAppMenu)
        .set({
          activo: nuevoEstado,
        })
        .where("id = :id", { id: userRolUtAppMenuId })
        .execute();

      return this._serviceResp.respuestaHttp202(
        userRolUtAppMenuId,
        "Registro Actualizado !!",
        ""
      );
    } catch (error) {
      console.log("Error update user: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error Actualizando Estado Usuario: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
      //return 0;
    }
  }

  async getTuicionByUserRolId(urid: number) {
    const result1 = await this.userRepository.query(
      `select * from usuario_rol where id=${urid};`
    );
    /*console.log('result: ', result1);
    console.log('result size: ', result1.length);*/

    if (result1.length === 0) {
      console.log("not found");
      return this._serviceResp.respuestaHttp404(
        "",
        "",
        "Registro No Encontrado !!"
      );
    }

    switch (result1[0]["rol_tipo_id"]) {
      case 2:
        console.log("tecnac");
        const result = await this.userRepository.query(`
        SELECT
          unidad_territorial.ID,
          comentario AS sigla,
          lugar 
        FROM
          unidad_territorial 
        WHERE
          unidad_territorial_tipo_id = 0   and lugar <> 'NINGUNO'   
        ORDER BY
          2 ASC
        `);

        return this._serviceResp.respuestaHttp201(
          result,
          "Registro Encontrado !!",
          ""
        );

        break;

      case 3:
        console.log("tecdepto");
        const resultd = await this.userRepository.query(`
        SELECT
          unidad_territorial.ID,
          comentario AS sigla,
          lugar 
        FROM
          unidad_territorial 
        WHERE
          unidad_territorial_tipo_id = 8
          AND unidad_territorial_id = 1
        ORDER BY
          2 ASC
        `);

        return this._serviceResp.respuestaHttp201(
          resultd,
          "Registro Encontrado !!",
          ""
        );
        break;

      case 4:
        console.log("tecdist");
        const resultdep = await this.userRepository.query(`
        SELECT
          lugar, TO_NUMBER(codigo,'99') as codigo
        FROM
          unidad_territorial 
        WHERE
          unidad_territorial_tipo_id = 8    
          and codigo <> '00'
        ORDER BY
          2 ASC
        `);
        //console.log(resultep);

        let data = [];

        for (let x = 0; x < resultdep.length; x++) {
          let arraydistritos = [];
          let distritos = [];

          const codigo = resultdep[x]["codigo"];
          const lugar = resultdep[x]["lugar"];

          const resultddist = await this.getDistritoByDeptoId(
            parseInt(codigo)
          ).then((mydata) => {
            console.log("resultddist", mydata);
            let depto = {
              id: codigo,
              lugar: lugar,
              distritos: mydata,
            };
            //console.log('depto: ',depto)
            data.push(depto);
            console.log("data1: ", data);
          });
        }

        /*resultdep.forEach(async (element) => {
          //console.log(element["codigo"]);

          let arraydistritos = [];
          let distritos = [];

          const codigo = element["codigo"];
          const lugar = element["lugar"];

          const resultddist = await this.getDistritoByDeptoId(parseInt(codigo)).then((mydata) => {
            console.log("resultddist", mydata);
            let depto = {
              id: codigo,
              lugar: lugar,
              //distritos: mydata,
            };
            //console.log('depto: ',depto)
            data.push(depto);
            console.log("data1: ", data);
          });
          
        });*/

        //return data;

        return this._serviceResp.respuestaHttp201(
          data,
          "Registro Encontrado !!",
          ""
        );

        break;
    }
  }

  async getAllAppTipo() {
    const result = await this.userRepository.query(`
    select id, url_sistema as app from app_tipo order by 1
    `);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      throw new NotFoundException("No se encontraron registros");
    }

    //return result;
    return {
      statusCode: 200,
      message: [""],
      data: result,
      code: "",
    };
  }

  async createUserAndRol(persona: Persona, rol_tipo_id: number) {
    //console.log('persona: ', persona);
    //console.log('rol_tipo_id: ', rol_tipo_id);

    try {
      const hashPassword = await bcrypt.hash(
        persona.carnetIdentidad + persona.complemento,
        10
      );
      //verificamos si existe el usuario
      const resultp = await this.personaRepository.query(
        `SELECT count(*) as existe FROM usuario where persona_id = ${persona.id}`
      );

      console.log("resultp[0].existe: ", resultp[0].existe);
      let user_id = 0;
      if (resultp[0].existe == 0) {
        //creamos el usuario
        console.log("creamos el usuario");
        const newUser = await this.userRepository
          .createQueryBuilder()
          .insert()
          .into(User)
          .values([
            {
              personaId: persona.id,
              username: persona.carnetIdentidad,
              password: hashPassword,
              activo: true,
            },
          ])
          .returning("id")
          .execute();

        //se le asigna el rol recibido
        user_id = newUser.identifiers[0].id;
        console.log("new user_id: ", user_id);

        console.log("graba");
      } else {
        // NO deberia existir dos usuarios con la misma persona_id
        const result = await this.personaRepository.query(
          `SELECT id FROM usuario where persona_id = ${persona.id}`
        );

        user_id = result[0].id;
        console.log("existe user_id: ", user_id);
      }

      //ya existe el usuario, existe con ese rol ?
      const resultrol = await this.personaRepository.query(
        `SELECT count(*) as existe FROM usuario_rol where usuario_id = ${user_id} and rol_tipo_id = ${rol_tipo_id}`
      );

      if (resultrol[0].existe == 0) {
        // no existe ese rol para el usuario, se crea
        const res = this.insertNewRolUser(user_id, rol_tipo_id);
        return user_id;
      }

      return user_id;
    } catch (error) {
      console.log("Error creacion usuario y rol: ", error.message);
      return null;
    }
  }

  async checkToken(rolId: number, request: Request) {
    //0: validar token
    let user_id = 0;
    //console.log("updateUser:", request.headers["token"]);
    try {
      const payload = await this.jwtService.decode(request.headers["token"]);
      console.log("payload:", payload["id"]);
      if (!payload) {
        throw new UnauthorizedException();
      }
      user_id = parseInt(payload["id"]) + 0;
    } catch {
      throw new UnauthorizedException();
    }
    console.log("checkToken:", user_id);

    const rolTipoDirector = await this.rolTipoRepository.findBy({ id: rolId });

    return this._serviceResp.respuestaHttp200(
      rolTipoDirector,
      "Registro Encontrado !!",
      ""
    );



  }
}
