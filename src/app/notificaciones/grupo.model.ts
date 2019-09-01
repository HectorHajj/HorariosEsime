import { Maestro } from './maestro.model';
import { Carrera } from './carrera.model';
import { Dia } from './dia.model';

export class Grupo {
    constructor(
        public id: string,
        public clave: string,
        public asignatura: string,
        public carrera: Carrera,
        public turno: string,
        public semestre: number,
        public maestro: Maestro,
        public Horario: Dia[],
        public checked: boolean
    ) {}
}
