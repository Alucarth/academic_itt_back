import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaestroInscripcion } from 'src/academico/entidades/maestroInscripcion.entity';
import { Repository } from 'typeorm';
import { NotFoundException , HttpException} from '@nestjs/common';
import { RespuestaSigedService } from '../../../shared/respuesta.service'

@Injectable()
export class MaestroInscripcionService {

    constructor(
        @InjectRepository(MaestroInscripcion)private maeRepository: Repository<MaestroInscripcion>,
         private _serviceResp: RespuestaSigedService, 
    ) {}

    async getAllDocentesByUeGestion(ueId: string) {
        console.log('ueId: ', ueId);
    
        const result = await this.maeRepository.query(`
        SELECT
            maestro_inscripcion.id, 
            persona.paterno, 
            persona.materno, 
            persona.nombre, 
            persona.carnet_identidad, 
            persona.complemento, 
            persona.fecha_nacimiento, 
            persona.genero_tipo_id, 
            persona.estado_civil_tipo_id, 
            persona.sangre_tipo_id, 
            institucion_educativa_sucursal.institucion_educativa_id, 
            institucion_educativa_sucursal.sucursal_codigo, 
            institucion_educativa_sucursal.sucursal_nombre, 
            formacion_tipo.id as formacion_tipo_id, 
            formacion_tipo.formacion, 
            financiamiento_tipo.id as financiamiento_tipo_id, 
            financiamiento_tipo.financiamiento, 
            cargo_tipo.id as cargo_tipo_id, 
            cargo_tipo.cargo, 
            especialidad_tipo.id as especialidad_tipo_id, 
            especialidad_tipo.especialidad, 
            maestro_inscripcion.gestion_tipo_id, 
            maestro_inscripcion.normalista, 
            maestro_inscripcion.vigente, 
            maestro_inscripcion.formacion_descripcion, 
            maestro_inscripcion.braile, 
            maestro_inscripcion.asignacion_fecha_inicio, 
            maestro_inscripcion.asignacion_fecha_fin, 
            maestro_inscripcion.item, 
            maestro_inscripcion.periodo_tipo_id
        FROM
            maestro_inscripcion
            INNER JOIN
            persona
            ON 
                maestro_inscripcion.persona_id = persona.id
            INNER JOIN
            institucion_educativa_sucursal
            ON 
                maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
            INNER JOIN
            formacion_tipo
            ON 
                maestro_inscripcion.formacion_tipo_id = formacion_tipo.id
            INNER JOIN
            financiamiento_tipo
            ON 
                maestro_inscripcion.financiamiento_tipo_id = financiamiento_tipo.id
            INNER JOIN
            cargo_tipo
            ON 
                maestro_inscripcion.cargo_tipo_id = cargo_tipo.id
            INNER JOIN
            especialidad_tipo
            ON 
                maestro_inscripcion.especialidad_tipo_id = especialidad_tipo.id
            where institucion_educativa_id = ${ueId} and maestro_inscripcion.gestion_tipo_id = 2023 and cargo_tipo_id in (1) 
            order by 2,3,4;`);

    
        console.log('result: ', result);
        console.log('result size: ', result.length);

        if(result.length === 0){
        //throw new NotFoundException('No se encontraron registros');
            return this._serviceResp.respuestaHttp404(
            result,
            'Registro No Encontrado !!',
            '',
            );
        }
                
        //return result;
        return this._serviceResp.respuestaHttp201(
        result,
        'Registro Encontrado !!',
        '',
        );

    }

    async getAllDirectivosByUeGestion(ueId: string) {
        console.log('ueId: ', ueId);
    
        const result = await this.maeRepository.query(`
        SELECT
            maestro_inscripcion.id, 
            persona.paterno, 
            persona.materno, 
            persona.nombre, 
            persona.carnet_identidad, 
            persona.complemento, 
            persona.fecha_nacimiento, 
            persona.genero_tipo_id, 
            persona.estado_civil_tipo_id, 
            persona.sangre_tipo_id, 
            institucion_educativa_sucursal.institucion_educativa_id, 
            institucion_educativa_sucursal.sucursal_codigo, 
            institucion_educativa_sucursal.sucursal_nombre, 
            formacion_tipo.id as formacion_tipo_id, 
            formacion_tipo.formacion, 
            financiamiento_tipo.id as financiamiento_tipo_id, 
            financiamiento_tipo.financiamiento, 
            cargo_tipo.id as cargo_tipo_id, 
            cargo_tipo.cargo, 
            especialidad_tipo.id as especialidad_tipo_id, 
            especialidad_tipo.especialidad, 
            maestro_inscripcion.gestion_tipo_id, 
            maestro_inscripcion.normalista, 
            maestro_inscripcion.vigente, 
            maestro_inscripcion.formacion_descripcion, 
            maestro_inscripcion.braile, 
            maestro_inscripcion.asignacion_fecha_inicio, 
            maestro_inscripcion.asignacion_fecha_fin, 
            maestro_inscripcion.item, 
            maestro_inscripcion.periodo_tipo_id
        FROM
            maestro_inscripcion
            INNER JOIN
            persona
            ON 
                maestro_inscripcion.persona_id = persona.id
            INNER JOIN
            institucion_educativa_sucursal
            ON 
                maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
            INNER JOIN
            formacion_tipo
            ON 
                maestro_inscripcion.formacion_tipo_id = formacion_tipo.id
            INNER JOIN
            financiamiento_tipo
            ON 
                maestro_inscripcion.financiamiento_tipo_id = financiamiento_tipo.id
            INNER JOIN
            cargo_tipo
            ON 
                maestro_inscripcion.cargo_tipo_id = cargo_tipo.id
            INNER JOIN
            especialidad_tipo
            ON 
                maestro_inscripcion.especialidad_tipo_id = especialidad_tipo.id
            where institucion_educativa_id = ${ueId} and maestro_inscripcion.gestion_tipo_id = 2023 and cargo_tipo_id in (2,12) 
            order by 2,3,4;`);

    
        console.log('result: ', result);
        console.log('result size: ', result.length);

        if(result.length === 0){
        //throw new NotFoundException('No se encontraron registros');
            return this._serviceResp.respuestaHttp404(
            result,
            'Registro No Encontrado !!',
            '',
            );
        }
                
        //return result;
        return this._serviceResp.respuestaHttp201(
        result,
        'Registro Encontrado !!',
        '',
        );

    }

    async getAllAdministrativosByUeGestion(ueId: string) {
        console.log('ueId: ', ueId);
    
        const result = await this.maeRepository.query(`
        SELECT
            maestro_inscripcion.id, 
            persona.paterno, 
            persona.materno, 
            persona.nombre, 
            persona.carnet_identidad, 
            persona.complemento, 
            persona.fecha_nacimiento, 
            persona.genero_tipo_id, 
            persona.estado_civil_tipo_id, 
            persona.sangre_tipo_id, 
            institucion_educativa_sucursal.institucion_educativa_id, 
            institucion_educativa_sucursal.sucursal_codigo, 
            institucion_educativa_sucursal.sucursal_nombre, 
            formacion_tipo.id as formacion_tipo_id, 
            formacion_tipo.formacion, 
            financiamiento_tipo.id as financiamiento_tipo_id, 
            financiamiento_tipo.financiamiento, 
            cargo_tipo.id as cargo_tipo_id, 
            cargo_tipo.cargo, 
            especialidad_tipo.id as especialidad_tipo_id, 
            especialidad_tipo.especialidad, 
            maestro_inscripcion.gestion_tipo_id, 
            maestro_inscripcion.normalista, 
            maestro_inscripcion.vigente, 
            maestro_inscripcion.formacion_descripcion, 
            maestro_inscripcion.braile, 
            maestro_inscripcion.asignacion_fecha_inicio, 
            maestro_inscripcion.asignacion_fecha_fin, 
            maestro_inscripcion.item, 
            maestro_inscripcion.periodo_tipo_id
        FROM
            maestro_inscripcion
            INNER JOIN
            persona
            ON 
                maestro_inscripcion.persona_id = persona.id
            INNER JOIN
            institucion_educativa_sucursal
            ON 
                maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
            INNER JOIN
            formacion_tipo
            ON 
                maestro_inscripcion.formacion_tipo_id = formacion_tipo.id
            INNER JOIN
            financiamiento_tipo
            ON 
                maestro_inscripcion.financiamiento_tipo_id = financiamiento_tipo.id
            INNER JOIN
            cargo_tipo
            ON 
                maestro_inscripcion.cargo_tipo_id = cargo_tipo.id
            INNER JOIN
            especialidad_tipo
            ON 
                maestro_inscripcion.especialidad_tipo_id = especialidad_tipo.id
            where institucion_educativa_id = ${ueId} and maestro_inscripcion.gestion_tipo_id = 2023 
            and cargo_tipo_id in (3,4,5,6,7,14,17) 
            order by 2,3,4;`);

    
        console.log('result: ', result);
        console.log('result size: ', result.length);

        if(result.length === 0){
        //throw new NotFoundException('No se encontraron registros');
            return this._serviceResp.respuestaHttp404(
            result,
            'Registro No Encontrado !!',
            '',
            );
        }
                
        //return result;
        return this._serviceResp.respuestaHttp201(
        result,
        'Registro Encontrado !!',
        '',
        );

    }

    async getMaestroInscripcionById(id : number) {
        console.log('ueId: ', id);
    
        const result = await this.maeRepository.query(`
        SELECT
            maestro_inscripcion.id, 
            persona.paterno, 
            persona.materno, 
            persona.nombre, 
            persona.carnet_identidad, 
            persona.complemento, 
            persona.fecha_nacimiento, 
            persona.genero_tipo_id, 
            persona.estado_civil_tipo_id, 
            persona.sangre_tipo_id, 
            institucion_educativa_sucursal.institucion_educativa_id, 
            institucion_educativa_sucursal.sucursal_codigo, 
            institucion_educativa_sucursal.sucursal_nombre, 
            formacion_tipo.id as formacion_tipo_id, 
            formacion_tipo.formacion, 
            financiamiento_tipo.id as financiamiento_tipo_id, 
            financiamiento_tipo.financiamiento, 
            cargo_tipo.id as cargo_tipo_id, 
            cargo_tipo.cargo, 
            especialidad_tipo.id as especialidad_tipo_id, 
            especialidad_tipo.especialidad, 
            maestro_inscripcion.gestion_tipo_id, 
            maestro_inscripcion.normalista, 
            maestro_inscripcion.vigente, 
            maestro_inscripcion.formacion_descripcion, 
            maestro_inscripcion.braile, 
            maestro_inscripcion.asignacion_fecha_inicio, 
            maestro_inscripcion.asignacion_fecha_fin, 
            maestro_inscripcion.item, 
            maestro_inscripcion.periodo_tipo_id
        FROM
            maestro_inscripcion
            INNER JOIN
            persona
            ON 
                maestro_inscripcion.persona_id = persona.id
            INNER JOIN
            institucion_educativa_sucursal
            ON 
                maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
            INNER JOIN
            formacion_tipo
            ON 
                maestro_inscripcion.formacion_tipo_id = formacion_tipo.id
            INNER JOIN
            financiamiento_tipo
            ON 
                maestro_inscripcion.financiamiento_tipo_id = financiamiento_tipo.id
            INNER JOIN
            cargo_tipo
            ON 
                maestro_inscripcion.cargo_tipo_id = cargo_tipo.id
            INNER JOIN
            especialidad_tipo
            ON 
                maestro_inscripcion.especialidad_tipo_id = especialidad_tipo.id
            where maestro_inscripcion.id = ${id};`);

    
        console.log('result: ', result);
        console.log('result size: ', result.length);

        if(result.length === 0){
        //throw new NotFoundException('No se encontraron registros');
            return this._serviceResp.respuestaHttp404(
            result,
            'Registro No Encontrado !!',
            '',
            );
        }
                
        //return result;
        return this._serviceResp.respuestaHttp201(
        result,
        'Registro Encontrado !!',
        '',
        );

    }


}
