import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InscripcionTipoService } from "./inscripcion_tipo.service";

@ApiTags('Inscripcion Tipos')
@Controller('inscripcion-tipo')
export class InscripcionTipoController {
  constructor(private readonly inscripcionTipoService: InscripcionTipoService) {}
  
  @Get("homologation-reincorporation")
  async  getHomologationReincorporation()
  {
    return await this.inscripcionTipoService.findHomologationReincorporation()
  }
}
