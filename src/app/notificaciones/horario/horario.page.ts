import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../notificaciones.service';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';

import { Grupo } from '../grupo.model';
import { GrupoClase } from '../grupoClase.model';
import { Horario, Dia, BloqueHorario } from '../horario.model';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.page.html',
  styleUrls: ['./horario.page.scss'],
})
export class HorarioPage {
  private gruposSub: Subscription;
  grupos: Grupo[] = [];
  bloquesHorarios: BloqueHorario[] = [
    new BloqueHorario(
      1,
      '7:00 a 8:30',
      '7:00',
      '8:30',
      []
    ),
    new BloqueHorario(
      2,
      '8:30 a 10:00',
      '8:30',
      '10:00',
      []
    ),
    new BloqueHorario(
      3,
      '10:00 a 11:30',
      '10:00',
      '11:30',
      []
    ),
    new BloqueHorario(
      4,
      '11:30 a 13:00',
      '11:30',
      '13:00',
      []
    ),
    new BloqueHorario(
      5,
      '13:00 a 14:30',
      '13:00',
      '14:30',
      []
    ),
    new BloqueHorario(
      6,
      '14:30 a 16:00',
      '14:30',
      '16:00',
      []
    ),
    new BloqueHorario(
      7,
      '16:00 a 17:30',
      '16:00',
      '17:30',
      []
    ),
    new BloqueHorario(
      8,
      '17:30 a 19:00',
      '17:30',
      '19:00',
      []
    ),
    new BloqueHorario(
      9,
      '19:00 a 20:30',
      '19:00',
      '20:30',
      []
    ),
    new BloqueHorario(
      10,
      '20:30 a 22:00',
      '20:30',
      '22:00',
      []
    )
  ];
  horario: Horario = new Horario(
      [
        new Dia	(
          'Lunes',
          'l',
          JSON.parse(JSON.stringify(this.bloquesHorarios))
        ),
        new Dia	(
          'Martes',
          'm',
          JSON.parse(JSON.stringify(this.bloquesHorarios))
        ),
        new Dia	(
          'Miércoles',
          'x',
          JSON.parse(JSON.stringify(this.bloquesHorarios))
        ),
        new Dia	(
          'Jueves',
          'j',
          JSON.parse(JSON.stringify(this.bloquesHorarios))
        ),
        new Dia	(
          'Viernes',
          'v',
          JSON.parse(JSON.stringify(this.bloquesHorarios))
        ),
      ]
    );

  constructor(private notifService: NotificacionesService, private storage: Storage) { }

  ionViewWillEnter() {
    // Recuperar grupos suscritos del usuario
    this.grupos = [];

    this.storage
      .get('gruposSuscritos')
      .then(gruposSuscritos => {
        if (gruposSuscritos !== null) {
          gruposSuscritos.forEach(grupo => {
            this.grupos.push(grupo);
          });
        }

        // Resetea el horario
        this.horario.dias.forEach(dia => {
          dia.BloquesHorarios.forEach(bloque => {
            bloque.gruposClase = [];
          });
        });

        // Armar Horario con las clases de los grupos suscritos
        if (this.grupos.length > 0) {
          const fechaHoy: Date = new Date(Date.now());
          const claveHoy = this.getClaveDiaHoy();
          this.grupos.forEach(grupo => {
            grupo.Clases.forEach(clase => {
              const dia: Dia = this.horario.dias.find(diaClase => diaClase.clave === clase.claveDia);
              const bloque: BloqueHorario = dia.BloquesHorarios.find(bloqueClase => bloqueClase.horaInicio === clase.horaInicio);

              // Si la clase no es de 1:30 de duración dividir en dos bloques
              // Comprobar si la clase es de 1:30 de duración
              const formatoHora: RegExp = /([0-1]?[0-9]|2[0-3]):/;
              const formatoMinuto: RegExp = /:[0-5][0-9]/;

              const horaInicio = formatoHora.exec(bloque.horaInicio);
              const minInicio = formatoMinuto.exec(bloque.horaInicio);
              const dateInicio = new Date(
                fechaHoy.getFullYear(),
                fechaHoy.getMonth(),
                fechaHoy.getDate(),
                parseInt(horaInicio[0].slice(0, -1), 10),
                parseInt(minInicio[0].slice(1), 10), 0
                );

              const horaFin = formatoHora.exec(bloque.horaFin);
              const minFin = formatoMinuto.exec(bloque.horaFin);
              const dateFin = new Date(
                fechaHoy.getFullYear(),
                fechaHoy.getMonth(),
                fechaHoy.getDate(),
                parseInt(horaFin[0].slice(0, -1), 10),
                parseInt(minFin[0].slice(1), 10), 0
                );

              const minDiferencia = (dateFin.getTime() - dateInicio.getTime()) / 60000;

              // Si los minutos de diferencia entre fechas es mayor a 90 min, se generan dos bloques
              if (minDiferencia > 90) {
                let bloqueSegundaHora: BloqueHorario;
                bloqueSegundaHora = dia.BloquesHorarios.find(bloqueClase => bloqueClase.horaInicio === (horaFin + ':' + minFin));

                // Si el bloque horario esta transcurriendo se marca como en curso
                if (fechaHoy.getTime() >= dateInicio.getTime() && fechaHoy.getTime() <= dateFin.getTime() && dia.clave === claveHoy) {
                  bloqueSegundaHora.gruposClase.push(new GrupoClase (
                    grupo.id,
                    grupo.clave,
                    grupo.asignatura,
                    grupo.docente,
                    clase.aula,
                    'success'
                  ));
                } else {
                  bloqueSegundaHora.gruposClase.push(new GrupoClase (
                    grupo.id,
                    grupo.clave,
                    grupo.asignatura,
                    grupo.docente,
                    clase.aula,
                    'primary'
                  ));
                }
              }

              // Si el bloque horario esta transcurriendo se marca como en curso
              if (fechaHoy.getTime() >= dateInicio.getTime() && fechaHoy.getTime() <= dateFin.getTime() && dia.clave === claveHoy) {
                // Construir y agregar GrupoClase
                bloque.gruposClase.push(new GrupoClase (
                  grupo.id,
                  grupo.clave,
                  grupo.asignatura,
                  grupo.docente,
                  clase.aula,
                  'success'
                ));
              } else {
                // Construir y agregar GrupoClase
                bloque.gruposClase.push(new GrupoClase (
                  grupo.id,
                  grupo.clave,
                  grupo.asignatura,
                  grupo.docente,
                  clase.aula,
                  'primary'
                ));
              }
            });
          });
        }
      });
  }

  getClaveDiaHoy() {
    const fechaHoy: Date = new Date(Date.now());
    const dias = ['d', 'l', 'm', 'x', 'j', 'v', 's'];
    return dias[fechaHoy.getDay()];
  }
}
