import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EtapaEducativaAsignatura } from 'src/academico/entidades/etapaEducativaAsignatura.entity';
import { EtapaEducativaAsignaturaService } from './etapa_educativa_asignatura.service';
import { CreateAsignaturaTipoDto } from 'src/academico/catalogos/asignatura_tipo/dto/createAsignaturaTipo.dto';
import { CreateEtapaEducativaAsignaturaDto } from './dto/createEtapaEducativaAsignatura.dto';

@ApiTags("etapa-educativa-asignatura")
@Controller("etapa-educativa-asignatura")
export class EtapaEducativaAsignaturaController {
  constructor(
    private readonly etapaEducativaAsignaturaService: EtapaEducativaAsignaturaService
  ) {}

  @Get()
  async getAll(): Promise<EtapaEducativaAsignatura[]> {
    return await this.etapaEducativaAsignaturaService.getAll();
  }

  @Get("especialidad/:id")
  async getAsignaturasByEspecialidad(
    @Param("id", ParseIntPipe) id: number
  ): Promise<EtapaEducativaAsignatura[]> {
    return await this.etapaEducativaAsignaturaService.findAsignaturasByEspecialidad(
      id
    );
  }
  @Get("especialidad-etapa/:id/:etapa")
  async getAsignaturasByEspecialidadEtapa(
    @Param("id", ParseIntPipe) id: number,
    @Param("etapa", ParseIntPipe) etapa: number
  ): Promise<EtapaEducativaAsignatura[]> {
    return await this.etapaEducativaAsignaturaService.findAsignaturasByEspecialidadEtapa(
      id,
      etapa
    );
  }
  @Get("especialidad-etapa-plan/:id/:etapa/:plan")
  async getAsignaturasByEspecialidadEtapaPlan(
    @Param("id", ParseIntPipe) id: number,
    @Param("etapa", ParseIntPipe) etapa: number,
    @Param("plan", ParseIntPipe) plan: number
  ): Promise<EtapaEducativaAsignatura[]> {
    return await this.etapaEducativaAsignaturaService.findAsignaturasByEspecialidadEtapaPlan(
      id,
      etapa,
      plan
    );
  }

  @Get("etapa/:id")
  async getAsignaturasByEtapaId(
    @Param("id", ParseIntPipe) id: number
  ): Promise<EtapaEducativaAsignatura[]> {
    return await this.etapaEducativaAsignaturaService.findAsignaturasByEtapaId(
      id
    );
  }

  @Post("/")
  async create(@Body() body: CreateEtapaEducativaAsignaturaDto) {
    return await this.etapaEducativaAsignaturaService.create(body);
  }
}
