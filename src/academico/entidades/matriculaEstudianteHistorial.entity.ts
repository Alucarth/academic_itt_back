import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MatriculaEstudiante } from "./matriculaEstudiante.entity";
import { EstadoInstituto } from "./estadoInstituto.entity";

@Entity({ name: 'matricula_estudiante_historial', schema: 'public'})
export class MatriculaEstudianteHistorial{
    @PrimaryGeneratedColumn()
    id: number;
      
    @Column({ type: 'varchar', name: 'observacion' })
    observacion: string;
  
    @Exclude()
    @CreateDateColumn({
      name: 'fecha_registro',
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP',
    })
    fechaRegistro: Date;
  
    @Column({ type: 'integer', name: 'usuario_id' })
    usuarioId: number;
  
    @Column({ name: 'matricula_estudiante_id', nullable:false })
    matriculaEstudianteId: number;
  
    @ManyToOne(() => MatriculaEstudiante, (matriculaEstudiante) => matriculaEstudiante.id, { nullable: false, eager: true })
    @JoinColumn({ name: 'matricula_estudiante_id', referencedColumnName: 'id'})
    matriculaEstudiante: MatriculaEstudiante;
  
    @Column({ name: 'estado_instituto_id', nullable:false })
    estadoInstitutoId: number;
  
    @ManyToOne(() => EstadoInstituto, (estadoInstituto) => estadoInstituto.id, { nullable: false, cascade: false })
    @JoinColumn({ name: 'estado_instituto_id', referencedColumnName: 'id'})
    estadoInstituto: EstadoInstituto;
}