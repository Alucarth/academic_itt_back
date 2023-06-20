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
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";
import { AsignaturaTipoService } from "./asignatura_tipo.service";
import { CreateAsignaturaTipoDto } from "./dto/createAsignaturaTipo.dto";
import { AuthGuard } from "@nestjs/passport";

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
    // console.log('search', subject)
    let result = await this.asignaturaTipoService.searchSubject(subject.query)
    let data = []
    result.forEach(element => {
      data.push({ id: element.id, name: element.asignatura, code: element.abreviacion, hours: 0 })
    });
    
    return data
  }

  @Post("")
  @ApiOperation({
    summary: "Crea un asignatura",
  })
  create(@Body() createAsignaturaTipoDto: CreateAsignaturaTipoDto) {
    return this.asignaturaTipoService.create(createAsignaturaTipoDto);
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
