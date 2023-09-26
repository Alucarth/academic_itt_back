import { User } from "src/users/entity/users.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { InstitucionEducativa } from "./institucionEducativa.entity";
import { RolTipo } from "./rolTipo.entity";
import { UnidadTerritorial } from "./unidadTerritorial.entity";

@Entity({ name: 'usuario_rol_institucion_educativa', schema: 'public' })
export class UsuarioRolInstitucionEducativa{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'integer', name:'uuario_id'})
    usuarioId: number;

    @ManyToOne(()=>User, (user)=>user.id)
    user: User

    @Column({type: 'integer', name:'institucion_educativa_id'})
    institucionEducativaId: number;

    @ManyToOne (()=>InstitucionEducativa, (institucion_educativa)=>institucion_educativa.id)
    institucionEducativa: InstitucionEducativa

    @Column({type: 'integer', name: 'rol_tipo_id'})
    rolTipoId: number
    
    @ManyToOne (()=> RolTipo, (rol_tipo)=>rol_tipo.id)
    rolTipo: RolTipo

    @Column({type: 'integer', name: 'unidad_territorial_id'})
    unidadTerritorialId: number

    @ManyToOne(()=> UnidadTerritorial, (unidad_territorial)=>unidad_territorial.id)
    unidadTerritorial: UnidadTerritorial

}