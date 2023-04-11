import { Inject, Injectable, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NotFoundException, HttpException } from "@nestjs/common";
import { EtapaEducativaAsignatura } from "src/academico/entidades/etapaEducativaAsignatura.entity";
import { Repository } from "typeorm";
import { EtapaEducativaAsignaturaRepository } from "./etapa_educativa_asignatura.repository";
import { EtapaEducativa } from "../../entidades/etapaEducativa.entity";
import { AsignaturaTipo } from "../../entidades/asignaturaTipo.entity";
import { IntervaloTiempoTipo } from "../../entidades/intervaloTiempoTipo.entity";
import { PlanEstudio } from "../../entidades/planEstudio.entity";
import { EspecialidadTipo } from "../../entidades/especialidadTipo.entity";
import { CampoSaberTipo } from "../../entidades/campoSaberTipo.entity";
import { CreateEtapaEducativaAsignaturaDto } from "./dto/createEtapaEducativaAsignatura.dto";
import { CreateAsignaturaTipoDto } from "src/academico/catalogos/asignatura_tipo/dto/createAsignaturaTipo.dto";
import { RespuestaSigedService } from "../../../shared/respuesta.service";
import { DeleteEtapaEducativaAsignaturaDto } from "./dto/deleteEtapaEducativaAsignatura.dto";
import { UpdateEtapaEducativaAsignaturaDto } from "./dto/updateEtapaEducativaAsignatura.dto";

@Injectable()
export class EtapaEducativaAsignaturaService {
  constructor(
    @Inject(EtapaEducativaAsignaturaRepository)
    private etapaEducativaAsignaturaRepositorio: EtapaEducativaAsignaturaRepository,
    @InjectRepository(EtapaEducativa)
    private etapaEducativaRepository: Repository<EtapaEducativa>,
    @InjectRepository(AsignaturaTipo)
    private asignaturaTipoRepository: Repository<AsignaturaTipo>,
    @InjectRepository(IntervaloTiempoTipo)
    private intervaloTiempoTipoRepository: Repository<IntervaloTiempoTipo>,
    @InjectRepository(PlanEstudio)
    private planEstudioTipoRepository: Repository<PlanEstudio>,
    @InjectRepository(EspecialidadTipo)
    private especialidadTipoRepository: Repository<EspecialidadTipo>,
    @InjectRepository(CampoSaberTipo)
    private campoSaberTipoRepository: Repository<CampoSaberTipo>,
    @InjectRepository(EtapaEducativaAsignatura)
    private etapaEducativaAsignaturaRepository: Repository<EtapaEducativaAsignatura>,
    private _serviceResp: RespuestaSigedService
  ) {}

  async getAll() {
    return await this.etapaEducativaAsignaturaRepositorio.getAll();
  }

  async findAsignaturasByEspecialidad(id: number) {
    return await this.etapaEducativaAsignaturaRepositorio.findAsignaturasByEspecialidad(
      id
    );
  }
  async findAsignaturasByEspecialidadEtapa(id: number, etapa: number) {
    return await this.etapaEducativaAsignaturaRepositorio.findAsignaturasByEspecialidadEtapa(
      id,
      etapa
    );
  }

  async findAsignaturasByEspecialidadEtapaPlan(
    id: number,
    etapa: number,
    plan: number
  ) {
    return await this.etapaEducativaAsignaturaRepositorio.findAsignaturasByEspecialidadEtapaPlan(
      id,
      etapa,
      plan
    );
  }

  async findAsignaturasByEtapaId(id: number) {
    return await this.etapaEducativaAsignaturaRepositorio.findAsignaturasByEtapaId(
      id
    );
  }

  async update(dto: UpdateEtapaEducativaAsignaturaDto) {
    //el registro existe ?
    const etapaEducativaAsignatura =
      await this.etapaEducativaAsignaturaRepository.findOne({
        where: { id: dto.id },
      });
    console.log("etapaEducativaAsignatura:", etapaEducativaAsignatura);

    if (!etapaEducativaAsignatura) {
      return this._serviceResp.respuestaHttp404(
        dto.id,
        "etapaEducativaAsignaturaId No Encontrado !!",
        ""
      );
    }

    // validar llaves foraneas
    const etapaEducativa = await this.etapaEducativaRepository.findOne({
      where: { id: dto.etapaEducativaId },
    });
    console.log("etapaEducativa:", etapaEducativa);

    if (!etapaEducativa) {
      return this._serviceResp.respuestaHttp404(
        dto.etapaEducativaId,
        "etapaEducativaId No Encontrado !!",
        ""
      );
    }

    const asignaturaTipo = await this.asignaturaTipoRepository.findOne({
      where: { id: dto.asignaturaTipoId },
    });
    console.log("asignaturaTipo:", asignaturaTipo);

    if (!asignaturaTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.asignaturaTipoId,
        "asignaturaTipo No Encontrado !!",
        ""
      );
    }
    const intervaloTiempoTipo =
      await this.intervaloTiempoTipoRepository.findOne({
        where: { id: dto.intervaloTiempoTipoId },
      });
    console.log("intervaloTiempoTipo:", intervaloTiempoTipo);

    if (!intervaloTiempoTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.intervaloTiempoTipoId,
        "intervaloTiempoTipo No Encontrado !!",
        ""
      );
    }

    const planEstudioTipo = await this.planEstudioTipoRepository.findOne({
      where: { id: dto.planEstudioTipoId },
    });
    console.log("planEstudioTipo:", planEstudioTipo);

    if (!planEstudioTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.planEstudioTipoId,
        "planEstudioTipo No Encontrado !!",
        ""
      );
    }

    const especialidadTipo = await this.especialidadTipoRepository.findOne({
      where: { id: dto.especialidadTipoId },
    });
    console.log("especialidadTipo:", especialidadTipo);

    if (!especialidadTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.especialidadTipoId,
        "especialidadTipo No Encontrado !!",
        ""
      );
    }

    const campoSaberTipo = await this.campoSaberTipoRepository.findOne({
      where: { id: dto.campoSaberTipoId },
    });
    console.log("campoSaberTipo:", campoSaberTipo);

    if (!campoSaberTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.campoSaberTipoId,
        "campoSaberTipo No Encontrado !!",
        ""
      );
    }

    //validadas las claves foraneas se procede a la creacion del registro

    //TODO: obtener usuario !!!
    let user_id = 10;

    try {
      console.log("dto: ", dto);

      const res = await this.etapaEducativaAsignaturaRepository
        .createQueryBuilder()
        .update(EtapaEducativaAsignatura)
        .set({
          etapaEducativa: etapaEducativa,
          asignaturaTipo: asignaturaTipo,
          planEstudio: planEstudioTipo,
          especialidadTipo: especialidadTipo,
          intervaloTiempoTipo: intervaloTiempoTipo,
          cargaHoraria: dto.cargaHoraria,
          opcional: dto.opcional,
          comentario: dto.comentario,
          usuarioId: user_id,
        })
        .where("id = :id", { id: dto.id })
        .execute();

      console.log("res:", res);
      console.log("Etapa Educativa Asignatura actualizado !!");
      return this._serviceResp.respuestaHttp202(
        res.affected,
        "Registro Actualizado !!",
        ""
      );
    } catch (error) {
      console.log("Error insertar etapa_educativa_asignatura: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error insertar etapa_educativa_asignatura: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
    }
  }

  async create(dto: CreateEtapaEducativaAsignaturaDto) {
    // validar llaves foraneas
    const etapaEducativa = await this.etapaEducativaRepository.findOne({
      where: { id: dto.etapaEducativaId },
    });
    console.log("etapaEducativa:", etapaEducativa);

    if (!etapaEducativa) {
      return this._serviceResp.respuestaHttp404(
        dto.etapaEducativaId,
        "etapaEducativaId No Encontrado !!",
        ""
      );
    }

    const asignaturaTipo = await this.asignaturaTipoRepository.findOne({
      where: { id: dto.asignaturaTipoId },
    });
    console.log("asignaturaTipo:", asignaturaTipo);

    if (!asignaturaTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.asignaturaTipoId,
        "asignaturaTipo No Encontrado !!",
        ""
      );
    }
    const intervaloTiempoTipo =
      await this.intervaloTiempoTipoRepository.findOne({
        where: { id: dto.intervaloTiempoTipoId },
      });
    console.log("intervaloTiempoTipo:", intervaloTiempoTipo);

    if (!intervaloTiempoTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.intervaloTiempoTipoId,
        "intervaloTiempoTipo No Encontrado !!",
        ""
      );
    }

    const planEstudioTipo = await this.planEstudioTipoRepository.findOne({
      where: { id: dto.planEstudioTipoId },
    });
    console.log("planEstudioTipo:", planEstudioTipo);

    if (!planEstudioTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.planEstudioTipoId,
        "planEstudioTipo No Encontrado !!",
        ""
      );
    }

    const especialidadTipo = await this.especialidadTipoRepository.findOne({
      where: { id: dto.especialidadTipoId },
    });
    console.log("especialidadTipo:", especialidadTipo);

    if (!especialidadTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.especialidadTipoId,
        "especialidadTipo No Encontrado !!",
        ""
      );
    }

    const campoSaberTipo = await this.campoSaberTipoRepository.findOne({
      where: { id: dto.campoSaberTipoId },
    });
    console.log("campoSaberTipo:", campoSaberTipo);

    if (!campoSaberTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.campoSaberTipoId,
        "campoSaberTipo No Encontrado !!",
        ""
      );
    }

    //validadas las claves foraneas se procede a la creacion del registro

    //TODO: obtener usuario !!!
    let user_id = 1;

    try {
      const res = await this.etapaEducativaAsignaturaRepository
        .createQueryBuilder()
        .insert()
        .into(EtapaEducativaAsignatura)
        .values([
          {
            etapaEducativa: etapaEducativa,
            asignaturaTipo: asignaturaTipo,
            planEstudio: planEstudioTipo,
            especialidadTipo: especialidadTipo,
            intervaloTiempoTipo: intervaloTiempoTipo,
            cargaHoraria: dto.cargaHoraria,
            opcional: dto.opcional,
            comentario: dto.comentario,
            usuarioId: user_id,
          },
        ])
        .execute();

      console.log("res:", res);
      console.log("Etapa Educativa Asignatura adicionado");
      return this._serviceResp.respuestaHttp201(
        res.identifiers[0].id,
        "Registro Creado !!",
        ""
      );
    } catch (error) {
      console.log("Error insertar etapa_educativa_asignatura: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error insertar etapa_educativa_asignatura: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
    }
  }

  async delete(dto: DeleteEtapaEducativaAsignaturaDto) {
    // validar llaves foraneas
    const etapaEducativaAsignatura =
      await this.etapaEducativaAsignaturaRepository.findOne({
        where: { id: dto.id },
      });
    console.log("etapaEducativaAsignatura:", etapaEducativaAsignatura);

    if (!etapaEducativaAsignatura) {
      return this._serviceResp.respuestaHttp404(
        dto.id,
        "etapaEducativaAsignaturaId No Encontrado !!",
        ""
      );
    }

    try {
      const res = await this.etapaEducativaAsignaturaRepository.delete({
        id: dto.id,
      });

      console.log("res:", res);
      console.log("Etapa Educativa Asignatura eliminada");
      return this._serviceResp.respuestaHttp203(
        res,
        "Registro eliminado !!",
        ""
      );
    } catch (error) {}
  }
}
