import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/users.entity';
import { UsuarioRol } from './entity/usuarioRol.entity';
import * as bcrypt from 'bcrypt';
import { Client } from 'pg';
import { NotFoundException , HttpException} from '@nestjs/common';
import { EntityManager, getConnection, getManager } from 'typeorm';
import { UsuarioUniTerrRol } from './entity/usuarioUniTerrRol.entity';
import { RespuestaSigedService } from '../shared/respuesta.service'
import { PersonaService } from './persona/persona.service'
import { PersonaBusquedaCiFechaNacDTO, PersonaMReadDto } from './dto/persona.dto'
import { CreaPersonaDTO } from './dto/crea-persona.dto';
import { Persona } from './entity/persona.entity';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)private userRepository: Repository<User>, 
    @InjectRepository(Persona)private personaRepository: Repository<Persona>, 
    private _serviceResp: RespuestaSigedService, 
    private _servicePersona: PersonaService,
  ) {}


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

  async findOne(email: string, password: string): Promise<User | undefined> {
    try {
      let id= 100;
      const user = await this.userRepository.findOne({
        where: { id },
      });
      const isMatch = await bcrypt.compare(password, user.password);
      if (user && isMatch) {

        return user;
      } else {
        throw new Error(`User not found`);
      }
    } catch (err) {
      throw new Error(`Error finding ${err} user ${err.message}`);
    }
  }

  async getAllBySearch( ci: string, fechanac: string, complemento:string) {
    
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

    
    console.log('result: ', result);
    console.log('result size: ', result.length);

    if(result.length === 0){
      //throw new NotFoundException('No se encontraron registros');
      return ({
          "statusCode": 201,
          "message": [
            "Registro No Encontrado !!"
          ],
          "data": [],
          "code": ""
        });
    }
            
    //return result;
    return  ({
          "statusCode": 201,
          "message": [
            "Registro Encontrado !!"
          ],
          "data": result,
          "code": ""
        });
  }

  async getAllRolesByUserId( userId: number) {

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

    
    console.log('result: ', result);
    console.log('result size: ', result.length);

    if(result.length === 0){
      throw new NotFoundException('No se encontraron registros');
    }

    return this._serviceResp.respuestaHttp201(
      result,
      '',
      'Registro Encontrado !!',
    );
            
    //return result;

  }


  async getAllUtByUserRolId(urid: number) {

    const result = await this.userRepository.query(`select * from unidad_territorial_usuario_rol utur 
        inner join unidad_territorial ut on ut.id = utur.unidad_territorial_id 
        where utur.usuario_rol_id=${urid};`);

    
    console.log('result: ', result);
    console.log('result size: ', result.length);

    if(result.length === 0){
      throw new NotFoundException('No se encontraron registros');
    }
            
    //return result;
    return this._serviceResp.respuestaHttp201(
      result,
      '',
      'Registro Encontrado !!',
    );

  }

  async getAllNewRolesByUserId( userId: number) {

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

    
    console.log('result: ', result);
    console.log('result size: ', result.length);

    if(result.length === 0){
      throw new NotFoundException('No se encontraron registros');
    }
      
    return this._serviceResp.respuestaHttp201(
      result,
      'Registro Encontrado !!',
      '',
    );
    //return result;

  }

  async insertNewRolUser( userId: number, rolTipoId: number) {

    //TODO VALIDAR SI YA EXISTE
    try {

      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(UsuarioRol)
        .values([
            { usuario_id: userId, rol_tipo_id: rolTipoId, activo: true }          
        ])
        .execute();

        console.log('rol adicionado');
        //return 1;
        return this._serviceResp.respuestaHttp201(
          null,
          'Registro Creado !!',
          '',
        );

      
    } catch (error) {
       console.log("Error insertar nuevo rol usuario: ", error);
       return this._serviceResp.respuestaHttp409(
          null,
          'Dato/Recurso Inexistente !!',
          error.driverError.detail,
        );
    }


  }

  async insertNewUnidadTerritorialUser( userRolId: number, unidadTerrId: number, fechaInicio: string, fechaFin: string, userId: number) {
    
    try {

      var parsedDate = Date.parse(fechaInicio);
      console.log(parsedDate);
      //valida fecha en formato yyyy-mm-dd
      if (isNaN(parsedDate)) {
        console.log('error fecha inicio');
        //return { 'status': 0, 'mensaje': 'Error en fecha'}
        //return new HttpException('No available fuel stations', HttpStatus.NOT_FOUND); 
        //throw new NotFoundException('No se encontraron registros');
      }

      var parsedDate = Date.parse(fechaFin);
      console.log(parsedDate);
      //valida fecha en formato yyyy-mm-dd
      if (isNaN(parsedDate)) {
        console.log('error fechaFin');
        //return { 'status': 0, 'mensaje': 'Error en fecha'}
        //return new HttpException('No available fuel stations', HttpStatus.NOT_FOUND); 
        //throw new NotFoundException('No se encontraron registros');
      }
     

      await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(UsuarioUniTerrRol)
        .values([
            { 
              unidad_territorial_id : unidadTerrId,
              usuario_rol_id : userRolId,
              fecha_inicio : fechaInicio,
              fecha_fin : fechaFin,
              usuario_id: userId, 
            }          
        ])
        .execute();

        console.log('Unidad Territorial adicionada');
        //return 1;        
        return this._serviceResp.respuestaHttp201(
          null,
          'Registro Creado !!',
          '',
        );
        

      
    } catch (error) {
       console.log("Error insertar nueva Unidad Territorial: ", error);
       //throw new Error(`Error insertar nueva Unidad Territorial: ${error.message}`);
       //throw new HttpException('Error en la operacion: ', error.message); 
       //throw new HttpException(new Error(`Error insertar nueva Unidad Territorial: ${error.message}`), HttpStatus.BAD_REQUEST)
       throw new HttpException({
          status: HttpStatus.CONFLICT,
          error: `Error insertar nueva Unidad Territorial: ${error.message}`,
        }, HttpStatus.ACCEPTED, {
          cause: error
        });
       //return 0;
    }


  }

  async getPersonaBySearch( ci: string, fechanac: string, complemento:string) {
    
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

    
    console.log('result: ', result);
    console.log('result size: ', result.length);

    if(result.length === 0){
      return 0;
    }
            
    return result;
  }

  async createNewUser(dto:CreateUserDto) {

    //1:BUSCAR LA PERSONA

    try{
    let persona =  await this.getPersonaBySearch(dto.carnet,dto.fechaNacimiento,dto.complemento);    
    
    console.log('existe persona:',persona);

    //persona = 1;
    if(persona === 0){
      // se debe crear la persona
      //TODO: validar SEGIP

      const validaSegip = true;

      if(validaSegip){

        //crear persona y usuario para SISTEMA ITT

        persona = await  this.userRepository
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
              expedidoUnidadTerritorialId : dto.expedidoUnidadTerritorialId,
              nacimientoUnidadTerritorialId : dto.nacimientoUnidadTerritorialId,
              dobleNacionalidad : dto.dobleNacionalidad,
              tieneDiscapacidad : dto.tieneDiscapacidad
            }          
        ])
        .returning("id")
        .execute();

        console.log('nueva persona id: ', persona.identifiers[0].id);

        const persona_id = persona.identifiers[0].id;
        //const password = '123456';
        const hashPassword = await bcrypt.hash('123456', 10);
        

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
              activo: true             
            }          
        ])
        .execute();


      }else{
        //no paso la validacion segip
        return this._serviceResp.respuestaHttp202('error', '','Datos no validos SEGIP!!');
      }

    }else{
      //la persona y el usuario ya existen, argumento no valido
      return this._serviceResp.respuestaHttp400(null,'Usuario y Persona ya existen !!','');
    }
    
    //return this._serviceResp.respuestaHttp200(300, '','mensaje');
    return this._serviceResp.respuestaHttp201(
          persona.identifiers[0].id,
          'Registro Creado !!',
          '',
        );
    
    } catch (error) {
       console.log("Error insertar nueva Unidad Territorial: ", error);
       //throw new Error(`Error insertar nueva Unidad Territorial: ${error.message}`);
       //throw new HttpException('Error en la operacion: ', error.message); 
       //throw new HttpException(new Error(`Error insertar nueva Unidad Territorial: ${error.message}`), HttpStatus.BAD_REQUEST)
       throw new HttpException({
          status: HttpStatus.CONFLICT,
          error: `Error insertar nueva Unidad Territorial: ${error.message}`,
        }, HttpStatus.ACCEPTED, {
          cause: error
        });
       //return 0;
    }
  }

  async getAllGeneroTipo() {

    const result = await this.userRepository.query(`
    select id,genero from genero_tipo where id in (1,2) order by 1
    `);
    
    console.log('result: ', result);
    console.log('result size: ', result.length);

    if(result.length === 0){
      throw new NotFoundException('No se encontraron registros');
    }
            
    //return result;
    return  ({
          "statusCode": 201,
          "message": [
            ""
          ],
          "data": result,
          "code": ""
        });

  }

  async getAllSangreTipo() {

    const result = await this.userRepository.query(`
    select id,sangre from sangre_tipo order by 1
    `);
    
    console.log('result: ', result);
    console.log('result size: ', result.length);

    if(result.length === 0){
      throw new NotFoundException('No se encontraron registros');
    }
            
    //return result;
    return  ({
          "statusCode": 201,
          "message": [
            ""
          ],
          "data": result,
          "code": ""
        });

  }

  async getAllEstadoCivilTipo() {

    const result = await this.userRepository.query(`
    select id,estado_civil from estado_civil_tipo order by 1
    `);
    
    console.log('result: ', result);
    console.log('result size: ', result.length);

    if(result.length === 0){
      throw new NotFoundException('No se encontraron registros');
    }
            
    //return result;
    return  ({
          "statusCode": 201,
          "message": [
            "Registro Encontrado !!"
          ],
          "data": result,
          "code": ""
        });

  }

  async getAllIdiomaTipo() {

    const result = await this.userRepository.query(`
    select id,idioma from idioma_tipo order by 1
    `);
    
    console.log('result: ', result);
    console.log('result size: ', result.length);

    if(result.length === 0){
      throw new NotFoundException('No se encontraron registros');
    }
            
    return result;

  }

  async deleteRolUser(user_rol_id: number) {

    //TODO: Validar las tablas dependientes
    try {
      const result = await this.userRepository.createQueryBuilder()
      .delete()
      .from(UsuarioRol)
      .where("id = :user_rol_id", { user_rol_id })
      .execute();
      
      console.log('result: ', result);
      console.log('result delete: ', result.affected);

      if(result.affected === 0){
        throw new NotFoundException('No es posible la operacion, existen datos relacionados !');
      }
      
      //devuelve 1 si la operacion se ha realizado con exito
      //return result.affected ===1 ? true: false;
      
        return this._serviceResp.respuestaHttp203(
          user_rol_id,
          'Registro Eliminado !!',
          '',
        );
     } catch (err) {
      //throw new Error(`Error eliminando registro: ${err.message}`);
      throw new HttpException('No es posible la operacion, existen datos relacionados !', HttpStatus.FORBIDDEN);
      /*return this._serviceResp.respuestaHttp400(
          user_rol_id,
          'No es posible la operacion, existen datos relacionados !',
          err.driverError.detail,
        );*/
    }

  }

  async deleteUnidadTerritorialUser(id: number) {

    try {
        const result = await this.userRepository.createQueryBuilder()
        .delete()
        .from(UsuarioUniTerrRol)
        .where("id = :id", { id })
        .execute();
        
        console.log('result: ', result);
        console.log('result delete: ', result.affected);

        if(result.affected === 0){
          throw new NotFoundException('No es posible la operacion, existen datos relacionados !');
        }
        
        //devuelve 1 si la operacion se ha realizado con exito
        //return result.affected ===1 ? true: false;
        return this._serviceResp.respuestaHttp203(
          id,
          'Registro Eliminado !!',
          '',
        );
      
        
    } catch (err) {
      //throw new Error(`Error eliminando registro: ${err.message}`);
      throw new HttpException('No es posible la operacion, existen datos relacionados !', HttpStatus.FORBIDDEN);
    }

  }

  async updateUser(dto:UpdateUserDto) {

    //1:BUSCAR LA PERSONA

    //const result = await this.userRepository.query(`SELECT count(*) as existe FROM persona whwre `);
    const persona = await this.personaRepository.findOne({
      where: { id: dto.id },
    });
    console.log('persona:' ,persona);

    if(!persona){
      return this._serviceResp.respuestaHttp404(
          dto.id,
          'Registro No Encontrado !!',
          '',
        );
    }


    try{

       await this.userRepository
        .createQueryBuilder()        
        .update(Persona)
        .set({             
            generoTipoId: dto.generoTipoId,
            sangreTipoId: dto.sangreTipoId,
            maternoIdiomaTipoId: dto.maternoIdiomaTipoId,
            expedidoUnidadTerritorialId : dto.expedidoUnidadTerritorialId,
            nacimientoUnidadTerritorialId : dto.nacimientoUnidadTerritorialId,
            dobleNacionalidad : dto.dobleNacionalidad,
            tieneDiscapacidad : dto.tieneDiscapacidad            
        })
        .where("id = :id", { id: dto.id })
        .execute()

        return this._serviceResp.respuestaHttp202(
          dto,
          'Registro Actualizado !!',
          '',
        );
        
    
    } catch (error) {
       console.log("Error update user: ", error);
       throw new HttpException({
          status: HttpStatus.CONFLICT,
          error: `Error Actualizando Datos Usuario: ${error.message}`,
        }, HttpStatus.ACCEPTED, {
          cause: error
        });
       //return 0;
    }
  }

  async resetPasswordUser(body) {
    //TODO: validar que sea numero

    const id_user = parseInt(body.id);

    //1:BUSCAR usuario    
    const user = await this.userRepository.findOne({
      where: { id: id_user},
    });
    console.log('persona:' ,user);

    if(!user){
      return this._serviceResp.respuestaHttp404(
          id_user,
          'Registro No Encontrado !!',
          '',
        );
    }

    try{

      const hashPassword = await bcrypt.hash('123456', 10);

       await this.userRepository
        .createQueryBuilder()        
        .update(User)
        .set({  
          password : hashPassword                      
        })
        .where("id = :id", { id: id_user})
        .execute()

        return this._serviceResp.respuestaHttp202(
          id_user,
          'Registro Actualizado !!',
          '',
        );
        
    
    } catch (error) {
       console.log("Error reset password: ", error);
       throw new HttpException({
          status: HttpStatus.CONFLICT,
          error: `Error reset Password Usuario: ${error.message}`,
        }, HttpStatus.ACCEPTED, {
          cause: error
        });       
    }


  }


  async changePasswordUser(body) {
    //TODO: validar que sea numero ?

    const id_user = parseInt(body.id);

    //1:BUSCAR usuario    
    const user = await this.userRepository.findOne({
      where: { id: id_user},
    });
    console.log('persona:' ,user);

    if(!user){
      return this._serviceResp.respuestaHttp404(
          id_user,
          'Registro No Encontrado !!',
          '',
        );
    }

    try{

      const hashPassword = await bcrypt.hash(body.password, 10);

       await this.userRepository
        .createQueryBuilder()        
        .update(User)
        .set({  
          password : hashPassword                      
        })
        .where("id = :id", { id: id_user})
        .execute()

        return this._serviceResp.respuestaHttp202(
          id_user,
          'Registro Actualizado !!',
          '',
        );
        
    
    } catch (error) {
       console.log("Error reset password: ", error);
       throw new HttpException({
          status: HttpStatus.CONFLICT,
          error: `Error reset Password Usuario: ${error.message}`,
        }, HttpStatus.ACCEPTED, {
          cause: error
        });       
    }


  }

}
