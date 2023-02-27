export class RespuestaM {
  statusCode: number;
  message: string[];
  data: any;
  //fecha: Date;
  error: string;

  constructor() {
    this.statusCode = 200;
    this.message = [`Ok`];
    this.data = null;
    //this.fecha = null;
    this.error = null;
  }

  setAll(message: string, statusCode: number, data: any) {
    this.message = [message];
    this.statusCode = statusCode;
    this.data = data;
  }
}
