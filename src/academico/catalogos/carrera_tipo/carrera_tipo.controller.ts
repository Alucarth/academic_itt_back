import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { CarreraTipoService } from "./carrera_tipo.service";
import { ApiTags } from "@nestjs/swagger";
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';

@ApiTags("Crud Catalogo Carrera Tipo")
@Controller("carrera-tipo")
export class CarreraTipoController {
  constructor(private readonly carreraTipoService: CarreraTipoService) {}

  @Get()
  async getAll() {
  //  console.log("lista carreras");
    return await this.carreraTipoService.getAll();
  }
  
  @Get('carreras')
  async getAllCarreras() {
    console.log("lista carreras");
    return await this.carreraTipoService.getAllCarreras();
  }
 

  @Get("getById/:id")
  async getOneById(@Param("id") id: string) {
    return await this.carreraTipoService.getOneById(parseInt(id));
  }
  
  @Auth()
  @Post()
  async addCarreraTipo(@Body() body,  @Users() user: UserEntity) {
    return await this.carreraTipoService.insertRecord(body, user);
  }

  @Put()
  async updateCarreraTipo(@Body() body) {
    return await this.carreraTipoService.updateRecord(body);
  }

  @Delete("/:id")
  async deleteCarreraTipo(@Param("id") id: string) {
    return await this.carreraTipoService.deleteRecord(parseInt(id));
  }

  //--- CURSOS CORTOS, lo mismo pero

  @Get('/cursos-cortos')
  async getAllCursosCortos() {
    return await this.carreraTipoService.getAllCursosCortos();
  }
}
