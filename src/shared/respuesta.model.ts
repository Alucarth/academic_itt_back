export class RespuestaM {
  statusCode: number;
  message: string[];
  data: any;
  //fecha: Date;
  code: string;

  constructor() {
    this.statusCode = 200;
    this.message = [`Ok`];
    this.data = null;
    //this.fecha = null;
    this.code = null;
  }

  setAll(message: string, statusCode: number, data: any) {
    this.message = [message];
    this.statusCode = statusCode;
    this.data = data;
  }
}
