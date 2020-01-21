import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Grupo } from './grupo.model';
import { tap, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Carrera } from './carrera.model';
import { Clase } from './clase.model';

@Injectable({
    providedIn: 'root'
})
export class NotificacionesService {
    private Grupos = new BehaviorSubject<Grupo[]>([]);
    carreras: Carrera[] = [
        new Carrera('ice', 'e', 'Ingeniería en Comunicaciones y Electrónica', 9),
        new Carrera('ic', 'c', 'Ingeniería en Computación', 8),
        new Carrera('im', 'm', 'Ingeniería Mecánica', 9),
        new Carrera('isisa', 's', 'Ingeniería en Sistemas Automotricez', 9)
    ];
    private gruposSuscritos: Grupo[] = [];

    constructor(private http: HttpClient, private storage: Storage) { }

    construirGrupo(grupo, aula, suscrito: boolean) {
        const Clases: Clase[] = [];
        const formatoHora: RegExp = /([0-1]?[0-9]|2[0-3]):[0-5][0-9]/g;
        let arrayHoras;
        let horaInicio;
        let horaFin;
        let contador = 0;

        if (grupo.v_l !== '-') {
            while ((arrayHoras = formatoHora.exec(grupo.v_l)) !== null) {
                if (contador === 0) {
                    horaInicio = arrayHoras[0];
                    contador++;
                } else if (contador === 1) {
                    horaFin = arrayHoras[0];
                    contador = 0;
                }
            }
            Clases.push(new Clase('l', horaInicio, horaFin, aula.v_l));
        }
        if (grupo.v_m !== '-') {
            while ((arrayHoras = formatoHora.exec(grupo.v_m)) !== null) {
                if (contador === 0) {
                    horaInicio = arrayHoras[0];
                    contador++;
                } else if (contador === 1) {
                    horaFin = arrayHoras[0];
                    contador = 0;
                }
            }
            Clases.push(new Clase('m', horaInicio, horaFin, aula.v_m));
        }
        if (grupo.v_x !== '-') {
            while ((arrayHoras = formatoHora.exec(grupo.v_x)) !== null) {
                if (contador === 0) {
                    horaInicio = arrayHoras[0];
                    contador++;
                } else if (contador === 1) {
                    horaFin = arrayHoras[0];
                    contador = 0;
                }
            }
            Clases.push(new Clase('x', horaInicio, horaFin, aula.v_x));
        }
        if (grupo.v_j !== '-') {
            while ((arrayHoras = formatoHora.exec(grupo.v_j)) !== null) {
                if (contador === 0) {
                    horaInicio = arrayHoras[0];
                    contador++;
                } else if (contador === 1) {
                    horaFin = arrayHoras[0];
                    contador = 0;
                }
            }
            Clases.push(new Clase('j', horaInicio, horaFin, aula.v_j));
        }
        if (grupo.v_v !== '-') {
            while ((arrayHoras = formatoHora.exec(grupo.v_v)) !== null) {
                if (contador === 0) {
                    horaInicio = arrayHoras[0];
                    contador++;
                } else if (contador === 1) {
                    horaFin = arrayHoras[0];
                    contador = 0;
                }
            }
            Clases.push(new Clase('v', horaInicio, horaFin, aula.v_v));
        }

        return new Grupo(
            // Id
            grupo.orden + grupo.v_g,
            // Clave
            grupo.v_g,
            // Asignatura
            grupo.v_a,
            // Docente
            grupo.v_d,
            // Clases
            Clases,
            // Suscrito
            suscrito
        );
    }

    getGruposBySemestreCarrera(valorBusqueda, url) {
        // Llamada a API
        return this.http.get(url).pipe(
            tap(data => {
                const gruposCargados: Grupo[] = [];
                const datos = data['data'];

                // Iterar sobre lista de grupos traidos de API
                // Armar grupos con sus detalles
                let i: number;
                for (i = 0; i < Object.keys(datos).length; i += 2) {
                    const grupo = datos[i];
                    const aula = datos[i + 1];

                    // Si es el semestre buscado
                    if (valorBusqueda[0] === grupo.v_g.charAt(0)) {
                        // Si el grupo ya esta suscrito
                        if (this.gruposSuscritos.find(g => g.id === grupo.orden + grupo.v_g)) {
                            gruposCargados.push(this.construirGrupo(grupo, aula, true));
                        } else {
                            gruposCargados.push(this.construirGrupo(grupo, aula, false));
                        }
                    }
                }
                this.Grupos.next(gruposCargados);
            })
        ).subscribe();
    }

    getGruposBySemestreCarreraTurno(valorBusqueda, url) {
        // Llamada a API
        return this.http.get(url).pipe(
            tap(data => {
                const gruposCargados: Grupo[] = [];
                const datos = data['data'];

                // Iterar sobre lista de grupos traidos de API
                // Armar grupos con sus detalles
                let i: number;
                for (i = 0; i < Object.keys(datos).length; i += 2) {
                    const grupo = datos[i];
                    const aula = datos[i + 1];

                    // Si es el semestre buscado
                    if (valorBusqueda[0] === grupo.v_g.charAt(0)) {
                        // Filtrar a grupos del turno elegido
                        if (valorBusqueda[2].toLowerCase() === grupo.v_g.charAt(2).toLowerCase()) {
                            // Si el grupo ya esta suscrito
                            if (this.gruposSuscritos.find(g => g.id === grupo.orden + grupo.v_g)) {
                                gruposCargados.push(this.construirGrupo(grupo, aula, true));
                            } else {
                                gruposCargados.push(this.construirGrupo(grupo, aula, false));
                            }
                        }
                    }
                }
                this.Grupos.next(gruposCargados);
            })
        ).subscribe();
    }

    getGrupoByClave(valorBusqueda, url) {
        // Llamada a API
        return this.http.get(url).pipe(
            tap(data => {
                const gruposCargados: Grupo[] = [];
                const datos = data['data'];

                // Iterar sobre lista de grupos traidos de API
                // Armar grupos con sus detalles
                let i: number;
                for (i = 0; i < Object.keys(datos).length; i += 2) {
                    const grupo = datos[i];
                    const aula = datos[i + 1];

                    // Si es el semestre buscado
                    if (valorBusqueda[0] === grupo.v_g.charAt(0)) {
                        // Elegir el grupo especificado
                        if (valorBusqueda.toLowerCase() === grupo.v_g.toLowerCase()) {
                            // Si el grupo ya esta suscrito
                            if (this.gruposSuscritos.find(g => g.id === grupo.orden + grupo.v_g)) {
                                gruposCargados.push(this.construirGrupo(grupo, aula, true));
                            } else {
                                gruposCargados.push(this.construirGrupo(grupo, aula, false));
                            }
                        }
                    }
                }
                this.Grupos.next(gruposCargados);
            })
        ).subscribe();
    }

    get grupos() {
        return this.Grupos.asObservable();
    }

    getGrupos(valorBusqueda: string) {
        // Armar link para api respecto a los valores introducidos
        let url = 'http://www.eventos.esimecu.ipn.mx/horarios-2/index/compartir-grupales?';

        // Recuperar grupos ya suscritos
        this.gruposSuscritos = [];
        this.storage.get('gruposSuscritos').then(GruposSuscritos => {
            if (GruposSuscritos !== null) {
                GruposSuscritos.forEach(grupo => {
                    this.gruposSuscritos.push(grupo);
                });
            }
        });

        // Traer todos los grupos de el semestre de la carrera indicada
        if (valorBusqueda.length === 2) {
            // Si la búsqueda contiene la clave de una carrera existente
            this.carreras.forEach(carrera => {
                if (valorBusqueda[1].toLowerCase() === carrera.claveCorta) {
                    return (url = url + 'carrera=' + carrera.clave);
                }
            });

            // Llama a API para determinar periodos disponibles
            return this.http.get(url).pipe(
                tap(data => {
                    // Traer el periodo en curso actual
                    url = url + '&periodo=' + data['data'][data['data'].length - 1].periodo;
                    return this.getGruposBySemestreCarrera(valorBusqueda, url);
                })
            );
        } else if (valorBusqueda.length === 3) {
            // Traer todos los grupos de un turno del semestre y carrera indicados
            // Si la búsqueda contiene la clave de una carrera existente
            this.carreras.forEach(carrera => {
                if (valorBusqueda[1].toLowerCase() === carrera.claveCorta) {
                    return (url = url + 'carrera=' + carrera.clave);
                }
            });

            // Llama a API para determinar periodos disponibles
            return this.http.get(url).pipe(
                tap(data => {
                    // Traer el periodo en curso actual
                    url = url + '&periodo=' + data['data'][data['data'].length - 1].periodo;
                    return this.getGruposBySemestreCarreraTurno(valorBusqueda, url);
                })
            );
        } else if (valorBusqueda.length === 5) {
            // Traer el grupo especificado
            // Si la búsqueda contiene la clave de una carrera existente
            this.carreras.forEach(carrera => {
                if (valorBusqueda[1].toLowerCase() === carrera.claveCorta) {
                    return (url = url + 'carrera=' + carrera.clave);
                }
            });

            // Llama a API para determinar periodos disponibles
            return this.http.get(url).pipe(
                tap(data => {
                    // Traer el periodo en curso actual
                    url = url + '&periodo=' + data['data'][data['data'].length - 1].periodo;
                    return this.getGrupoByClave(valorBusqueda, url);
                })
            );
        }
    }
}
