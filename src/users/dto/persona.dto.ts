
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class PersonaBusquedaCiFechaNacDTO {
  @Expose()
  ci: string;

  @Expose()
  complemento?: string;

  @Expose()
  fechaNac: Date;
}

export class PersonaMReadDto {
  @Type(() => Number)
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'carnet_identidad' })
  carnetIdentidad: string;

  @Expose({ name: 'complemento' })
  complemento: string;

  @Expose({ name: 'paterno' })
  paterno: string;

  @Expose({ name: 'materno' })
  materno: boolean;

  @Expose({ name: 'nombre' })
  nombre: string;

  @Expose({ name: 'fecha_nacimiento' })
  fechaNacimiento: Date;

  @Expose({ name: 'codigo_rude' })
  codigoRude: string;

  @Expose({ name: 'genero_tipo_id' })
  generoTipoId: number;

  @Expose({ name: 'estado_civil_tipo_id' })
  estadoCivilTipoId: number;

  @Expose({ name: 'sangre_tipo_id' })
  sangreTipoId: number;

  @Expose({ name: 'materno_idioma_tipo_id' })
  maternoIdiomaTipoId: number;

  @Expose({ name: 'segip_tipo_id' })
  segipTipoId: number;

  @Expose({ name: 'expedido_unidad_territorial_id' })
  expedidoUnidadTerritorialTipoId: number;

  @Expose({ name: 'nacimiento_unidad_territorial_id' })
  nacimientoUnidadTerritorialTipoId: number;

  @Expose({ name: 'nacimiento_oficialia' })
  nacimientoOficialia: string;

  @Expose({ name: 'nacimiento_libro' })
  nacimientoLibro: string;

  @Expose({ name: 'nacimiento_partida' })
  nacimientoPartida: string;

  @Expose({ name: 'nacimiento_folio' })
  nacimientoFolio: string;

  @Expose({ name: 'carnet_ibc' })
  carnetIbc: string;

  @Expose({ name: 'pasaporte' })
  pasaporte: string;

  @Expose({ name: 'libreta_militar' })
  libretaMilitar: string;

  @Expose({ name: 'doble_nacionalidad' })
  dobleNacionalidad: boolean;

  @Expose({ name: 'codigo_rda' })
  codigoRda: string;

  @Expose({ name: 'nacimiento_localidad' })
  nacimientoLocalidad: string;

  @Expose({ name: 'observacion' })
  observacion: string;

  @Expose({ name: 'tiene_discapacidad' })
  tieneDiscapacidad: boolean;

  @Type(() => Number)
  @Expose({ name: 'estudiante_id' })
  estudianteId: number;
}

export class PersonaMSearchDto {
  //@IsNotEmpty()
  carnetIdentidad: string; // cuento elementos se sacara

  //@IsNotEmpty()
  fechaNacimiento: Date; // desde que elemento se hara el get

  //@IsOptional()
  complemento: string;
}