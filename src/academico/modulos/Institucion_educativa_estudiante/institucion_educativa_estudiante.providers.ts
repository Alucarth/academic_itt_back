import { InstitucionEducativaEstudiante } from "src/academico/entidades/InstitucionEducativaEstudiante.entity";
import { DataSource } from "typeorm";

export const institucionEducativaEstudianteProviders =[
    {
        provide: 'INSTITUCION_EDUCATIVA_ESTUDIANTE_REPOSITORY',
        useFactory: (dataSource: DataSource)=>dataSource.getRepository(InstitucionEducativaEstudiante),
        inject:['DATA_SOURCE']
    }
]