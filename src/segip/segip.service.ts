import { Injectable, Logger  } from "@nestjs/common";
import { map } from "rxjs/operators";
import * as dayjs from "dayjs";
import { Console } from "console";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

// Respuestas codigos segip
enum CodigoResSegipEnum {
  NO_PROCESADO = "0", // No se realizo la búsqueda
  NO_ENCONTRADO = "1", // No se encontró el registro [persona ú documento]
  ENCONTRADO = "2", // Encontrado
  MULTIPLICIDAD = "3", // Se encontró mas de un registro [persona ú documento]
  OBSERVADO = "4", // Registro con observacion
}

// Respuestas codigos datos contrastacion
enum EstadosDatosEnum {
  NO_CORRESPONDE = 0, // Dato no coincide
  CORRESPONDE = 1, // Dato coincide
  NO_VERIFICADO = 2, // Dato no verificado
}

@Injectable()
export class SegipService {

  logger: Logger;

  constructor(
    private http: HttpService,
    private configService: ConfigService
  ) {}

  async contrastar(persona, tipoCarnet) {
    //tipoCarnet = 1 NACIONAL, 2 EXTRANJERO;
    //console.log(this.configService.get("IOP_SEGIP_URL"));
    const datosCampos = this.armarDatosPersona(persona);
    //console.log(datosCampos);
    const campos = this.armarQueryParams(datosCampos);
    //console.log("campos segip:", campos);
    /*const urlContrastacion = 
      `http://100.0.100.116/segip/v2/personas/contrastacion/?tipo_persona=1&lista_campo={"Complemento":"","PrimerApellido":"FERNANDEZ","SegundoApellido":"HUARAYO","Nombres":"WINTHER HUMBERTO","FechaNacimiento":"21/12/1991","NumeroDocumento":"8609375"}`
    ;*/
    /*const urlContrastacion = encodeURI(
            `http://100.0.100.116/segip/v2/status`,
        );*/

    /*const respuesta = await this.http
            .get('https://catfact.ninja/fact')
            .pipe(map((response) => response.data))
            .toPromise();*/

    /*const urlContrastacion = encodeURI(
      `http://100.0.100.116/segip/v2/personas/contrastacion?lista_campo={ ${campos} }&tipo_persona=1`
    );*/
    const urlContrastacion = encodeURI(
      `${this.configService.get(
        "IOP_SEGIP_URL"
      )}/contrastacion?lista_campo={ ${campos} }&tipo_persona=${tipoCarnet}`
    );

    //console.log("url segip: ", urlContrastacion);

    const respuesta = await this.http
      .get(urlContrastacion)
      .pipe(map((response) => response.data))
      .toPromise();

    const resultado = respuesta?.ConsultaDatoPersonaContrastacionResult;
    if (resultado) {
      //console.log(resultado);
      if (resultado.CodigoRespuesta === CodigoResSegipEnum.ENCONTRADO) {
        const datosRespuesta = JSON.parse(resultado.ContrastacionEnFormatoJson);
        //console.log(datosRespuesta);

        const observaciones = this.procesarRespuesta(datosRespuesta);

        //console.log(observaciones);

        const exito = observaciones.length === 0;
        //console.log(exito);
        //return 11;
        const mensaje = exito
          ? resultado.DescripcionRespuesta
          : `No coincide ${observaciones.join(", ")}`;

        //console.log(mensaje);
        return this.armarRespuesta(exito, mensaje);
      } else if (
        [
          CodigoResSegipEnum.NO_PROCESADO,
          CodigoResSegipEnum.NO_ENCONTRADO,
          CodigoResSegipEnum.MULTIPLICIDAD,
          CodigoResSegipEnum.OBSERVADO,
        ].includes(resultado.CodigoRespuesta)
      ) {
        //return 0;
        return this.armarRespuesta(false, "No se encontro el registro");
      }
    } else {
      return 0;
    }
  }

  private procesarRespuesta(respuesta) {
    //console.log('segip procesarRespuesta:', respuesta);
    const datosIncorrectos = [];
    if (respuesta?.NumeroDocumento === EstadosDatosEnum.NO_CORRESPONDE) {
      datosIncorrectos.push("Número de documento");
    }
    if (respuesta?.Complemento === EstadosDatosEnum.NO_CORRESPONDE) {
      datosIncorrectos.push("Complemento");
    }
    if (respuesta?.Nombres === EstadosDatosEnum.NO_CORRESPONDE) {
      datosIncorrectos.push("Nombre(s)");
    }
    if (respuesta?.PrimerApellido === EstadosDatosEnum.NO_CORRESPONDE) {
      datosIncorrectos.push("Primer Apellido");
    }
    if (respuesta?.SegundoApellido === EstadosDatosEnum.NO_CORRESPONDE) {
      datosIncorrectos.push("Segundo Apellido");
    }
    if (respuesta?.FechaNacimiento === EstadosDatosEnum.NO_CORRESPONDE) {
      //console.log('valida fecha nac');
      datosIncorrectos.push("Fecha de Nacimiento");
    }
    if (datosIncorrectos.length > 0) {
      return datosIncorrectos;
    } else {
      return [];
    }
  }

  private armarRespuesta(exito, mensaje) {
    return {
      finalizado: exito,
      mensaje: `Servicio Segip: ${mensaje}`,
    };
    /*return {
      finalizado: exito,
      valido: exito,
      mensaje: `Servicio Segip: Datos No Coinciden`,
    };*/
  }

  private armarDatosPersona(datosPersona) {
    //console.log('fecha: ', datosPersona.fechaNacimiento);
    var dateString = datosPersona.fechaNacimiento; //"23/01/1984"; // Oct 23
    var newData = dateString.replace(/(\d+[/])(\d+[/])/, "$2$1");
    var newDate = new Date(newData);

    const datosCampos = {
      Complemento: datosPersona.complemento, //'',
      NumeroDocumento: datosPersona.ci,
      Nombres: datosPersona.nombres,
      PrimerApellido: datosPersona.paterno || "--",
      SegundoApellido: datosPersona.materno || "--",
      //FechaNacimiento: dayjs(datosPersona.fechaNacimiento).format('DD/MM/YYYY'),
      FechaNacimiento: dayjs(newDate).format("DD/MM/YYYY"),
    };

    //console.log('datosCampos:', datosCampos );

    /*console.log(datosPersona);
        console.log('armarDatosPersona: ', dayjs(datosPersona.fechaNacimiento).format('DD/MM/YYYY'));*/

    /*var dateString = "23/01/1984"; // Oct 23
        var newData = dateString.replace(/(\d+[/])(\d+[/])/, '$2$1');
        var data = new Date(newData);
        console.log(data);
        console.log('armarDatosPersona: ', dayjs(data).format('DD/MM/YYYY'));*/

    return datosCampos;
  }

  private armarQueryParams(datos) {
    return Object.keys(datos)
      .map((dato) => `"${dato}":"${datos[dato]}"`)
      .join(", ");
  }

  /*async verificaSIE(url){
        let params_url_sie = 'http://100.0.102.45:3001/api/persona/valida-persona?carnet=6180163015&complemento=&paterno=VALLEJOS&materno=MAMANI&nombre=BEATRIZ WILMA&fechaNacimiento=1986-03-21';
        const respuesta = await this.http
            .get(params_url_sie)
            .pipe(map((response) => response.data))
            .toPromise();

        console.log('respuesta sie: ', respuesta.data.estado);
        return respuesta.data.estado;
        

    }*/

  async verificaSIE(url) {
    console.log("verificaSIE:", url);
    const respuesta = await this.http
      .get(url)
      .pipe(map((response) => response.data))
      .toPromise();

    //console.log('respuesta sie: ', respuesta.data.estado);
    return respuesta.data.estado;
  }
}
