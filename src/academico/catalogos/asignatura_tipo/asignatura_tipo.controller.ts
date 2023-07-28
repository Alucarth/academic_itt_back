import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { AsignaturaTipoService } from "./asignatura_tipo.service";
import { CreateAsignaturaTipoDto } from "./dto/createAsignaturaTipo.dto";

import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';
@ApiTags("Crud Catalogo Asignatura Tipo")
@Controller("asignatura-tipo")
export class AsignaturaTipoController {
  constructor(private readonly asignaturaTipoService: AsignaturaTipoService) {}

  // @Roles(Role.ADMIN)
  //@UseGuards(JwtAuthGuard)
  //@UseGuards(AuthGuard("jwt"))
  @Get()
  @ApiOperation({
    summary: "Devuelve todas las Asignaturas",
  })
  async getAll() {
    return await this.asignaturaTipoService.getAll();
  }

  @Get('search')
  async search(@Query() subject: any)
  {
     //console.log('search', subject)
    let result = await this.asignaturaTipoService.searchSubject(subject.query)
    let data = []
    result.forEach(element => {
      data.push({ id: element.id, name: element.asignatura, code: element.abreviacion, hours: 0 })
    });
    
    return data
  }

  /////////@Auth()
  @Post("")
  @ApiOperation({
    summary: "Crea un asignatura",
  })
  create(@Body() createAsignaturaTipoDto: CreateAsignaturaTipoDto, @Users() user: UserEntity) {
    return this.asignaturaTipoService.create(createAsignaturaTipoDto, user);
  }

  @Put("")
  @ApiOperation({
    summary: "Actualiza un asignatura",
  })
  update(@Body() createAsignaturaTipoDto: CreateAsignaturaTipoDto) {
    return this.asignaturaTipoService.update(createAsignaturaTipoDto);
  }

  @ApiOperation({
    summary: "Elimina un asignatura",
  })
  @Delete("/:id")
  async deleteCarreraTipo(@Param("id") id: string) {
    return await this.asignaturaTipoService.deleteRecord(parseInt(id));
  }
}
