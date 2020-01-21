import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificacionesService } from '../notificaciones.service';
import { Grupo } from '../grupo.model';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-suscribir',
  templateUrl: './suscribir.page.html',
  styleUrls: ['./suscribir.page.scss'],
})

export class SuscribirPage implements OnInit, OnDestroy {
  private gruposSub: Subscription;
  grupos: Grupo[];
  cargando = false;

  constructor(
    private notifService: NotificacionesService,
    private storage: Storage
    ) { }

  ngOnInit() {
    this.gruposSub = this.notifService.grupos.subscribe(grupos => {
      this.grupos = grupos;
    });
  }

  busqueda(event: any) {
    this.grupos = [];
    this.cargando = true;
    if (event.detail.value.length > 1) {
      this.notifService.getGrupos(event.detail.value).subscribe(() => {
        this.cargando = false;
      });
    } else {
      this.cargando = false;
    }
  }

  onToggle(event: any) {
    const toggledGrupo = this.grupos.find(g => g.id === event.target.value);
    let gruposASuscribir: Grupo[] = [];

    // Si el toggle estaba apagado
    if (event.target.checked === false) {
      // Guardar este grupo completo en memoria local
      // Armar array de grupos existentes y agregarles este ultimo
      this.storage
      .get('gruposSuscritos')
      .then(gruposSuscritos => {
        if (gruposSuscritos !== null) {

          gruposSuscritos.forEach(grupo => {
            gruposASuscribir.push(grupo);
          });

          if (!gruposASuscribir.find(g => g.id === toggledGrupo.id)) {
            gruposASuscribir.push(toggledGrupo);
          }

          this.storage.set('gruposSuscritos', gruposASuscribir);
        } else {
          gruposASuscribir.push(toggledGrupo);

          this.storage.set('gruposSuscritos', gruposASuscribir);
        }
      });
    } else if (event.target.checked === true) {
      // Borrar este grupo completo de memoria local
      // Armar array de grupos existentes y borrarle este ultimo
      this.storage
      .get('gruposSuscritos')
      .then((gruposSuscritos) => {
        if (gruposSuscritos !== null) {

          gruposSuscritos.forEach(grupo => {
            gruposASuscribir.push(grupo);
          });

          if (gruposASuscribir.find(g => g.id === toggledGrupo.id)) {

            gruposASuscribir = [...gruposASuscribir.filter(g => g.id !== toggledGrupo.id)];

            this.storage.set('gruposSuscritos', gruposASuscribir);
          }
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.gruposSub) {
      this.gruposSub.unsubscribe();
    }
  }
}
