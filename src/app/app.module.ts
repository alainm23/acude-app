import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Rest
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

// Geo
import { Geolocation } from '@ionic-native/geolocation/ngx';

// Social Share
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';

// Camera
import { Camera } from '@ionic-native/camera/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';

// Facebook
import { Facebook } from '@ionic-native/facebook/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';

// Popovers
import { SelectIdiomaPageModule } from './popovers/select-idioma/select-idioma.module';
import { SelectHonorarioPageModule } from './popovers/select-honorario/select-honorario.module';
import { SelectHorarioPageModule } from './popovers/select-horario/select-horario.module';
import { SelectSucursalPageModule } from './popovers/select-sucursal/select-sucursal.module';
import { SelectEspecialidadPageModule } from './popovers/select-especialidad/select-especialidad.module';
import { PaymentPageModule } from './payment/payment.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicStorageModule.forRoot (),
    SelectIdiomaPageModule,
    SelectHonorarioPageModule,
    SelectHorarioPageModule,
    SelectSucursalPageModule,
    SelectEspecialidadPageModule,
    PaymentPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    SocialSharing,
    Deeplinks,
    Camera,
    Facebook,
    GooglePlus,
    CallNumber,
    Clipboard,
    AndroidPermissions,
    LocationAccuracy,
    Keyboard,
    OneSignal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
