import { Clase } from './clase.model';

export class Grupo {
    constructor(
        public id: string,
        public clave: string,
        public asignatura: string,
        public docente: string,
        public Clases: Clase[],
        public checked: boolean
    ) {}
}
