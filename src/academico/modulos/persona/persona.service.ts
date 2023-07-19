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
  ) { }

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
        nombres        : dto.nombre.toUpperCase(),
        paterno        : dto.paterno.toUpperCase(),
        materno        : dto.materno.toUpperCase(),
        ci             : dto.carnetIdentidad,
        fechaNacimiento: fechaSegip,                  //'19/02/2014 ',
        complemento    : dto.complemento,
      };
      console.log("personasegip", personasegip);

      //const segipdata = await this.segipService.contrastar(personasegip, 1);
      const segipdata = await this.segipService.contrastar(personasegip, dto.cedulaTipoId);
      //console.log("segipdata", segipdata);
      if (segipdata["finalizado"] === false) {
        //return { message: "Datos SEGIP no corresponden", segipdata };
        return this._serviceResp.respuestaHttp404(
          404,
          "Datos SEGIP no corresponden !!",
          ""
        );

      }
      console.log("CONSTRASTACION VALIDAx");

      const dato = await this.personaRepositorio.crearPersona(dto);
      return this._serviceResp.respuestaHttp201(
        dato.id,
        "Registro Creado !!",
        ""
      );

    } else {

      let dto2 = new UpdatePersonaoDto();      
      console.log('existePersona -->', existePersona);
      dto2.id                            = existePersona[0].id
      dto2.generoTipoId                  = dto.generoTipoId
      dto2.estadoCivilTipoId             = dto.estadoCivilTipoId
      dto2.maternoIdiomaTipoId           = dto.maternoIdiomaTipoId
      dto2.expedidoUnidadTerritorialId   = dto.expedidoUnidadTerritorialId
      dto2.nacimientoUnidadTerritorialId = dto.nacimientoUnidadTerritorialId
      dto2.nacimientoOficialia           = dto.nacimientoOficialia
      dto2.nacimientoLibro               = dto.nacimientoLibro
      dto2.nacimientoPartida             = dto.nacimientoPartida
      dto2.nacimientoFolio               = dto.nacimientoFolio
      dto2.carnetIbc                     = dto.carnetIbc
      dto2.pasaporte                     = dto.pasaporte
      dto2.libretaMilitar                = dto.libretaMilitar
      dto2.dobleNacionalidad             = dto.dobleNacionalidad
      dto2.codigoRda                     = dto.codigoRda
      dto2.nacimientoLocalidad           = dto.nacimientoLocalidad
      dto2.tieneDiscapacidad             = dto.tieneDiscapacidad
      dto2.telefono                      = dto.telefono
      dto2.email                         = dto.email
      dto2.ciExpedidoTipoId              = dto.ciExpedidoTipoId
      dto2.cedulaTipoId                  = dto.cedulaTipoId

      const dato = await this.personaRepositorio.updatePersona(dto2);

      return this._serviceResp.respuestaHttp202(
        dato,
        "Persona actualizada !!",
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

  
  async historialPersona(personaId, sie, caId) {

    const historial = await this.personaRepositorio.getHistorialById(personaId, sie, caId);

    return this._serviceResp.respuestaHttp200(
      historial,
      "Datos Encontrados !!",
      ""
    );


  }

  async buscadorGestionPeriodo(sie) {

    const datos = await this.personaRepositorio.getBuscadorGestionPeriodo(
      sie
    );

    return this._serviceResp.respuestaHttp200(
      datos,
      "Datos Encontrados !!",
      ""
    );

  }

  async getCarrerasByPersonaId(id: number){
    const dato = await this.personaRepositorio.getCarrerasByPersonaId(id);

      return this._serviceResp.respuestaHttp200(
        dato,
        "Datos Encontrados !!",
        ""
      );
  }

  async historialPersonaAll(personaId, sie, caId) {

    const historial = await this.personaRepositorio.getHistorialAllById(personaId, sie, caId);

    return this._serviceResp.respuestaHttp200(
      historial,
      "Datos Encontrados !!",
      ""
    );


  }

}
