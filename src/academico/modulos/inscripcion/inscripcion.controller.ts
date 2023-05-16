import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InscripcionService } from "./inscripcion.service";
import { CreateInscriptionDto } from "./dto/createInscription.dto";

@ApiTags("Matriculacion e Inscripcion")
@Controller("inscripcion")
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @Post()
  async createInscription(@Body() dto: CreateInscriptionDto) {
    const res = await this.inscripcionService.createInscription(dto);   
    return res;
  }

  @Post('/matricula')
  async create(@Body() dto: CreateInscriptionDto) {
    
    const res = await this.inscripcionService.createMatricula(dto);   
    return res;
  }


}
