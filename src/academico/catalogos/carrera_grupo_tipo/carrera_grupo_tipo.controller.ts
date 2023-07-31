import { Controller, Get } from '@nestjs/common';
import { CarreraGrupoTipoService } from './carrera_grupo_tipo.service';

@Controller('carrera-grupo-tipo')
export class CarreraGrupoTipoController {
    constructor(private readonly carreraGrupoTipoService: CarreraGrupoTipoService) {}

  @Get()
  async getAll() {
    return await this.carreraGrupoTipoService.getAll();
  }
}
