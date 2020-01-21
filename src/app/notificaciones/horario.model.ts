import { GrupoClase } from './grupoClase.model';

export class Horario {
    constructor(
        public dias: Dia[]
    ) { }
}

export class Dia {
    constructor(
        public nombre: string,
        public clave: string,
        public BloquesHorarios: BloqueHorario[]
    ) { }
}

export class BloqueHorario {
    constructor(
        public orden: number,
        public rango: string,
        public horaInicio: string,
        public horaFin: string,
        public gruposClase: GrupoClase[]
    ) { }
}
