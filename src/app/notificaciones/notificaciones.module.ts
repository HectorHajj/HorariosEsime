import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificacionesPage } from './notificaciones.page';
import { NotificacionesRoutingModule } from './notificaciones-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificacionesRoutingModule
  ],
  declarations: [NotificacionesPage]
})
export class NotificacionesPageModule {}
