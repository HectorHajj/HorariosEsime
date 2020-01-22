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

  /*ionViewWillEnter() {
    this.grupos = [];
    document.querySelector('ion-searchbar').getInputElement().then((searchInput) => {
      searchInput.value = '';
   });
  }*/

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
          // Si ya había grupos suscritos, se añaden a array que se guardará
          gruposSuscritos.forEach(grupo => {
            gruposASuscribir.push(grupo);
          });

          // Verificar si tiene laboratorios
          const laboratorios = this.grupos.filter(labs => labs.clave === toggledGrupo.clave);

          // Si hay mas grupos con clave (tiene laboratorios)
          if (laboratorios.length > 1) {
            // Si no estan ya suscritos
            if (!gruposASuscribir.find(g => g.id === toggledGrupo.id)) {
              laboratorios.forEach(grupo => {
                grupo.checked = true;
                gruposASuscribir.push(grupo);
              });
            }

            // Guardar en memoria local los grupos suscritos
            this.storage.set('gruposSuscritos', gruposASuscribir);
          } else {
            // Si no esta ya suscrito
            if (!gruposASuscribir.find(g => g.id === toggledGrupo.id)) {
              gruposASuscribir.push(toggledGrupo);
            }

            // Guardar en memoria local los grupos suscritos
            this.storage.set('gruposSuscritos', gruposASuscribir);
          }
        } else {
          // Si no había grupos suscritos
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

            gruposASuscribir = [...gruposASuscribir.filter(g => g.clave !== toggledGrupo.clave)];

            // Si eran varios grupos, actualizar check
            const laboratorios = this.grupos.filter(labs => labs.clave === toggledGrupo.clave);

            if (laboratorios.length > 1) {
              laboratorios.forEach(grupo => {
                grupo.checked = false;
              });
            }

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
