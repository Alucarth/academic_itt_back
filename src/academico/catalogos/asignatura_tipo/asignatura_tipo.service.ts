import { Injectable, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, Like, MoreThanOrEqual, Not, Repository } from "typeorm";
import { NotFoundException, HttpException } from "@nestjs/common";
import { RespuestaSigedService } from "../../../shared/respuesta.service";
import { CreateAsignaturaTipoDto } from "./dto/createAsignaturaTipo.dto";
import { AsignaturaTipo} from "../../entidades/asignaturaTipo.entity"
import { User as UserEntity } from 'src/users/entity/users.entity';
@Injectable()
export class AsignaturaTipoService {
  dataSource: any;
  constructor(
    @InjectRepository(AsignaturaTipo)
    private asignaturaTipoRepository: Repository<AsignaturaTipo>,
    private _serviceResp: RespuestaSigedService
  ) {}
  async getAll() {

    const result = await this.asignaturaTipoRepository
      .createQueryBuilder("a")
      .leftJoinAndSelect("a.planesAsignaturas","pea")
      .leftJoinAndSelect("pea.planEstudioCarrera","pec")
      .select([
        "a.id as id",
        "a.asignatura as asignatura",
        "a.abreviacion as abreviacion",
        "a.comentario as comentario",
        "pea.id as plan_estudio_asignatura_id",
        "pec.id as plan_estudio_carrera_id",
        "pec.aprobado as aprobado",
      ])
      .where('a.id >0')
      .orderBy('a.asignatura','ASC')
      .getRawMany();

    //console.log(result);
    return this._serviceResp.respuestaHttp200(
      result,
      "",
      "Asignaturas Encontrados !!"
    );
  }
  async getAllSinAprobacion() {
    const result = await this.asignaturaTipoRepository.find({
      where: {
        id: MoreThanOrEqual(5),
      },
      order: {
        asignatura: "ASC",
      },
    });
    return this._serviceResp.respuestaHttp200(
      result,
      "",
      "Registro Encontrado !!"
    );
  }

  async searchSubject(search: string)
  {
    if(search)
    {
     return await this.asignaturaTipoRepository
      .createQueryBuilder('a')
      .where("a.asignatura like :search", {search:`%${search}%`})
      .orWhere("a.abreviacion like :search", {search:`%${search}%`})
      .getMany();
    }
    return await this.asignaturaTipoRepository.find()
  }

  async create(dto: CreateAsignaturaTipoDto, user: UserEntity) {
    //TODO: en la tabla actual el campo asignatura_id todo esta con CERO
    //existe el area tipo = 0 ?
    const asignaturaTipoCero = await this.asignaturaTipoRepository.findOne({
      where: { id: 0 },
    });
    console.log("persona:", asignaturaTipoCero);

    if (!asignaturaTipoCero) {
      return this._serviceResp.respuestaHttp404(
        0,
        "AsignaturaTipoId no encontrada!",
        ""
      );
    }

    //evitar duplicados en asignatura y abreviacion
    const asignaturaTipoExiste = await this.asignaturaTipoRepository.findOne({
      where: { 
        asignatura: dto.asignatura,
        abreviacion: dto.abreviacion
      },
    });
    console.log("asignaturaTipoExiste:", asignaturaTipoExiste);
    if(asignaturaTipoExiste){
      let subject = {
        code : asignaturaTipoExiste.abreviacion,
        hours: 0,
        id: asignaturaTipoExiste.id,
        name: asignaturaTipoExiste.asignatura
      }
      return this._serviceResp.respuestaHttp201(
        subject,
        "Registro Ya Existe !!",
        ""
      );
    }

    try {
      const res = await this.asignaturaTipoRepository
        .createQueryBuilder()
        .insert()
        .into(AsignaturaTipo)
        .values([
          {
            asignatura: dto.asignatura,
            abreviacion: dto.abreviacion,
            comentario: dto.comentario,
            asignaturaId: asignaturaTipoCero,
            usuarioId: user.id,
          },
        ])
        .execute();
      const asignatura = await this.asignaturaTipoRepository.findOneBy({id: res.identifiers[0].id})
      // solo para la creacion desde la vista de plan de estudio
      let subject = {
        code : asignatura.abreviacion,
        hours: 0,
        id: asignatura.id,
        name: asignatura.asignatura
      }
      console.log("res:", res);
      console.log("asignaturatipo adicionado");
      return this._serviceResp.respuestaHttp201(
        subject,
        "Registro Creado !!",
        ""
      );
    } catch (error) {
      console.log("Error insertar asignaturatipo: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error insertar asignaturatipo: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
    }
  }

  async update(dto: CreateAsignaturaTipoDto) {
    //TODO: en la tabla actual el campo asignatura_id todo esta con CERO
    //existe el area tipo = 0 ?
    const asignaturaTipoCero = await this.asignaturaTipoRepository.findOne({
      where: { id: 0 },
    });
    console.log("persona:", asignaturaTipoCero);

    if (!asignaturaTipoCero) {
      return this._serviceResp.respuestaHttp404(
        0,
        "AsignaturaTipoId no encontrada!",
        ""
      );
    }

    /*
    const asignaturaTipoExiste = await this.asignaturaTipoRepository.findOne({
      where: { 
        asignatura: dto.asignatura,
        abreviacion: dto.abreviacion
      },
    });
    console.log("asignaturaTipoExiste:", asignaturaTipoExiste);
    */


    
    try {
      
      const result = await this.asignaturaTipoRepository
        .createQueryBuilder()
        .update(AsignaturaTipo)
        .set({
          asignatura: dto.asignatura,
          abreviacion: dto.abreviacion,
          comentario: dto.comentario,          
        })
        .where("id = :id", { id: dto.id })
        .execute();

      return this._serviceResp.respuestaHttp202(
        result,
        "Registro Actualizado !!",
        ""
      );
    } catch (error) {
      console.log("Error insertar asignaturatipo: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error insertar asignaturatipo: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
    }
    
  }

  async deleteRecord(id: number) {
    const result = await this.asignaturaTipoRepository
      .createQueryBuilder()
      .delete()
      .from(AsignaturaTipo)
      .where("id = :id", { id })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException("registro no encontrado !");
    }

    return this._serviceResp.respuestaHttp203(
      result,
      "Registro Eliminado !!",
      ""
    );
  }
}
