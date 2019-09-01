import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Grupo } from './grupo.model';
import { tap, take, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Carrera } from './carrera.model';
import { Dia } from './dia.model';

@Injectable({
    providedIn: 'root'
})

export class NotificacionesService {
    private Grupos = new BehaviorSubject<Grupo[]>([]);
    carreras: Carrera[] = [
        new Carrera(
            'ice',
            'e',
            'Ingeniería en Comunicaciones y Electrónica',
            9
        ),
        new Carrera(
            'ic',
            'c',
            'Ingeniería en Computación',
            8
        ),
        new Carrera(
            'im',
            'm',
            'Ingeniería Mecánica',
            9
        ),
        new Carrera(
            'isisa',
            's',
            'Ingeniería en Sistemas Automotricez',
            9
        )
    ];

    constructor(private http: HttpClient, private storage: Storage) { }

    get grupos() {
        return this.Grupos.asObservable();
    }

    getGrupos(valorBusqueda: string) {
        // Armar link para api respecto a los valores introducidos
        let url = 'http://www.eventos.esimecu.ipn.mx/horarios-2/index/compartir-grupales?';
        
        // Recuperar grupos ya suscritos
        const gruposSuscritos: Grupo[] = [];
        this.storage
        .get('gruposSuscritos')
        .then(GruposSuscritos => {
          if (GruposSuscritos !== null) {
            GruposSuscritos.forEach(grupo => {
                gruposSuscritos.push(grupo);
            });
          }
        });

        // Traer todos los grupos de una semestre de la carrera indicada
        if (valorBusqueda.length === 2) {
            // Primera parte - Carrera
            this.carreras.forEach(carrera => {
                if (valorBusqueda[1].toLowerCase() === carrera.claveCorta) {
                    return url = url + 'carrera=' + carrera.clave;
                }

                // Si no encuentra ninguna carrera con esa clave, revisar si es un nombre.
            });

            // Segunda parte - Periodo
            // Traer el primer periodo
            return this.http
            .get(url)
            .pipe(
                map(periodos => {
                    url = url + '&periodo=' + periodos['data'][0].periodo;
                }),
                tap(periodos => {
                    // Tercera parte - Llamada a API
                    this.http.get(url).pipe(map(grupos => {
                        const gruposCargados: Grupo[] = [];
                        for (const grupo in grupos['data']) {
                            // Si la asignatura no es null
                            if (grupos['data'][grupo].v_a !== '') {
                                // Si es el semestre buscado
                                if (valorBusqueda[0] === grupos['data'][grupo].v_g.charAt(0)) {
                                    // Si el grupo ya esta suscrito
                                    if (gruposSuscritos.find(g => g.id === grupos['data'][grupo].orden + grupos['data'][grupo].v_g)) {
                                        gruposCargados.push
                                        (
                                            new Grupo
                                                (
                                                    grupos['data'][grupo].orden + grupos['data'][grupo].v_g,
                                                    grupos['data'][grupo].v_g,
                                                    grupos['data'][grupo].v_a,
                                                    grupos['data'][grupo].carrera,
                                                    grupos['data'][grupo].v_g.charAt(2),
                                                    grupos['data'][grupo].v_g.charAt(0),
                                                    grupos['data'][grupo].v_d,
                                                    [
                                                        new Dia(
                                                            'Lunes',
                                                            grupos['data'][grupo].v_l
                                                        ),
                                                        new Dia(
                                                            'Martes',
                                                            grupos['data'][grupo].v_m,
                                                        ),
                                                        new Dia(
                                                            'Miercoles',
                                                            grupos['data'][grupo].v_x
                                                        ),
                                                        new Dia(
                                                            'Jueves',
                                                            grupos['data'][grupo].v_j
                                                        ),
                                                        new Dia(
                                                            'Viernes',
                                                            grupos['data'][grupo].v_v,
                                                        ),
                                                    ],
                                                    true
                                                )
                                        );
                                    } else {
                                        gruposCargados.push
                                            (
                                                new Grupo
                                                    (
                                                        grupos['data'][grupo].orden + grupos['data'][grupo].v_g,
                                                        grupos['data'][grupo].v_g,
                                                        grupos['data'][grupo].v_a,
                                                        grupos['data'][grupo].carrera,
                                                        grupos['data'][grupo].v_g.charAt(2),
                                                        grupos['data'][grupo].v_g.charAt(0),
                                                        grupos['data'][grupo].v_d,
                                                        [
                                                            new Dia(
                                                                'Lunes',
                                                                grupos['data'][grupo].v_l
                                                            ),
                                                            new Dia(
                                                                'Martes',
                                                                grupos['data'][grupo].v_m,
                                                            ),
                                                            new Dia(
                                                                'Miercoles',
                                                                grupos['data'][grupo].v_x
                                                            ),
                                                            new Dia(
                                                                'Jueves',
                                                                grupos['data'][grupo].v_j
                                                            ),
                                                            new Dia(
                                                                'Viernes',
                                                                grupos['data'][grupo].v_v,
                                                            ),
                                                        ],
                                                        false
                                                    )
                                            );
                                    }
                                }
                            }
                        }
                        return gruposCargados;
                    }),
                        tap(gruposCargados => {
                            this.Grupos.next(gruposCargados);
                            // console.log(gruposCargados);
                        })).subscribe();
                }));
        } else if (valorBusqueda.length === 3) {
            // Traer todos los grupos de un turno del semestre y carrera indicados
            // Primera parte - Carrera
            this.carreras.forEach(carrera => {
                if (valorBusqueda[1].toLowerCase() === carrera.claveCorta) {
                    return url = url + 'carrera=' + carrera.clave;
                }

                // Si no encuentra ninguna carrera con esa clave, revisar si es un nombre.
            });

            // Segunda parte - Periodo
            // Traer el primer periodo
            return this.http.get(url).pipe(
                map(periodos => {
                    url = url + '&periodo=' + periodos['data'][0].periodo;
                }),
                tap(periodos => {
                    // Tercera parte - Llamada a API
                    this.http.get(url).pipe(map(grupos => {
                        const gruposCargados: Grupo[] = [];
                        for (const grupo in grupos['data']) {
                            if (grupos['data'][grupo].v_a !== '') {
                                // Cuarta parte - Filtrar a grupos del semestre elegio
                                if (valorBusqueda[0] === grupos['data'][grupo].v_g.charAt(0)) {
                                    // Quinta parte - Filtrar a grupos del turno elegio
                                    if (valorBusqueda[2].toLowerCase() === grupos['data'][grupo].v_g.charAt(2).toLowerCase()) {
                                        // Si el grupo ya esta suscrito
                                        if (gruposSuscritos.find(g => g.id === grupos['data'][grupo].orden + grupos['data'][grupo].v_g)) {
                                            gruposCargados.push
                                            (
                                                new Grupo
                                                    (
                                                        grupos['data'][grupo].orden + grupos['data'][grupo].v_g,
                                                        grupos['data'][grupo].v_g,
                                                        grupos['data'][grupo].v_a,
                                                        grupos['data'][grupo].carrera,
                                                        grupos['data'][grupo].v_g.charAt(2),
                                                        grupos['data'][grupo].v_g.charAt(0),
                                                        grupos['data'][grupo].v_d,
                                                        [
                                                            new Dia(
                                                                'Lunes',
                                                                grupos['data'][grupo].v_l
                                                            ),
                                                            new Dia(
                                                                'Martes',
                                                                grupos['data'][grupo].v_m,
                                                            ),
                                                            new Dia(
                                                                'Miercoles',
                                                                grupos['data'][grupo].v_x
                                                            ),
                                                            new Dia(
                                                                'Jueves',
                                                                grupos['data'][grupo].v_j
                                                            ),
                                                            new Dia(
                                                                'Viernes',
                                                                grupos['data'][grupo].v_v,
                                                            ),
                                                        ],
                                                        true
                                                    )
                                            );
                                        } else {
                                            gruposCargados.push
                                            (
                                                new Grupo
                                                    (
                                                        grupos['data'][grupo].orden + grupos['data'][grupo].v_g,
                                                        grupos['data'][grupo].v_g,
                                                        grupos['data'][grupo].v_a,
                                                        grupos['data'][grupo].carrera,
                                                        grupos['data'][grupo].v_g.charAt(2),
                                                        grupos['data'][grupo].v_g.charAt(0),
                                                        grupos['data'][grupo].v_d,
                                                        [
                                                            new Dia(
                                                                'Lunes',
                                                                grupos['data'][grupo].v_l
                                                            ),
                                                            new Dia(
                                                                'Martes',
                                                                grupos['data'][grupo].v_m,
                                                            ),
                                                            new Dia(
                                                                'Miercoles',
                                                                grupos['data'][grupo].v_x
                                                            ),
                                                            new Dia(
                                                                'Jueves',
                                                                grupos['data'][grupo].v_j
                                                            ),
                                                            new Dia(
                                                                'Viernes',
                                                                grupos['data'][grupo].v_v,
                                                            ),
                                                        ],
                                                        false
                                                    )
                                            );
                                        }
                                    }
                                }
                            }
                        }
                        return gruposCargados;
                    }),
                        tap(gruposCargados => {
                            this.Grupos.next(gruposCargados);
                            // console.log(gruposCargados);
                        })).subscribe();
                }));
        } else if (valorBusqueda.length === 5) {
            // Traer el grupo especificado
            // Primera parte - Carrera
            this.carreras.forEach(carrera => {
                if (valorBusqueda[1].toLowerCase() === carrera.claveCorta) {
                    return url = url + 'carrera=' + carrera.clave;
                }

                // Si no encuentra ninguna carrera con esa clave, revisar si es un nombre.
            });

            // Segunda parte - Periodo
            // Traer el primer periodo
            return this.http.get(url).pipe(
                map(periodos => {
                    url = url + '&periodo=' + periodos['data'][0].periodo;
                }),
                tap(periodos => {
                    // Tercera parte - Llamada a API
                    this.http.get(url).pipe(map(grupos => {
                        const gruposCargados: Grupo[] = [];
                        for (const grupo in grupos['data']) {
                            if (grupos['data'][grupo].v_a !== '') {
                                // Cuarta parte - Elegir el grupo especificado
                                if (valorBusqueda.toLowerCase() === grupos['data'][grupo].v_g.toLowerCase()) {
                                    // Si el grupo ya esta suscrito
                                    if (gruposSuscritos.find(g => g.id === grupos['data'][grupo].orden + grupos['data'][grupo].v_g)) { 
                                        gruposCargados.push
                                        (
                                            new Grupo
                                                (
                                                    grupos['data'][grupo].orden + grupos['data'][grupo].v_g,
                                                    grupos['data'][grupo].v_g,
                                                    grupos['data'][grupo].v_a,
                                                    grupos['data'][grupo].carrera,
                                                    grupos['data'][grupo].v_g.charAt(2),
                                                    grupos['data'][grupo].v_g.charAt(0),
                                                    grupos['data'][grupo].v_d,
                                                    [
                                                        new Dia(
                                                            'Lunes',
                                                            grupos['data'][grupo].v_l
                                                        ),
                                                        new Dia(
                                                            'Martes',
                                                            grupos['data'][grupo].v_m,
                                                        ),
                                                        new Dia(
                                                            'Miercoles',
                                                            grupos['data'][grupo].v_x
                                                        ),
                                                        new Dia(
                                                            'Jueves',
                                                            grupos['data'][grupo].v_j
                                                        ),
                                                        new Dia(
                                                            'Viernes',
                                                            grupos['data'][grupo].v_v,
                                                        ),
                                                    ],
                                                    true
                                                )
                                        );
                                    } else {
                                        gruposCargados.push
                                        (
                                            new Grupo
                                                (
                                                    grupos['data'][grupo].orden + grupos['data'][grupo].v_g,
                                                    grupos['data'][grupo].v_g,
                                                    grupos['data'][grupo].v_a,
                                                    grupos['data'][grupo].carrera,
                                                    grupos['data'][grupo].v_g.charAt(2),
                                                    grupos['data'][grupo].v_g.charAt(0),
                                                    grupos['data'][grupo].v_d,
                                                    [
                                                        new Dia(
                                                            'Lunes',
                                                            grupos['data'][grupo].v_l
                                                        ),
                                                        new Dia(
                                                            'Martes',
                                                            grupos['data'][grupo].v_m,
                                                        ),
                                                        new Dia(
                                                            'Miercoles',
                                                            grupos['data'][grupo].v_x
                                                        ),
                                                        new Dia(
                                                            'Jueves',
                                                            grupos['data'][grupo].v_j
                                                        ),
                                                        new Dia(
                                                            'Viernes',
                                                            grupos['data'][grupo].v_v,
                                                        ),
                                                    ],
                                                    false
                                                )
                                        );
                                    }
                                }
                            }
                        }
                        return gruposCargados;
                    }),
                        tap(gruposCargados => {
                            this.Grupos.next(gruposCargados);
                            // console.log(gruposCargados);
                        })).subscribe();
                }));
        }
    }
}
