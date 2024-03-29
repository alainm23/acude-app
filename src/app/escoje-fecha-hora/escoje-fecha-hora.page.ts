import { Component, OnInit } from "@angular/core";

// Services
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";
import { PagoService } from "../services/pago.service";
import { ApiService } from "../services/api.service";
import {
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";

@Component({
  selector: "app-escoje-fecha-hora",
  templateUrl: "./escoje-fecha-hora.page.html",
  styleUrls: ["./escoje-fecha-hora.page.scss"],
})
export class EscojeFechaHoraPage implements OnInit {
  date_now: any = moment();
  date_selected: moment.Moment = moment();
  min_date: any = moment().format();
  hora_selected: string = "";
  tipo_cita: boolean = false;

  editar: boolean = false;
  cita_id: string = "";
  modo_consulta: string = "";
  precio_consulta: number = 0;
  precio_consulta_telemedicina: number = 0;
  brinda_telemedicina: number = 0;

  doctor: any;
  horarios: any[] = [];
  citas: any[] = [];
  bloqueos: any[] = [];
  direccion: string;
  rango_tiempo: number = 1200;
  constructor(
    private route: ActivatedRoute,
    private pago: PagoService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private api: ApiService,
    private navController: NavController
  ) {}

  async ngOnInit() {
    this.doctor = JSON.parse(this.route.snapshot.paramMap.get("doctor"));
    console.log(this.doctor);

    this.direccion = JSON.parse(
      this.route.snapshot.paramMap.get("centro")
    ).direccion;
    this.editar = JSON.parse(this.route.snapshot.paramMap.get("centro")).editar;
    this.cita_id = JSON.parse(
      this.route.snapshot.paramMap.get("centro")
    ).cita_id;
    this.modo_consulta = JSON.parse(
      this.route.snapshot.paramMap.get("centro")
    ).modo_consulta;
    this.precio_consulta = JSON.parse(
      this.route.snapshot.paramMap.get("centro")
    ).precio_consulta;
    this.precio_consulta_telemedicina = JSON.parse(
      this.route.snapshot.paramMap.get("centro")
    ).precio_consulta_telemedicina;

    if (this.modo_consulta == "0") {
      this.tipo_cita = false;
    } else if (this.modo_consulta == "1") {
      this.tipo_cita = true;
    }

    const loading = await this.loadingController.create({
      message: "Procesando...",
    });

    await loading.present();

    this.api
      .validar_telemedicina(
        this.doctor.id,
        JSON.parse(this.route.snapshot.paramMap.get("centro")).centro_medico_id
      )
      .toPromise()
      .then((res: any) => {
        console.log(res);
        this.brinda_telemedicina = res.respuesta;
      });

    this.api
      .verificar_disponibilidad(
        JSON.parse(this.route.snapshot.paramMap.get("centro")).centro_medico_id
      )
      .subscribe(
        (res: any) => {
          console.log(res);
          this.rango_tiempo = res.tiempo_cita;
          if (res.tiempo_cita <= 0) {
            this.rango_tiempo = 3600;
          }

          this.api.obtener_informacion_completa(this.doctor.id).subscribe(
            (_res: any) => {
              console.log(_res);

              this.citas = res.disponibilidad.citas;
              res.disponibilidad.horarios.forEach((element: any) => {
                if (element.id_dia === 7) {
                  element.id_dia = 0;
                }

                this.horarios.push(element);
              });

              this.bloqueos = _res.data.profesional.bloqueos_hora;
              loading.dismiss();
            },
            (error) => {
              console.log(error);
            }
          );
        },
        (error) => {
          console.log(error);
          loading.dismiss();
        }
      );
  }

  get_disabled() {
    // 0 = Presencial
    // 1 = Telemedicina
    // 2 = Ambos
    let returned: boolean = false;

    if (this.brinda_telemedicina === 0) {
      returned = true;
    } else {
      returned = this.modo_consulta == "0";
    }

    return returned;
  }

  update_day(value: number) {
    this.hora_selected = "";
    this.date_selected.add(value, "days");
  }

  get_date() {
    let month: string = this.date_selected.format("MMM");
    return (
      this.date_selected.format("DD[ ]") +
      month.charAt(0).toUpperCase() +
      month.slice(1)
    );
  }

  get_relative_date() {
    if (this.date_selected.isSame(this.date_now, "day")) {
      return "Hoy";
    } else if (this.date_selected.isSame(moment().add(1, "days"), "day")) {
      return "Mañana";
    }

    let day: string = this.date_selected.format("dddd");
    return day.charAt(0).toUpperCase() + day.slice(1);
  }

  get_foto(data: any) {
    if (data.fotografia === null || data.fotografia === undefined) {
      return "data:image/png;base64,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";
    }

    return "https://www.acudeapp.com/storage/" + data.fotografia;
  }

  valid_day() {
    let returned: boolean = false;

    if (this.date_selected.isSame(this.date_now, "day")) {
      returned = true;
    }

    return returned;
  }

  date_picker_changed(value: any) {
    this.date_selected = moment(value);
  }

  date_esta_disponible() {
    let returned: boolean = false;

    this.horarios.forEach((horario: any) => {
      if (horario.id_dia === this.date_selected.day()) {
        returned = true;
      }
    });

    return returned;
  }

  get_horas(rango_inicio: number, rango_fin: number) {
    // get_horas
    // Entrada: 10:00 AM - 18:00 PM (string)
    // Respuesta: 10:00, 11:00, 12:00:, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00

    let list: any[] = [];
    let horario_atencion: string = ""; // la hora de atencion por ejemplo 10:00 AM - 18:00 PM
    this.horarios.forEach((horario: any) => {
      if (horario.id_dia === this.date_selected.day()) {
        // Capturamos la hora de atencion del dia seleccionado por ejemplo lunes
        horario_atencion = horario.horario_atencion;
      }
    });

    if (horario_atencion.split(" | ").length >= 2) {
      let array = horario_atencion.split(" | ");
      array.forEach((horario_atencion: string) => {
        // Campturamos la hora de inicio por ejemplo de 10:00 AM - 18:00 PM campturamos las 10:00 AM
        let inicio_tmp = moment(
          "1995-04-23 " + horario_atencion.split(" - ")[0]
        );
        let hora_inicio = inicio_tmp.format("H");
        let minuto_inicio = inicio_tmp.format("mm");

        // // Campturamos la hora de fin por ejemplo de 10:00 AM - 18:00 PM campturamos las 18:00 PM
        let fin_tmp = moment("1995-04-23 " + horario_atencion.split(" - ")[1]);
        let hora_fin = fin_tmp.format("H");
        let minuto_fin = fin_tmp.format("mm");

        if (parseInt(hora_fin) === 0) {
          hora_fin = "24";
        }

        // Creamos la hora de inicio y hora de fin con moment
        let date_inicio = moment(this.date_selected)
          .set("hour", parseInt(hora_inicio))
          .set("minute", parseInt(minuto_inicio));
        let date_fin = moment(this.date_selected)
          .set("hour", parseInt(hora_fin))
          .set("minute", parseInt(minuto_fin));

        // Capturamos la diferencia entre date_inicio y date_fin en horas
        // Por ejemplo si la diferencia entre 10:00 AM - 18:00 PM es 8 horas
        let diferencia = moment
          .duration(date_fin.diff(date_inicio))
          .asSeconds();
        let hora_creada = moment(this.date_selected)
          .set("hour", parseInt(hora_inicio))
          .set("minute", parseInt(minuto_inicio));

        while (diferencia > 0) {
          if (
            parseInt(hora_creada.format("H")) > rango_inicio &&
            parseInt(hora_creada.format("H")) <= rango_fin
          ) {
            let hour = hora_creada.format("H:mm");
            if (this.date_selected.isSame(this.date_now, "day")) {
              let fecha = this.date_selected.format("YYYY[-]MM[-]DD");
              if (
                moment()
                  .add(30, "minutes")
                  .diff(moment(fecha + " " + hour), "minutes") <= 0
              ) {
                list.push(hour);
              }
            } else {
              list.push(hour);
            }
          }

          hora_creada = hora_creada.add(this.rango_tiempo, "seconds");
          diferencia = moment.duration(date_fin.diff(hora_creada)).asSeconds();
        }
      });
    } else {
      // Campturamos la hora de inicio por ejemplo de 10:00 AM - 18:00 PM campturamos las 10:00 AM
      let inicio_tmp = moment("1995-04-23 " + horario_atencion.split(" - ")[0]);
      let hora_inicio = inicio_tmp.format("H");
      let minuto_inicio = inicio_tmp.format("mm");

      let fin_tmp = moment("1995-04-23 " + horario_atencion.split(" - ")[1]);
      let hora_fin = fin_tmp.format("H");
      let minuto_fin = fin_tmp.format("mm");

      if (parseInt(hora_fin) === 0) {
        hora_fin = "24";
      }

      // Creamos la hora de inicio y hora de fin con moment
      let date_inicio = moment(this.date_selected)
        .set("hour", parseInt(hora_inicio))
        .set("minute", parseInt(minuto_inicio));
      let date_fin = moment(this.date_selected)
        .set("hour", parseInt(hora_fin))
        .set("minute", parseInt(minuto_fin));

      // Capturamos la diferencia entre date_inicio y date_fin en horas
      // Por ejemplo si la diferencia entre 10:00 AM - 18:00 PM es 8 horas
      let diferencia = moment.duration(date_fin.diff(date_inicio)).asSeconds();
      let hora_creada = moment(this.date_selected)
        .set("hour", parseInt(hora_inicio))
        .set("minute", parseInt(minuto_inicio));

      while (diferencia > 0) {
        if (
          parseInt(hora_creada.format("H")) > rango_inicio &&
          parseInt(hora_creada.format("H")) <= rango_fin
        ) {
          let hour = hora_creada.format("H:mm");
          if (this.date_selected.isSame(this.date_now, "day")) {
            let fecha = this.date_selected.format("YYYY[-]MM[-]DD");
            if (
              moment()
                .add(30, "minutes")
                .diff(moment(fecha + " " + hour), "minutes") <= 0
            ) {
              list.push(hour);
            }
          } else {
            list.push(hour);
          }
        }

        hora_creada = hora_creada.add(this.rango_tiempo, "seconds");
        diferencia = moment.duration(date_fin.diff(hora_creada)).asSeconds();
      }
    }

    return list;
  }

  async reservar_cita() {
    if (this.editar) {
      const loading = await this.loadingController.create({
        message: "Procesando...",
      });

      await loading.present();

      let data: any = {
        id_cita: this.cita_id,
        hora: this.hora_selected + ":00",
        fecha: this.date_selected.format("YYYY[-]MM[-]DD"),
      };

      console.log(data);

      this.api.reprogramar_cita(data).subscribe(
        (res: any) => {
          console.log(res);
          loading.dismiss();
          this.navController.back();
        },
        (error) => {
          loading.dismiss();
          console.log(error);
        }
      );
    } else {
      let tipo_cita = 0;
      if (this.tipo_cita === true) {
        tipo_cita = 1;
      }

      let monto;
      if (this.tipo_cita === true) {
        monto = this.precio_consulta_telemedicina;
      } else {
        monto = this.precio_consulta;
      }

      let data: any = {
        monto: monto,
        id_centro_medico_profesional: JSON.parse(
          this.route.snapshot.paramMap.get("centro")
        ).centro_medico_id,
        direccion: JSON.parse(this.route.snapshot.paramMap.get("centro"))
          .direccion,
        tipo_cita: tipo_cita,
        hora: this.hora_selected + ":00",
        fecha: this.date_selected.format("YYYY[-]MM[-]DD"),
      };

      console.log(data);

      this.navController.navigateForward([
        "pago",
        JSON.stringify(this.doctor),
        JSON.stringify(data),
      ]);
    }
  }

  validar_disponibilidad(hora: string) {
    let invalido = false;
    let fecha = this.date_selected.format("YYYY[-]MM[-]DD");

    this.citas.forEach((cita: any) => {
      if (cita.fecha === fecha && cita.hora === hora + ":00") {
        invalido = true;
      }
    });

    this.bloqueos.forEach((bloqueo: any) => {
      if (bloqueo.fecha === fecha && bloqueo.hora === hora + ":00") {
        invalido = true;
      }
    });

    return invalido;
  }

  async seleccionar(hora: string) {
    if (this.validar_disponibilidad(hora) === false) {
      this.hora_selected = hora;
    } else {
      const toast = await this.toastController.create({
        message: "Horario no disponible",
        duration: 1500,
      });

      toast.present();
    }
  }

  back() {
    this.navController.back();
  }
}
