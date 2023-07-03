import { DataSource } from "typeorm";
import { MatriculaEstudiante } from "src/academico/entidades/matriculaEstudiante.entity";

export const matriculaProviders =[
    {
        provide: 'MATRICULA_ESTUDIANTE_REPOSITORY',
        useFactory: (dataSource: DataSource)=> dataSource.getRepository(MatriculaEstudiante),
        inject: ['DATA_SOURCE']
    }
]