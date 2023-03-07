import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreaPersonaDTO } from './dto/crea-persona.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PersonaBusquedaCiFechaNacDTO, PersonaMReadDto } from './dto/persona.dto';
import { UsersService } from './users.service';


@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  @ApiOperation({
    summary: 'Sign Up as a user',
  })
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('/getAllBySearch')
  getAllBySearch(@Query('carnetIdentidad') ci:string,@Query('fechaNacimiento') fechanac:string,@Query('complemento') complemento:string){    
    console.log('ci: ',ci);
    console.log('fechanac: ',fechanac);
    console.log('complemento: ',complemento);
    return this.usersService.getAllBySearch(ci,fechanac,complemento);    
  }

  @Get('/getAllGeneroTipo')
  getAllGeneroTipo(){
    return this.usersService.getAllGeneroTipo();
  }

  @Get('/getAllSangreTipo')
  getAllSangreTipo(){
    return this.usersService.getAllSangreTipo();
  }

  @Get('/getAllEstadoCivilTipo')
  getAllEstadoCivilTipo(){
    return this.usersService.getAllEstadoCivilTipo();
  }

  @Get('/getAllIdiomaTipo')
  getAllIdiomaTipo(){
    return this.usersService.getAllIdiomaTipo();
  }

  @Get('/getAllRolesByUserId/:userId')
  getAllRolesByUserId(@Param('userId') id:string){
    return this.usersService.getAllRolesByUserId(parseInt(id));
  }

  @Get('/getAllNewRolesByUserId/:userId')
  getAllNewRolesByUserId(@Param('userId') id:string){
    return this.usersService.getAllNewRolesByUserId(parseInt(id));
  }

  @Get('/getAllUtByUserRolId/:userRolId')
  getAllUtByUserRolId(@Param('userRolId') urid:string){
    return this.usersService.getAllUtByUserRolId(parseInt(urid));
  }

  @Post('/addRolUser')   
  addRolUser(@Body() body) {
    //TODO: validar que lleguen numeros
    console.log('userId', body.userId);
    console.log('rolTipoId', body.rolTipoId);
    return this.usersService.insertNewRolUser(body.userId,body.rolTipoId);
  }

  @Delete('/rolUser/:userRolId')   
  deleteRolUser(@Param('userRolId') urid:string) {        
    console.log('rolTipoId', urid);
    return this.usersService.deleteRolUser(parseInt(urid));
  }

  @Delete('/unidadTerritorialUser/:id')   
  deleteUnidadTerritorialUser(@Param('id') id:string) {        
    console.log('rolTipoId', id);
    return this.usersService.deleteUnidadTerritorialUser(parseInt(id));
  }

  @Post('/addUnidadTerritorialUser')   
  addUnidadTerritorialUser(@Body() body) {
    //TODO: validar fechas desde el front ?    
    console.log('userId', body.userId);
    
    let unidad_territorial_id = body.unidadTerritorialId;   //31365, 1 si es nac o dep
    let usuario_rol_id = body.usuarioRolId;   //678
    let usuario_id = body.userId;             //82849
    let fecha_inicio = body.fechaInicio;      //2023-01-01
    let fecha_fin = body.fechaFin;            //2023-12-31
    
    return this.usersService.insertNewUnidadTerritorialUser(usuario_rol_id, unidad_territorial_id, fecha_inicio, fecha_fin, usuario_id);
  }

  @Post('/addUser')   
  async addUser(@Body() body: CreateUserDto) {
    //llegan los datos de la persona
    console.log('controller',body);
    return  await this.usersService.createNewUser(body);
  }

}
