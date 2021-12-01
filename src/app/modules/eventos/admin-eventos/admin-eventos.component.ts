import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, OnChanges, AfterViewChecked, DoCheck} from '@angular/core';								  
import { CalendarModule } from 'angular-calendar';
import {startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';		 		  
import { Subject } from 'rxjs';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';				  
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoService } from 'src/app/services/evento.service';
import { EventoModel } from 'src/app/models/evento-model';
import { EventoMesesModel } from 'src/app/models/evento-meses-model';
import { EventoYearModel } from 'src/app/models/evento-year-model';

import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoEventoModel } from 'src/app/models/tipo-evento-model';
import { DatePipe } from '@angular/common';
import { EventoDiaModel } from 'src/app/models/evento-dia-model';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-admin-eventos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-eventos.component.html',
  styleUrls: ['./admin-eventos.component.css']
})
export class AdminEventosComponent implements OnInit {

   @ViewChild('modalContent', { static: true })
   modalContent!: TemplateRef<any>;
                        
   view: CalendarView = CalendarView.Month;
   CalendarView = CalendarView;
   viewDate: Date = new Date();
   tiposEventos: TipoEventoModel[] = [];
   eventos : EventoModel[] = [];
   events: CalendarEvent[] = []; 
   eventsFilter: CalendarEvent[] = []; 
   lista: EventoMesesModel[] = [];
   listaMesesYear: EventoYearModel[] = [];
   arraySemana: EventoDiaModel[] = [];
   mensaje : string = "";
   fecha : Date = new Date();
   closeModal: string = "" ;
   //Activa el panel 
   activeDayIsOpen: boolean = false;
   //eventosForm: FormGroup;
   dataSource : EventoModel [] = [];
   //Columnas
   displayedColumns: string[] = ['descripcion', 'fecha_inicio', 'fecha_fin'];
   days: string[] = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
   year : number = 0;
   dia : string = "";
   activeYear: boolean = false ; // hidden by default
   activeMes: boolean = true ; // hidden by default
   isShown: boolean = false ; // hidden by default
   isShownErr: boolean = false ; // hidden by default
   selecTipoEvento : any;
   
  ngOnInit(){

   this.consultarEventos();
   this.listarTiposEventos();
   this.lista = this.listaMeses;
   
  }
 
  /*Definicion del modal */
  modalData!: {
    action: string;
    event: CalendarEvent;
  };

 /* Acciones para los eventos */
  actions: CalendarEventAction[] = [
    {
      label: '<i class="bi bi-pencil"></i>',
      a11yLabel: 'Editar',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="bi bi-trash"></i>',
      a11yLabel: 'Eliminar',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  /**Accion de refresco para el calendario*/
  refresh: Subject<any> = new Subject();

  /*Inicializa Lista de Meses*/
  listaMeses: EventoMesesModel[] = [
    {
      "name": "Enero",
      "short": "Jan",
      "number": 1,
      "days": 31
    },
   {
      "name": "Febrero",
      "short": "Feb",
      "number": 2,
      "days": 28
    },
     {
      "name": "Marzo",
      "short": "Mar",
      "number": 3,
      "days": 31
    },
   {
      "name": "Abril",
      "short": "Apr",
      "number": 4,
      "days": 30
    },
   {
      "name": "Mayo",
      "short": "May",
      "number": 5,
      "days": 31
    },
     {
      "name": "Junio",
      "short": "Jun",
      "number": 6,
      "days": 30
    },
    {
      "name": "Julio",
      "short": "Jul",
      "number": 7,
      "days": 31
    },
    {
      "name": "Agosto",
      "short": "Aug",
      "number": 8,
      "days": 31
    },
    {
      "name": "Septiembre",
      "short": "Sep",
      "number": 9,
      "days": 30
    },
    {
      "name": "Octubre",
      "short": "Oct",
      "number": 10,
      "days": 31
    },
     {
      "name": "Noviembre",
      "short": "Nov",
      "number": 11,
      "days": 30
    },
     {
      "name": "Diciembre",
      "short": "Dec",
      "number": 12,
      "days": 31
    }
    ];

   //constructor
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private eventoService: EventoService, private datePipe: DatePipe) {
     // this.eventosForm= this.createFormGroup(formBuilder)
    }
    
    /******************************************
     * Abre el modal para listar eventos 
     ******************************************/
    triggerModal(content: any) {
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
        this.closeModal = `Closed with: ${res}`;
      }, (res) => {
        this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
      });
    }
    
    /*****************************************************
     * Metodo para cerrar el popup de acuerdo a un evento 
     *******************************************************/
    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return  `with: ${reason}`;
      }
    }
 
  /************************************************
   * Filtra los eventos segun el día seleccionado
   * ***********************************************/
   dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
      this.ocultarMensaje();
      this.fecha = date;
      if (isSameMonth(date, this.viewDate)) {
        this.eventsFilter = this.events.filter((event) => ((date.getFullYear() === event.start.getFullYear()) && (date.getMonth() === event.start.getMonth()) && (date.getDate() >= event.start.getDate() &&   date.getDate() <= ((event.end?.getDate() !== undefined)? event.end?.getDate():date.getDate()))));
        this.triggerModal(this.modalContent);
      }
    }
   
   /*******************************************************
   * actualiza la lista de eventos luego de una eliminación
   * ******************************************************/
    actualizarListaEventosDia({ date, events }: { date: Date; events: CalendarEvent[] }): void {
      this.fecha = date;
      if (isSameMonth(date, this.viewDate)) {
         this.eventsFilter = this.events.filter((event) => ((date.getFullYear() === event.start.getFullYear()) && (date.getMonth() === event.start.getMonth()) && (date.getDate() >= event.start.getDate() &&   date.getDate() <= ((event.end?.getDate() !== undefined)? event.end?.getDate():date.getDate()))));
         this.mensaje= "Evento eliminado exitosamente!";
         this.mostrarMensaje();

      }
    }

   /*******************************************************
   * eventTimesChanged usado en el componente calendar
   ********************************************************/
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

   /*******************************************************
   * handleEvent :: abre el modal con el evento y la accion
   ********************************************************/
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modalService.open(this.modalContent, { size: 'lg' });
  }

  /*******************************************************
   * addEvent :: adiciona nuevo evento a la lista
   ********************************************************/
  addEvent(): void {

    this.eventsFilter = [
      ...this.eventsFilter,
      {
        id:'',
        title: '',
        start: startOfDay(this.fecha),
        end: endOfDay(this.fecha),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
    this.ocultarMensaje();
  }

  /*************************************************************
   * createUpdateEvent :: valida si es actualizar o crear evento
   *************************************************************/
  createUpdateEvent(eventToCreate: CalendarEvent): void {

    this.ocultarMensaje();
    var tipoEventoId =  (document.getElementById("tipoEvento_"+eventToCreate.id) as HTMLSelectElement).selectedIndex;
    var pos = tipoEventoId - 1;
    if(pos < 0){
      // no se ha seleccionado tipo evento
      this.selecTipoEvento = "";
    }else{
      this.selecTipoEvento = this.tiposEventos[pos].tipo_evento_id 
    }
                 
    if(!this.validarCampos(eventToCreate)){
      this.mostrarMensajeError();
      return;
    }

    if(eventToCreate.id === ""){

      this.guardaNuevoEvento(eventToCreate);
    }else{

      this.actualizarEvento(eventToCreate);
    }
    
  }

  /*******************************************************************
   * guardaNuevoEvento :: Se realiza el llamado para almacenar evento
   *******************************************************************/
  private guardaNuevoEvento(eventToCreate: CalendarEvent){
    
   let evento = new EventoModel;
   evento.descripcion = eventToCreate.title;
   evento.fecha_inicio = this.formatearFecha(eventToCreate.start);
   evento.fecha_fin = this.formatearFecha(eventToCreate.end!);
   evento.color = eventToCreate.color!.primary;
   evento.tipo_evento_id = this.selecTipoEvento;
   this.eventoService.guardarProgramacionEvento(evento).subscribe((datos) =>{
     let evento : CalendarEvent = {
       id: datos.evento_id,
       start: new Date(datos.fecha_inicio),
       end: new Date(datos.fecha_fin),
       title: datos.descripcion,
       color: colors.red,
       allDay: true,
       resizable:  {
         beforeStart: true,
         afterEnd: true,
       },
       draggable: true
     }
     evento.actions = this.actions;
     this.events.unshift(evento);
     this.mensaje = "Evento creado exitosamente!";
     this.mostrarMensaje();
   });
  }

  /*******************************************************************
   * actualizarEvento :: Se realiza el llamado para actualizar evento
   *******************************************************************/
   private actualizarEvento(eventToCreate: CalendarEvent){

      let evento = new EventoModel;
      evento.evento_id   = eventToCreate.id;
      evento.descripcion = eventToCreate.title; 
      evento.fecha_inicio = this.formatearFecha(eventToCreate.start);
      evento.fecha_fin = this.formatearFecha(eventToCreate.end!);     
      evento.color = eventToCreate.color!.primary;
      evento.tipo_evento_id = this.selecTipoEvento;   
      this.eventoService.actualizarProgramacionEvento(evento).subscribe((datos) =>{
        this.mensaje = "Evento actualizado exitosamente!";
        this.mostrarMensaje();
      });
     }

   /*************************************************************
   * deleteEvent :: Se realiza el llamado para eliminar evento
   *************************************************************/
  deleteEvent(eventToDelete: CalendarEvent) {
   
    this.ocultarMensaje()
    let idEvento: number = eventToDelete.id as number;
    this.events = this.events.filter((event) => event !== eventToDelete);
    this.eventoService.eliminarProgramacionEvento(idEvento).subscribe((datos) =>{
      this.mensaje = "Evento eliminado exitosamente!";
      this.mostrarMensaje();
      this.consultarEventosEliminar();

    });
  }
  
  /********************************************
   * setView :: usado en el componente calendar
   ********************************************/
  setView(view: CalendarView) {
    this.view = view; 
  }

  /***********************************************************
   * closeOpenMonthViewDay :: usado en el componente calendar
   ***********************************************************/
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  
  /*******************************************************************
   * listarTiposEventos :: Se realiza el llamado para eliminar evento
   *******************************************************************/
  listarTiposEventos(){
    this.eventoService.consultarTiposEvento().subscribe((datos) =>{
      this.tiposEventos = datos;
    });
  }

  /*******************************************************************************
   * consultarEventos :: Se realiza el llamado para consultar todos los eventos
   *******************************************************************************/
  consultarEventos(): void{
   this.eventoService.consultarEventos().subscribe((datos) => {
      this.events = [];
      for(let i = 0; i<  datos.length; i++){
         
            let evento : CalendarEvent = {
              id: datos[i].evento_id,
              start:new Date(datos[i].fecha_inicio), //subDays(startOfDay(new Date(datos[i].fecha_inicio)), 1),
              end: new Date(datos[i].fecha_fin),//addDays(new Date(datos[i].fecha_fin), 1),
              title: datos[i].descripcion,
              color: {
               primary: datos[i].color,
               secondary: '#FDF1BA',
               },//colors.red,
              actions: this.actions,
              allDay: true,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              draggable: true,
              tipoEvento: datos[i].tipo_evento_id
            }
            this.events.push(evento);
      }
      
      this.eventsFilter = this.events;
      if(this.activeYear == true){
        this.listarEventosAnuales(this.year);
      }
      this.triggerModal(this.modalContent);
      this.modalService.dismissAll({'dismissed': true});
         
    });
  }

  /***********************************************************************************************
   * consultarEventos :: Se realiza el llamado para consultar los eventos luego de una eliminacion
   ***********************************************************************************************/
  consultarEventosEliminar(): void{

   this.eventoService.consultarEventos().subscribe((datos) => {
     
      this.events = [];
      this.eventsFilter = [];
      for(let i = 0; i<  datos.length; i++){
         
            let evento : CalendarEvent = {
              id: datos[i].evento_id,
              start: subDays(startOfDay(new Date(datos[i].fecha_inicio)), 1),
              end: addDays(new Date(datos[i].fecha_fin), 1),
              title: datos[i].descripcion,
              color: colors.red,
              actions: this.actions,
              allDay: true,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              draggable: true,
              tipoEvento: datos[i].tipo_evento_id
            }
            this.events.push(evento);
         
      }
      
      this.actualizarListaEventosDia( { date: this.fecha, events: this.events } );
        
     });
    
  }

  /************************************************
   * activeViewYear :: activa la vista del ago
   ************************************************/
  activeViewYear() {
    /*Fecha incial*/
    var dt = new Date();
    this.year = dt.getFullYear();
    this.dia = this.days[dt.getDay()];
    this.listarEventosAnuales( dt.getFullYear());    
  }

  /************************************************
   * beforeYear :: consulta el anterior
   ************************************************/
   beforeYear() {
      /*Fecha incial*/
      var calculaYear = this.year - 1;
      this.listarEventosAnuales( calculaYear);
      this.year = calculaYear;    
    }

   /************************************************
   * nextYear :: consulta el siguiente
   ************************************************/
   nextYear() {
      /*Fecha incial*/
      var calculaYear = this.year + 1;
      this.listarEventosAnuales( calculaYear);
      this.year = calculaYear;      
    }
   /************************************************
   * activeViewMes :: activa la vista del mes
   ************************************************/
  activeViewMes() {
    //Ocultar ago mostrar mes 
    this.activeYear = false;
    this.activeMes = true;
  }

   /************************************************************
   * mostrarMensaje :: Muestra mensaje de exito de operación
   *************************************************************/
   mostrarMensaje() {
    this.isShown = true;
   }

   /************************************************************
   * mostrarMensajeError :: Muestra mensaje de exito de operación
   *************************************************************/
   mostrarMensajeError() {
         this.isShownErr = true;
   }
   
  /************************************************************
   * ocultarMensaje :: Muestra mensaje de exito de operación
   *************************************************************/
   ocultarMensaje() {
      this.isShown = false;
      this.isShownErr  = false;
   }

   /********************************************************************
    * validarCampos :: valida el nombre y el tipo evento y las fechas
    *********************************************************************/
   private validarCampos(eventToCreate : CalendarEvent){

    this.mensaje = "";
    var date = new Date(eventToCreate.start);
    var fechaI = date.getFullYear()+""+date.getMonth()+""+date.getDate();
    date = new Date(eventToCreate.end!);
    var fechaF = date.getFullYear()+""+date.getMonth()+""+date.getDate();

    if(parseInt(fechaI) > parseInt(fechaF) ){
      this.mensaje = "La fecha de inicio no puede ser mayor a la fecha fin." 
      return false;
    }
    if(this.selecTipoEvento === undefined || this.selecTipoEvento === "" ){
      this.mensaje = "Debe seleccionar un tipo de evento para guardar." 
      return false;
    }
    if(eventToCreate.title === ""){
      this.mensaje = "Debe ingresar el evento para guardar."
      return false;
    }
  

    return true;
   }

   /**********************************************************************
    * ListarEventosAnuales :: construye el objeto para el calendario anual
    **********************************************************************/
    eventosPorDia(datosDia: EventoDiaModel ){
      
      if (datosDia.fecha !== " "){
         var date = new Date(datosDia.fecha);
         this.ocultarMensaje();
         this.fecha = date;
         this.eventsFilter = this.events.filter((event) => (date.getFullYear() === event.start.getFullYear() && date.getMonth() === event.start.getMonth() && (date.getDate() >= event.start.getDate() &&   date.getDate() <= ((event.end?.getDate() !== undefined)? event.end?.getDate():date.getDate()))));
         this.triggerModal(this.modalContent); 
     }
   
   }

   /**********************************************************************
    * ListarEventosAnuales :: construye el objeto para el calendario anual
    **********************************************************************/
   private listarEventosAnuales(year : number){

      var datosCompletos = '[';
      for(var datosMes = 0; datosMes < this.listaMeses.length; datosMes++){

         var mesActual = new Date().getMonth()+1;
         var mes  = this.listaMeses[datosMes].number;
         var colorMes = (mesActual== mes)?"rgb(203 231 231)":"rgb(232, 252, 252)";

         var calentarYearJson = `{"mes":"${this.listaMeses[datosMes].name}","color":"${colorMes}","titulosDias":["Dom","Lun","Mar","Mie","Jue","Vie","Sab"], "semanas":[`;
         var cantidadDiasMes = this.listaMeses[datosMes].days;
         var cantidadSemanas = cantidadDiasMes/7;
         var cantidadSemanas =  Math.round(cantidadSemanas);

         cantidadSemanas =(mes == 2)?cantidadSemanas: cantidadSemanas+1;

         var fechaPrimerDiaMes = year+"/"+((mes<10)?"0"+mes:mes)+"/"+"01";
         var fecha =  new Date(fechaPrimerDiaMes);
         var dia  = fecha.getDay();

         if((dia >= 5 && mes !== 2) || (dia > 0 && mes === 2)  ){
            cantidadSemanas += 1;
         }

        var esBisiesto = (year % 400 === 0) ? true :  (year % 100 === 0) ? false : year % 4 === 0;
      
         if(mes === 2 && esBisiesto === true){
            cantidadDiasMes += 1; 
         }

         var semanas = "";
         var contDia = 1;
         var inicioDia = dia;
         for (var i=0;i<cantidadSemanas;i++){
            //Se inicializa el array de semana con los dias por defecto
             this.arraySemana = [
                                 {"dia":"","color":colorMes,"fecha":" ", "eventos":""},
                                 {"dia":"","color":colorMes,"fecha":" ", "eventos":""},
                                 {"dia":"","color":colorMes,"fecha":" ", "eventos":""},
                                 {"dia":"","color":colorMes,"fecha":" ", "eventos":""},
                                 {"dia":"","color":colorMes,"fecha":" ", "eventos":""},
                                 {"dia":"","color":colorMes,"fecha":" ", "eventos":""},
                                 {"dia":"","color":colorMes,"fecha":" ", "eventos":""}
                              ];
            var objectoDia = new EventoDiaModel();
            for(var j=inicioDia; j < 7; j++){
               if(contDia <= cantidadDiasMes){
                    var fechaDia =  year+"/"+((mes<10)?"0"+mes:mes)+"/"+((contDia < 10 )?"0"+contDia:contDia);
                    var cantidadEventos = this.cantidadDeEventos(fechaDia);
                    objectoDia =  {
                     "dia":contDia, 
                     "color":(cantidadEventos == 0)?colorMes:"#8792e1", 
                     "fecha":fechaDia, 
                     "eventos":(cantidadEventos == 0)?"":cantidadEventos, 
                  }
                  this.arraySemana[j] = objectoDia;
                  contDia = contDia + 1;
               }   
            }
            inicioDia = 0;
            
            var jsonArray = JSON.stringify(this.arraySemana);
            semanas +=  jsonArray+",";

         }
         semanas = semanas.substring(0,semanas.length-1);

         calentarYearJson = calentarYearJson +semanas+"]}";
         
         datosCompletos = datosCompletos+calentarYearJson+","

      }

      datosCompletos = datosCompletos.substring(0,datosCompletos.length-1);
      datosCompletos =   datosCompletos + "]";
      this.listaMesesYear = JSON.parse(datosCompletos);
      //Ocultar mes mostrar agno
      this.activeYear = true;
      this.activeMes = false;

   }

   /**********************************************************************
    * ListarEventosAnuales :: construye el objeto para el calendario anual
    **********************************************************************/
   private cantidadDeEventos(fecha: string ) : number{
   
      var date = new Date(fecha);
      var listaEventos = this.events.filter((event) => (date.getFullYear() === event.start.getFullYear() && date.getMonth() === event.start.getMonth() && (date.getDate() >= event.start.getDate() &&   date.getDate() <= ((event.end?.getDate() !== undefined)? event.end?.getDate():date.getDate()))));
      return listaEventos.length;
   }

   /********************************************************************************
    * formatearFecha :: organiza las fechas en el formato correcto para el evento
    ********************************************************************************/
   private formatearFecha(fecha : Date): string {
    var date = new Date(fecha);
    var mes = date.getMonth() + 1;
    var mesString = (mes < 10) ? "0"+mes:mes+"";
    var dia = (date.getDate() < 10)? "0"+date.getDate():date.getDate()+"";
    var segundos = (date.getSeconds() < 10)? "0"+date.getSeconds():date.getSeconds()+"";
    var horas = (date.getHours() < 10)?"0"+date.getHours():date.getHours()+"";
    var minutos = (date.getMinutes() < 10)?"0"+date.getMinutes():date.getMinutes()+"";
    var milisegundos = (date.getMilliseconds() < 10)? "0"+date.getMilliseconds():date.getMilliseconds()+"";
    var fechaFormateada = date.getFullYear()+"-"+mesString+"-"+dia;
    return fechaFormateada = fechaFormateada+"T"+horas+":"+minutos+":"+segundos+"."+milisegundos+"-05:00";
   }
}