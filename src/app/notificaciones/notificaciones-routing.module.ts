import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificacionesPage } from './notificaciones.page';

const routes: Routes = [
  {
    path: '',
    component: NotificacionesPage,
    children: [
      {
        path: 'horario',
        children: [
          {
            path: '',
            loadChildren: './horario/horario.module#HorarioPageModule'
          },
        ]
      },
      {
        path: 'suscribir',
        children: [
          {
            path: '',
            loadChildren: './suscribir/suscribir.module#SuscribirPageModule'
          },
        ]
      },
      {
        path: '',
        redirectTo: '/notificaciones/horario',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class NotificacionesRoutingModule {}
