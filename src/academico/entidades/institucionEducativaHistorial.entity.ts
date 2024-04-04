import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { InstitucionEducativa } from "./institucionEducativa.entity";
import { InstitucionEducativaSucursal } from "./institucionEducativaSucursal.entity";
import { DependenciaTipo } from "./dependenciaTipo.entity";
import { UsuarioRol } from "./usuarioRol.entity";
import { User } from "src/users/entity/users.entity";

@Entity({ name: 'institucion_educativa_historial', schema: 'public'})
export class InstitucionEducativaHistorial {
    @PrimaryColumn()
    id: number;

    @Column({ type: 'integer', name: 'institucion_educativa_id' })
    institucionEducativaId: number;

    @ManyToOne(() => InstitucionEducativa, (institucionEducativa) => institucionEducativa.id)
    @JoinColumn({ name: 'institucion_educativa_id', referencedColumnName: 'id'})
    institucionEducativa: InstitucionEducativa;

    @Column({ type: 'integer', name: 'institucion_educativa_sucursal_id' })
    institucionEducativaSucursalId: number;

    @ManyToOne(() => InstitucionEducativaSucursal, (institucionEducativaSucursal) => institucionEducativaSucursal.id)
    @JoinColumn({ name: 'institucion_educativa_sucursal_id', referencedColumnName: 'id'})
    institucionEducativaSucursal: InstitucionEducativaSucursal;

    @Column({ type: 'varchar', name: 'from_denominacion' })
    fromDenominacion: string;

    @Column({ type: 'varchar', name: 'to_denominacion' })
    toDenominacion: string;

    @Column({ type: 'integer', name: 'from_dependencia_tipo_id' })
    fromDependenciaTipoId: number;

    @ManyToOne(() => DependenciaTipo, (dependenciaTipo) => dependenciaTipo.id)
    @JoinColumn({ name: 'from_dependencia_tipo_id', referencedColumnName: 'id'})
    fromDependenciaTipo: DependenciaTipo;

    @Column({ type: 'integer', name: 'to_dependencia_tipo_id' })
    toDependenciaTipoId: number;
  
    @ManyToOne(() => DependenciaTipo, (dependenciaTipo) => dependenciaTipo.id)
    @JoinColumn({ name: 'to_dependencia_tipo_id', referencedColumnName: 'id'})
    toDependenciaTipo: DependenciaTipo;

    @Column({ type: 'varchar', name: 'descripcion' })
    descripcion: string;


    @Column({ type: 'integer', name: 'usuario_id' })
    usuarioId: number;

    @ManyToOne(() => User, (usuario) => usuario.id)
    @JoinColumn({ name: 'usuario_id', referencedColumnName: 'id'})
    usuario: User;


    @Exclude()
    @CreateDateColumn({
      name: 'fecha_registro',
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP',
    })
    fechaRegistro: Date;
}