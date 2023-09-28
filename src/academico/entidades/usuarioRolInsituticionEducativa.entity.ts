import { User } from "src/users/entity/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { InstitucionEducativaSucursal } from "./institucionEducativaSucursal.entity";
import { UsuarioRol } from "./usuarioRol.entity";
import { Exclude } from "class-transformer";

@Entity({ name: 'usuario_rol_institucion_educativa', schema: 'public' })
export class UsuarioRolInstitucionEducativa{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'integer', name:'usuario_rol_id'})
    usuarioRolId: number;
    
    @ManyToOne(()=>UsuarioRol, (user_rol)=>user_rol.id)
    @JoinColumn({ name: 'usuario_rol_id', referencedColumnName: 'id'})
    user_rol: UsuarioRol

    @Column({type: 'integer', name:'institucion_educativa_sucursal_id'})
    institucionEducativaSucursalId: number;

    @ManyToOne (()=>InstitucionEducativaSucursal, (institucion_educativa_sucursal)=>institucion_educativa_sucursal.id)
    @JoinColumn({ name: 'institucion_educativa_sucursal_id', referencedColumnName: 'id'})
    institucionEducativaSucursal: InstitucionEducativaSucursal

    @Column()
    activo: boolean
    
    @Column({type: 'integer', name:'usuario_registro'})
    usuarioRegistro: number;

    @Exclude()
    @CreateDateColumn({
      name: 'fecha_registro',
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP',
    })
    fechaRegistro: Date;
  
    @Exclude()
    @UpdateDateColumn({
      name: 'fecha_modificacion',
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP',
    })
    fechaModificacion: Date;

    // @Column({type: 'integer', name: 'rol_tipo_id'})
    // rolTipoId: number  
    
    // @ManyToOne (()=> RolTipo, (rol_tipo)=>rol_tipo.id)
    // @JoinColumn({ name: 'rol_tipo_id', referencedColumnName: 'id'})
    // rolTipo: RolTipo

    // @Column({type: 'integer', name: 'unidad_territorial_id'})
    // unidadTerritorialId: number

    // @ManyToOne(()=> UnidadTerritorial, (unidad_territorial)=>unidad_territorial.id)
    // @JoinColumn({ name: 'unidad_territorial_id', referencedColumnName: 'id'})
    // unidadTerritorial: UnidadTerritorial

}