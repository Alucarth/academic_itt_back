import { Inject, Injectable } from "@nestjs/common";
import { RespuestaSigedService } from "src/shared/respuesta.service";
import { CustomRepositoryDoesNotHaveEntityError } from "typeorm";
import { CreatePersonaoDto } from "./dto/createPersona.dto";
import { SearchDatoDto } from "./dto/searchDato.dto";
import { PersonaRepository } from "./persona.repository";
import { UpdatePersonaoDto } from "./dto/updatePersona.dto";

@Injectable()
export class PersonaService {
  constructor(
    @Inject(PersonaRepository)
    private personaRepositorio: PersonaRepository,
    private _serviceResp: RespuestaSigedService
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
    
    const existePersona = await this.personaRepositorio.getById(dto.id)    
    //console.log('existePersona: ', existePersona);    
    if (existePersona.length == 0) {
        return this._serviceResp.respuestaHttp404(
            existePersona,
            "Persona no existe !!",
            ""
          );
    }
    else {        
        const dato = await this.personaRepositorio.updatePersona(dto);
        return this._serviceResp.respuestaHttp202(
         dato,
          "Registro Actualizado !!",
          ""
        );
    }
  }
}
