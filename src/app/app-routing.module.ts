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
    loadChildren: () => import('./actualizar-residencia/actualizar-residencia.module').then( m => m.ActualizarResidenciaPageModule)
  },
  {
    path: 'especialidad/:id/:nombre',
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
    path: 'encuentra-profesional-lista/:string_cm/:nombre/:id',
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
    path: 'perfil-clinica/:id/:id_sucursal',
    canActivate: [AuthGuard],
    loadChildren: () => import('./perfil-clinica/perfil-clinica.module').then( m => m.PerfilClinicaPageModule)
  },
  {
    path: 'establecimientos-salud-lista/:ids/:nombre',
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
  {
    path: 'ingreso',
    loadChildren: () => import('./ingreso/ingreso.module').then( m => m.IngresoPageModule)
  },
  {
    path: 'editar-perfil',
    canActivate: [AuthGuard],
    loadChildren: () => import('./editar-perfil/editar-perfil.module').then( m => m.EditarPerfilPageModule)
  },
  {
    path: 'escoje-fecha-hora/:doctor/:centro',
    canActivate: [AuthGuard],
    loadChildren: () => import('./escoje-fecha-hora/escoje-fecha-hora.module').then( m => m.EscojeFechaHoraPageModule)
  },
  {
    path: 'pago/:doctor/:data',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pago/pago.module').then( m => m.PagoPageModule)
  },
  {
    path: 'reserva-exitosa/:data',
    canActivate: [AuthGuard],
    loadChildren: () => import('./reserva-exitosa/reserva-exitosa.module').then( m => m.ReservaExitosaPageModule)
  },
  {
    path: 'reserva-fallada',
    loadChildren: () => import('./reserva-fallada/reserva-fallada.module').then( m => m.ReservaFalladaPageModule)
  },
  {
    path: 'datos-peruano-extrajero/:data',
    canActivate: [AuthGuard],
    loadChildren: () => import('./datos-peruano-extrajero/datos-peruano-extrajero.module').then( m => m.DatosPeruanoExtrajeroPageModule)
  },
  {
    path: 'antecedentes/:data',
    canActivate: [AuthGuard],
    loadChildren: () => import('./antecedentes/antecedentes.module').then( m => m.AntecedentesPageModule)
  },
  {
    path: 'confirmacion/:data',
    canActivate: [AuthGuard],
    loadChildren: () => import('./confirmacion/confirmacion.module').then( m => m.ConfirmacionPageModule)
  },
  {
    path: 'resgistrar-doctor-datos-personales',
    loadChildren: () => import('./resgistrar-doctor-datos-personales/resgistrar-doctor-datos-personales.module').then( m => m.ResgistrarDoctorDatosPersonalesPageModule)
  },
  {
    path: 'resgistrar-doctor-datos-personales-dos',
    loadChildren: () => import('./resgistrar-doctor-datos-personales-dos/resgistrar-doctor-datos-personales-dos.module').then( m => m.ResgistrarDoctorDatosPersonalesDosPageModule)
  },
  {
    path: 'resgistrar-doctor-datos-personales-tres',
    loadChildren: () => import('./resgistrar-doctor-datos-personales-tres/resgistrar-doctor-datos-personales-tres.module').then( m => m.ResgistrarDoctorDatosPersonalesTresPageModule)
  },
  {
    path: 'registrar-doctor-personal-complementaria',
    loadChildren: () => import('./registrar-doctor-personal-complementaria/registrar-doctor-personal-complementaria.module').then( m => m.RegistrarDoctorPersonalComplementariaPageModule)
  },
  {
    path: 'modal-fijar-horarios',
    loadChildren: () => import('./modal-fijar-horarios/modal-fijar-horarios.module').then( m => m.ModalFijarHorariosPageModule)
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () => import('./recuperar-contrasena/recuperar-contrasena.module').then( m => m.RecuperarContrasenaPageModule)
  },
  {
    path: 'historial-citas/:mostrar_alerta',
    canActivate: [AuthGuard],
    loadChildren: () => import('./historial-citas/historial-citas.module').then( m => m.HistorialCitasPageModule)
  },
  {
    path: 'cita-detalle/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./cita-detalle/cita-detalle.module').then( m => m.CitaDetallePageModule)
  },
  {
    path: 'cita-resultados/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./cita-resultados/cita-resultados.module').then( m => m.CitaResultadosPageModule)
  },
  {
    path: 'pais-no-soportado/:pais',
    loadChildren: () => import('./pais-no-soportado/pais-no-soportado.module').then( m => m.PaisNoSoportadoPageModule)
  },
  {
    path: 'comentarios-lista/:items',
    canActivate: [AuthGuard],
    loadChildren: () => import('./comentarios-lista/comentarios-lista.module').then( m => m.ComentariosListaPageModule)
  },
  {
    path: 'comentario/:item/:size',
    canActivate: [AuthGuard],
    loadChildren: () => import('./comentario/comentario.module').then( m => m.ComentarioPageModule)
  },
  {
    path: 'califica-atencion/:item/:size',
    canActivate: [AuthGuard],
    loadChildren: () => import('./califica-atencion/califica-atencion.module').then( m => m.CalificaAtencionPageModule)
  },
  {
    path: 'estamos-trabajando',
    loadChildren: () => import('./estamos-trabajando/estamos-trabajando.module').then( m => m.EstamosTrabajandoPageModule)
  },
  {
    path: 'payment',
    canActivate: [AuthGuard],
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
