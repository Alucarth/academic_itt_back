import { Injectable, Logger } from '@nestjs/common';

import { RespuestaM } from './respuesta.model';

@Injectable()
export class RespuestaSigedService {
  logger = new Logger();
  respuesta = new RespuestaM();

  constructor() {}

  // TODO: ACEPTADO
  respuestaHttp200(data: any = null, message = '',code = '') {
    if (!message)
      this.respuesta.message = [`OK, La solicitud ha tenido éxito.`];
    else this.respuesta.message = [message];
    this.respuesta.statusCode = 200;
    this.respuesta.data = data;
    //this.respuesta.fecha = new Date();
    this.respuesta.code = code;
    //this.logger.debug(this.respuesta.error + ruta);
    return this.respuesta;
  }

  // TODO: CREADO CORRECTAMENTE
  respuestaHttp201(data: any = null, message = '',code = '') {
    if (!message)
      this.respuesta.message = [
        `CREATED, Se ha creado un nuevo recurso. ${message}`,
      ];
    else this.respuesta.message = [message];
    this.respuesta.statusCode = 201;
    this.respuesta.data = data;
    this.respuesta.code = code;
    //this.respuesta.fecha = new Date();
    //this.respuesta.error = 'CREATED.';
    //this.logger.debug(this.respuesta.error + ruta);
    return this.respuesta;
  }

  // TODO: UPDATE OK
  respuestaHttp202(data: any = null, message = '',code = '') {
    if (!message)
      this.respuesta.message = [
        `UPDATED, Se ha actualizado el recurso correctamente. ${message}`,
      ];
    else this.respuesta.message = [message];
    this.respuesta.statusCode = 202;
    this.respuesta.data = data;
    this.respuesta.code = code;
    //this.respuesta.fecha = new Date();
    //this.respuesta.error = 'UPDATED.';
    //this.logger.debug(this.respuesta.error + ruta);
    return this.respuesta;
  }

  // TODO: DELETE OK
  respuestaHttp203(data: any = null, message = '',code = '') {
    if (!message)
      this.respuesta.message = [
        `DELETED, Se ha eliminado el recurso correctamente.`,
      ];
    else this.respuesta.message = [message];
    this.respuesta.statusCode = 203;
    this.respuesta.data = data;
    this.respuesta.code = code;
    //this.respuesta.fecha = new Date();
    //this.respuesta.error = 'DELETED.';
    //this.logger.debug(this.respuesta.error + ruta);
    return this.respuesta;
  }

  // TODO: ARGUMENTO NO VALIDO
  respuestaHttp400(data: any = null, message = '',code = '') {
    if (!message) this.respuesta.message = [`Sintaxis inválida.`];
    else this.respuesta.message = [message];
    this.respuesta.statusCode = 400;
    this.respuesta.data = data;
    this.respuesta.code = code;
    //this.respuesta.fecha = new Date();
    //this.respuesta.error = 'BAD REQUEST.';
    //this.logger.warn(this.respuesta.error + ruta);
    return this.respuesta;
  }

  // TODO: ACCESO NO AUTHORIZADO
  respuestaHttp401(data: any = null, message = '',code = '') {
    if (!message) this.respuesta.message = [`No esta authenticado.`];
    else this.respuesta.message = [message];
    this.respuesta.statusCode = 401;
    this.respuesta.data = data;
    this.respuesta.code = code;
    //this.respuesta.error = 'UNAUTHORIZED.';
    //this.logger.warn(this.respuesta.error + ruta);
    return this.respuesta;
  }

  // TODO: NO AUTHORIZADO
  respuestaHttp403(data: any = null, message = '',code = '') {
    if (!message)
      this.respuesta.message = [
        `No esta authorizado para ver el contenido. ${message}`,
      ];
    else this.respuesta.message = [message];
    this.respuesta.statusCode = 403;
    this.respuesta.data = data;
    this.respuesta.code = code;
    //this.respuesta.fecha = new Date();
    //this.respuesta.error = 'FORBIDDEN.';
    //this.logger.warn(this.respuesta.error + ruta);
    return this.respuesta;
  }

  // TODO: NO SE ENCONTRO EL RECURSO
  respuestaHttp404(data: any = null, message = '',code = '') {
    if (!message) this.respuesta.message = [`Recurso(s) no encontrado(s).`];
    else this.respuesta.message = [message];
    this.respuesta.statusCode = 404;
    this.respuesta.data = data;
    this.respuesta.code = code;
    //this.respuesta.fecha = new Date();
    //this.respuesta.error = 'NOT FOUND.';
    //this.logger.warn(this.respuesta.error + ruta);
    return this.respuesta;
  }

  // TODO: SE INTENTO CREAR UN RECURSO QUE YA EXISTE
  respuestaHttp409(data: any = null, message = '',code = '') {
    if (!message) this.respuesta.message = [`El recurso ya esta registrado.`];
    else this.respuesta.message = [message];
    this.respuesta.statusCode = 409;
    this.respuesta.data = data;
    this.respuesta.code = code;
    //this.respuesta.fecha = new Date();
    //this.respuesta.error = 'ALREDY EXIST.';
    //this.logger.warn(this.respuesta.error + ruta);
    return this.respuesta;
  }

  // TODO: ERROR EN EL SERVIDOR
  respuestaHttp500(data: any = null, message = '',code = '') {
    if (!message) this.respuesta.message = [`SERVER ERROR.`];
    else this.respuesta.message = [message];
    this.respuesta.statusCode = 500;
    this.respuesta.data = data;
    this.respuesta.code = code;
    //this.respuesta.fecha = new Date();
    //this.respuesta.error = 'SERVER ERROR.';
    //this.logger.error(this.respuesta.error + ruta);
    return this.respuesta;
  }
}
