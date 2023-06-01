import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Param,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreaPersonaDTO } from './dto/crea-persona.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PersonaBusquedaCiFechaNacDTO, PersonaMReadDto } from './dto/persona.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';


@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/signup")
  @ApiOperation({
    summary: "Sign Up as a user",
  })
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }

  /**/

  @Get("/getAllBySearch")
  getAllBySearch(
    @Query("carnetIdentidad") ci: string,
    @Query("fechaNacimiento") fechanac: string,
    @Query("complemento") complemento: string
  ) {
    console.log("ci: ", ci);
    console.log("fechanac: ", fechanac);
    console.log("complemento: ", complemento);
    return this.usersService.getAllBySearch(ci, fechanac, complemento);
  }

  //@UseGuards(JwtAuthGuard)
  @Get("/getAllGeneroTipo")
  getAllGeneroTipo() {
    return this.usersService.getAllGeneroTipo();
  }

  @Get("/getAllSangreTipo")
  getAllSangreTipo() {
    return this.usersService.getAllSangreTipo();
  }

  @Get("/getAllEstadoCivilTipo")
  getAllEstadoCivilTipo() {
    return this.usersService.getAllEstadoCivilTipo();
  }

  @Get("/getAllIdiomaTipo")
  getAllIdiomaTipo() {
    return this.usersService.getAllIdiomaTipo();
  }

  @Get("/getAllPaisTipo")
  getAllpaisTipo() {
    return this.usersService.getAllPaisTipo();
  }

  @Get("/getAllDeptoTipo/:idPais")
  getAllDeptoTipo(@Param("idPais") idPais: string) {
    return this.usersService.getAllDeptoTipo(parseInt(idPais));
  }

  @Get("/getAllExpedidoTipo")
  getAllExpedidoTipo() {
    return this.usersService.getAllExpedidoTipo();
  }

  @Get("/getAllProvByDeptoId/:deptoID")
  getAllProvinciaByDeptoCodigo(@Param("deptoID") deptoID: string) {
    return this.usersService.getAllProvinciaByDeptoCodigo(parseInt(deptoID));
  }

  @Get("/getAllMuniByProvId/:provId")
  getAllMuniByProvId(@Param("provId") provId: string) {
    return this.usersService.getAllMunicipioByProvinciaId(parseInt(provId));
  }

  @Get("/getAllComByMunId/:munId")
  getAllComByMunId(@Param("munId") munId: string) {
    return this.usersService.getAllComunidadByMunicipioId(parseInt(munId));
  }

  @Get("/getAllRoles")
  getAllRoles() {
    return this.usersService.getAllRoles();
  }

  @Get("/getAllRolesByUserId/:userId")
  getAllRolesByUserId(@Param("userId") id: string) {
    return this.usersService.getAllRolesByUserId(parseInt(id));
  }

  @Get("/getAllNewRolesByUserId/:userId")
  getAllNewRolesByUserId(@Param("userId") id: string) {
    return this.usersService.getAllNewRolesByUserId(parseInt(id));
  }

  @Get("/getAllUtByUserRolId/:userRolId")
  getAllUtByUserRolId(@Param("userRolId") urid: string) {
    return this.usersService.getAllUtByUserRolId(parseInt(urid));
  }

  @Get("/getTuicionByUserRolId/:userRolId")
  getTuicionByUserRolId(@Param("userRolId") urid: string) {
    return this.usersService.getTuicionByUserRolId(parseInt(urid));
  }

  @Post("/addRolUser")
  addRolUser(@Body() body) {
    //TODO: validar que lleguen numeros
    console.log("userId", body.userId);
    console.log("rolTipoId", body.rolTipoId);
    return this.usersService.insertNewRolUser(body.userId, body.rolTipoId);
  }

  @Delete("/rolUser/:userRolId")
  deleteRolUser(@Param("userRolId") urid: string) {
    console.log("rolTipoId", urid);
    return this.usersService.deleteRolUser(parseInt(urid));
  }

  @Delete("/unidadTerritorialUser/:id")
  deleteUnidadTerritorialUser(@Param("id") id: string) {
    console.log("rolTipoId", id);
    return this.usersService.deleteUnidadTerritorialUser(parseInt(id));
  }

  @Put("/changeStatusByUserId")
  changeStatusUser(@Body() body) {
    console.log("userId", body.userId);
    return this.usersService.changeStatusUser(body.userId);
  }

  @Put("/changeStatusByRolUserId")
  changeStatusRolUser(@Body() body) {
    console.log("userId", body.userId);
    return this.usersService.changeStatusRolUser(body.userId);
  }

  @Post("/addUnidadTerritorialUser")
  addUnidadTerritorialUser(@Body() body) {
    //TODO: validar fechas desde el front ?
    console.log("userId", body.userId);

    let unidad_territorial_id = body.unidadTerritorialId; //31365, 1 si es nac o dep
    let usuario_rol_id = body.usuarioRolId; //678
    let usuario_id = body.userId; //82849
    let fecha_inicio = body.fechaInicio; //2023-01-01
    let fecha_fin = body.fechaFin; //2023-12-31
    let apps = body.sistemas;

    return this.usersService.insertNewUnidadTerritorialUser(
      usuario_rol_id,
      unidad_territorial_id,
      fecha_inicio,
      fecha_fin,
      usuario_id,
      apps
    );
  }

  @Post("/")
  async addUser(@Body() body: CreateUserDto) {
    //llegan los datos de la persona
    console.log("controller new", body);
    return await this.usersService.createNewUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put("/")
  async updateUser(@Body() body: UpdateUserDto, @Req() request: Request) {
    //llegan los datos de la persona
    console.log("controller update", body);
    return await this.usersService.updateUser(body, request);
  }

  @Put("/resetPassword")
  async resetPasswordUser(@Body() body) {
    console.log("controller update", body);
    return await this.usersService.resetPasswordUser(body);
  }

  @Put("/changePassword")
  async changePasswordUser(@Body() body: UpdatePasswordUserDto) {
    console.log("controller update", body);
    return await this.usersService.changePasswordUser(body);
  }

  @Get("/getAllMenuByUserRolId/:userRolId")
  getAllMenuByUserRolId(@Param("userRolId") urid: string) {
    return this.usersService.getAllMenuByUserRolId(parseInt(urid));
  }

  @Put("/changeStatusMenuByUserRolUtAppId")
  async changeStatusUserRolUtAppMenu(@Body() body) {
    console.log("userId", body.userRolUtAppMenuId);
    return this.usersService.changeStatusUserRolUtAppMenu(
      body.userRolUtAppMenuId
    );
  }

  @Get("/getAllAppTipo")
  getAllAppTipo() {
    return this.usersService.getAllAppTipo();
  }

  @UseGuards(JwtAuthGuard)
  @Get("/checkToken/:rolId")
  async checkToken(@Param("rolId") rolId: string, @Req() request: Request) {
    return await this.usersService.checkToken(parseInt(rolId), request);
  }
}
