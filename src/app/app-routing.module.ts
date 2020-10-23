import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then( m => m.OnboardingPageModule)
  },
  {
    path: 'inicio-seleccionar',
    loadChildren: () => import('./inicio-seleccionar/inicio-seleccionar.module').then( m => m.InicioSeleccionarPageModule)
  },
  {
    path: 'registro-paciente',
    loadChildren: () => import('./registro-paciente/registro-paciente.module').then( m => m.RegistroPacientePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'actualizar-residencia',
    canActivate: [AuthGuard],
    loadChildren: () => import('./actualizar-residencia/actualizar-residencia.module').then( m => m.ActualizarResidenciaPageModule)
  },
  {
    path: 'especialidad/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./especialidad/especialidad.module').then( m => m.EspecialidadPageModule)
  },
  {
    path: 'menu',
    canActivate: [AuthGuard],
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'encuentra-profesional/:id/:nombre',
    canActivate: [AuthGuard],
    loadChildren: () => import('./encuentra-profesional/encuentra-profesional.module').then( m => m.EncuentraProfesionalPageModule)
  },
  {
    path: 'perfil-doctor/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./perfil-doctor/perfil-doctor.module').then( m => m.PerfilDoctorPageModule)
  },

  {
    path: 'encuentra-profesional-lista/:string_cm/:nombre',
    canActivate: [AuthGuard],
    loadChildren: () => import('./encuentra-profesional-lista/encuentra-profesional-lista.module').then( m => m.EncuentraProfesionalListaPageModule)
  },
  {
    path: 'publicidad-detalle/:id/:categoria_id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./publicidad-detalle/publicidad-detalle.module').then( m => m.PublicidadDetallePageModule)
  },
  {
    path: 'mapa-establecimientos/:id/:nombre',
    canActivate: [AuthGuard],
    loadChildren: () => import('./mapa-establecimientos/mapa-establecimientos.module').then( m => m.MapaEstablecimientosPageModule)
  },
  {
    path: 'perfil-clinica/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./perfil-clinica/perfil-clinica.module').then( m => m.PerfilClinicaPageModule)
  },
  {
    path: 'establecimientos-salud-lista/:ids',
    canActivate: [AuthGuard],
    loadChildren: () => import('./establecimientos-salud-lista/establecimientos-salud-lista.module').then( m => m.EstablecimientosSaludListaPageModule)
  },
  {
    path: 'publicidad-lista',
    canActivate: [AuthGuard],
    loadChildren: () => import('./publicidad-lista/publicidad-lista.module').then( m => m.PublicidadListaPageModule)
  },
  {
    path: 'doctor-tuto',
    loadChildren: () => import('./doctor-tuto/doctor-tuto.module').then( m => m.DoctorTutoPageModule)
  },
  {
    path: 'select-idioma',
    loadChildren: () => import('./popovers/select-idioma/select-idioma.module').then( m => m.SelectIdiomaPageModule)
  },
  {
    path: 'select-honorario',
    loadChildren: () => import('./popovers/select-honorario/select-honorario.module').then( m => m.SelectHonorarioPageModule)
  },
  {
    path: 'select-horario',
    loadChildren: () => import('./popovers/select-horario/select-horario.module').then( m => m.SelectHorarioPageModule)
  },
  {
    path: 'select-sucursal',
    loadChildren: () => import('./popovers/select-sucursal/select-sucursal.module').then( m => m.SelectSucursalPageModule)
  },
  {
    path: 'favoritos',
    canActivate: [AuthGuard],
    loadChildren: () => import('./favoritos/favoritos.module').then( m => m.FavoritosPageModule)
  },
  {
    path: 'emergencia',
    canActivate: [AuthGuard],
    loadChildren: () => import('./emergencia/emergencia.module').then( m => m.EmergenciaPageModule)
  },
  {
    path: 'centros-medicos-lista',
    canActivate: [AuthGuard],
    loadChildren: () => import('./centros-medicos-lista/centros-medicos-lista.module').then( m => m.CentrosMedicosListaPageModule)
  },
  {
    path: 'busqueda-avanzada',
    canActivate: [AuthGuard],
    loadChildren: () => import('./busqueda-avanzada/busqueda-avanzada.module').then( m => m.BusquedaAvanzadaPageModule)
  },
  {
    path: 'select-especialidad',
    loadChildren: () => import('./popovers/select-especialidad/select-especialidad.module').then( m => m.SelectEspecialidadPageModule)
  },
  {
    path: 'busqueda-avanzada-respuesta/:respuesta',
    loadChildren: () => import('./busqueda-avanzada-respuesta/busqueda-avanzada-respuesta.module').then( m => m.BusquedaAvanzadaRespuestaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
