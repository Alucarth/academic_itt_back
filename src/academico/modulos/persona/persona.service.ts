import { Inject, Injectable } from "@nestjs/common";
import { RespuestaSigedService } from "src/shared/respuesta.service";
import { CustomRepositoryDoesNotHaveEntityError } from "typeorm";
import { CreatePersonaoDto } from "./dto/createPersona.dto";
import { SearchDatoDto } from "./dto/searchDato.dto";
import { PersonaRepository } from "./persona.repository";
import { UpdatePersonaoDto } from "./dto/updatePersona.dto";
import { SegipService } from "src/segip/segip.service";

@Injectable()
export class PersonaService {
  constructor(
    @Inject(PersonaRepository)
    private personaRepositorio: PersonaRepository,
    private _serviceResp: RespuestaSigedService,
    private readonly segipService: SegipService
  ) {}

  async findPersona(id: number) {
    return await this.personaRepositorio.getById(id);
  }

  async findPersonaByDato(dto: SearchDatoDto) {
    const person = await this.personaRepositorio.getPersonaByDato(dto);
    console.log(person);
    console.log("fin---------------");
    if (!person) {
      return this._serviceResp.respuestaHttp404(
        "0",
        "Registro No Encontrado !!",
        ""
      );
    }

    return this._serviceResp.respuestaHttp200(person, "", "");
  }

  async createPersona(dto: CreatePersonaoDto) {
    const datoBusqueda = {
      carnetIdentidad: dto.carnetIdentidad,
      complemento: dto.complemento,
    };
    const existePersona = await this.personaRepositorio.getPersonaByDato(
      datoBusqueda
    );
    console.log(existePersona);
    if (!existePersona) {
      console.log("POST PERSONA");
      // NO EXSISTE, VALIDMOS SEGIP

      // se debe crear la persona, antes se VALIDA SEGIP

      let arrayaux0 = dto.fechaNacimiento.toString();
      let arrayaux = arrayaux0.split("-");
      //console.log(arrayaux);
      const fechaSegip = arrayaux[2] + "/" + arrayaux[1] + "/" + arrayaux[0];
      //console.log("fechaSegip", fechaSegip);

      const personasegip = {
        nombres: dto.nombre.toUpperCase(),
        paterno: dto.paterno.toUpperCase(),
        materno: dto.materno.toUpperCase(),
        ci: dto.carnetIdentidad,
        fechaNacimiento: fechaSegip, //'19/02/2014 ',
        complemento: dto.complemento,
      };
      console.log("personasegip", personasegip);

      const segipdata = await this.segipService.contrastar(personasegip, 1);
      //console.log("segipdata", segipdata);
      if (segipdata["finalizado"] === false) {
        return { message: "Datos SEGIP no corresponden", segipdata };
      }
      console.log("CONSTRASTACION VALIDA");

      const dato = await this.personaRepositorio.crearPersona(dto);
      return this._serviceResp.respuestaHttp201(
        dato.id,
        "Registro Creado !!",
        ""
      );
    } else {
      return this._serviceResp.respuestaHttp400(
        existePersona,
        "Persona ya existe !!",
        ""
      );
    }
  }

  async updatePersona(dto: UpdatePersonaoDto) {
    const existePersona = await this.personaRepositorio.getById(dto.id);
    //console.log('existePersona: ', existePersona);
    if (existePersona.length == 0) {
      return this._serviceResp.respuestaHttp404(
        existePersona,
        "Persona no existe !!",
        ""
      );
    } else {
      const dato = await this.personaRepositorio.updatePersona(dto);
      return this._serviceResp.respuestaHttp202(
        dato,
        "Registro Actualizado !!",
        ""
      );
    }
  }
}
