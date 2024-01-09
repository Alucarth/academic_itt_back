import { User } from "src/users/entity/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RolTipo } from "./rolTipo.entity";

@Entity()
export class UsuarioRol {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', name: 'usuario_id' })
    usuarioId: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'usuario_id', referencedColumnName: 'id' })
    user: User

    @Column({ type: 'integer', name: 'rol_tipo_id' })
    rolTipoId: number

    @ManyToOne(() => RolTipo, (rol_tipo) => rol_tipo.id)
    @JoinColumn({ name: 'rol_tipo_id', referencedColumnName: 'id' })
    rolTipo: RolTipo

}