import { Grupo } from './grupo.model';

export class Horario {
    constructor(
        public nombre: string,
        public bloques: Bloque[]
    ) { }
}

export class Bloque {
    constructor(
        public orden: number,
        public rango: string,
        public horaInicio: string,
        public horaFin: string,
        public grupos: Grupo[]
    ) { }
}
