import { Component, OnInit } from '@angular/core';
import { NotificacionesService } from '../notificaciones.service';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';

import { Grupo } from '../grupo.model';
import { Horario, Bloque } from '../horario.model';
import { Time } from '@angular/common';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.page.html',
  styleUrls: ['./horario.page.scss'],
})
export class HorarioPage implements OnInit {
  private gruposSub: Subscription;
  grupos: Grupo[] = [];
  horarios: Horario[] = [
    new Horario (
      'Lunes',
      [
        new Bloque (
          1,
          '7:00 a 8:30',
          '7:00',
          '8:30'
        ),
        new Bloque (
          2,
          '8:30 a 10:00',
          '8:30',
          '10:00'
        ),
        new Bloque (
          3,
          '10:00 a 11:30',
          '10:00',
          '11:30'
        ),
        new Bloque (
          4,
          '11:30 a 13:00',
          '11:30',
          '13:00'
        ),
        new Bloque (
          5,
          '13:00 a 14:30',
          '13:00',
          '14:30'
        ),
        new Bloque (
          6,
          '14:30 a 16:00',
          '14:30',
          '16:00'
        ),
        new Bloque (
          7,
          '16:00 a 17:30',
          '16:00',
          '17:30'
        ),
        new Bloque (
          8,
          '17:30 a 19:00',
          '17:30',
          '19:00'
        ),
        new Bloque (
          9,
          '19:00 a 20:30',
          '19:00',
          '20:30'
        ),
        new Bloque (
          10,
          '20:30 a 22:00',
          '20:30',
          '22:00'
        )
      ]
    ),
    new Horario (
      'Martes',
      [
        new Bloque (
          1,
          '7:00 a 8:30',
          '7:00',
          '8:30'
        ),
        new Bloque (
          2,
          '8:30 a 10:00',
          '8:30',
          '10:00'
        ),
        new Bloque (
          3,
          '10:00 a 11:30',
          '10:00',
          '11:30'
        ),
        new Bloque (
          4,
          '11:30 a 13:00',
          '11:30',
          '13:00'
        ),
        new Bloque (
          5,
          '13:00 a 14:30',
          '13:00',
          '14:30'
        ),
        new Bloque (
          6,
          '14:30 a 16:00',
          '14:30',
          '16:00'
        ),
        new Bloque (
          7,
          '16:00 a 17:30',
          '16:00',
          '17:30'
        ),
        new Bloque (
          8,
          '17:30 a 19:00',
          '17:30',
          '19:00'
        ),
        new Bloque (
          9,
          '19:00 a 20:30',
          '19:00',
          '20:30'
        ),
        new Bloque (
          10,
          '20:30 a 22:00',
          '20:30',
          '22:00'
        )
      ]
    ),
    new Horario (
      'Miercoles',
      [
        new Bloque (
          1,
          '7:00 a 8:30',
          '7:00',
          '8:30'
        ),
        new Bloque (
          2,
          '8:30 a 10:00',
          '8:30',
          '10:00'
        ),
        new Bloque (
          3,
          '10:00 a 11:30',
          '10:00',
          '11:30'
        ),
        new Bloque (
          4,
          '11:30 a 13:00',
          '11:30',
          '13:00'
        ),
        new Bloque (
          5,
          '13:00 a 14:30',
          '13:00',
          '14:30'
        ),
        new Bloque (
          6,
          '14:30 a 16:00',
          '14:30',
          '16:00'
        ),
        new Bloque (
          7,
          '16:00 a 17:30',
          '16:00',
          '17:30'
        ),
        new Bloque (
          8,
          '17:30 a 19:00',
          '17:30',
          '19:00'
        ),
        new Bloque (
          9,
          '19:00 a 20:30',
          '19:00',
          '20:30'
        ),
        new Bloque (
          10,
          '20:30 a 22:00',
          '20:30',
          '22:00'
        )
      ]
    ),
    new Horario (
      'Jueves',
      [
        new Bloque (
          1,
          '7:00 a 8:30',
          '7:00',
          '8:30'
        ),
        new Bloque (
          2,
          '8:30 a 10:00',
          '8:30',
          '10:00'
        ),
        new Bloque (
          3,
          '10:00 a 11:30',
          '10:00',
          '11:30'
        ),
        new Bloque (
          4,
          '11:30 a 13:00',
          '11:30',
          '13:00'
        ),
        new Bloque (
          5,
          '13:00 a 14:30',
          '13:00',
          '14:30'
        ),
        new Bloque (
          6,
          '14:30 a 16:00',
          '14:30',
          '16:00'
        ),
        new Bloque (
          7,
          '16:00 a 17:30',
          '16:00',
          '17:30'
        ),
        new Bloque (
          8,
          '17:30 a 19:00',
          '17:30',
          '19:00'
        ),
        new Bloque (
          9,
          '19:00 a 20:30',
          '19:00',
          '20:30'
        ),
        new Bloque (
          10,
          '20:30 a 22:00',
          '20:30',
          '22:00'
        )
      ]
    ),
    new Horario (
      'Viernes',
      [
        new Bloque (
          1,
          '7:00 a 8:30',
          '7:00',
          '8:30'
        ),
        new Bloque (
          2,
          '8:30 a 10:00',
          '8:30',
          '10:00'
        ),
        new Bloque (
          3,
          '10:00 a 11:30',
          '10:00',
          '11:30'
        ),
        new Bloque (
          4,
          '11:30 a 13:00',
          '11:30',
          '13:00'
        ),
        new Bloque (
          5,
          '13:00 a 14:30',
          '13:00',
          '14:30'
        ),
        new Bloque (
          6,
          '14:30 a 16:00',
          '14:30',
          '16:00'
        ),
        new Bloque (
          7,
          '16:00 a 17:30',
          '16:00',
          '17:30'
        ),
        new Bloque (
          8,
          '17:30 a 19:00',
          '17:30',
          '19:00'
        ),
        new Bloque (
          9,
          '19:00 a 20:30',
          '19:00',
          '20:30'
        ),
        new Bloque (
          10,
          '20:30 a 22:00',
          '20:30',
          '22:00'
        )
      ]
    ),
  ];

  constructor(private notifService: NotificacionesService, private storage: Storage) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // Recuperar grupos suscritos del usuario
    this.storage
      .get('gruposSuscritos')
      .then(gruposSuscritos => {
        if (gruposSuscritos !== null) {
          gruposSuscritos.forEach(grupo => {
            this.grupos.push(grupo);
          });
        }
      });
  }
}
