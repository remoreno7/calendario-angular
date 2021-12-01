import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoEventoModel } from 'src/app/models/tipo-evento-model';
import { EventoService } from 'src/app/services/evento.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-tipo-eventos',
  templateUrl: './admin-tipo-eventos.component.html',
  styleUrls: ['./admin-tipo-eventos.component.css']
})
export class AdminTipoEventosComponent implements OnInit {

  tipoEventosForm: FormGroup;
  dataSource : TipoEventoModel [] = [];
  nuevoEvento: TipoEventoModel = new TipoEventoModel();
  mensaje : string = "";
  displayedColumns: string[] = ['nombre', 'descripcion'];
  isShown: boolean = false;
  isShownErr: boolean = false;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private eventoService: EventoService
  ) { 
    this.tipoEventosForm= this.createFormGroup(formBuilder);
  }

  ngOnInit(): void {
    this.consultarTiposEvento();
  }

  createFormGroup(formBuilder: FormBuilder){
    return formBuilder.group({
      tipo_evento_id: [],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    })
  }
  
  /*********************************************************
   *  Obtiene el listado de tipos de eventos
   *********************************************************/ 
  consultarTiposEvento(): void{
    this.eventoService.consultarTiposEvento().subscribe((datos) =>{
      this.dataSource = datos;
    });
  }
  
  /*********************************************************
   *  identifica si es una actualizacion o una creacion
   *********************************************************/ 
  guardarEditarTipoEvento():void{
    
    const tipoEvento: TipoEventoModel = Object.assign({}, this.tipoEventosForm?.value);

    if(tipoEvento.tipo_evento_id !== null){
      this.actualizarTipoEvento(tipoEvento);
    }else{
      this.guardarTipoEvento(tipoEvento);
    }
  }

  /*********************************************************
   *  Crea un nuevo tipo de evento
   *********************************************************/ 
  private guardarTipoEvento(tipoEvento: TipoEventoModel): void{

    this.nuevoEvento.nombre = tipoEvento.nombre;
    this.nuevoEvento.descripcion = tipoEvento.descripcion;
    this.eventoService.crearTipoEvento(this.nuevoEvento).subscribe((datos) =>{
      this.mensaje = "Tipo Evento almacenado exitosamente!";
      this.modalService.dismissAll({'dismissed': true});
      this.mostrarMensaje();
      this.consultarTiposEvento();
    }, (e: any) => {
      if(e.status === 401){
        this.mensaje = "Señor usuario usted no esta autorizado para almacenar tipos de eventos.";
        this.modalService.dismissAll({'dismissed': true});
        this.mostrarMensajeError();
      }
    });
  }


  /*********************************************************
   * Actualiza el tipo de evento
   *********************************************************/ 
  private actualizarTipoEvento(tipoEvento: TipoEventoModel): void{
    this.eventoService.actualizarTipoEvento(tipoEvento).subscribe((datos) =>{
      this.mensaje = "Tipo Evento actualizado exitosamente!";
      this.modalService.dismissAll({'dismissed': true});
      this.mostrarMensaje();
      this.consultarTiposEvento();
    }, (e: any) => {
      if(e.status === 401){
        this.mensaje = "Señor usuario usted no esta autorizado para actualizar tipos de eventos.";
        this.modalService.dismissAll({'dismissed': true});
        this.mostrarMensajeError();
      }
    });
  }
 
  /*************************************************************
   * Inicializa los valores delos campos con los datos a editar
   ************************************************************/ 
  setValueActualizaTipoEvento(tipoEvento: TipoEventoModel ): void{
   
   this.tipoEventosForm.setValue({
      nombre:       tipoEvento.nombre,
      descripcion:  tipoEvento.descripcion,
      tipo_evento_id: tipoEvento.tipo_evento_id
    });
    this.ocultarMensaje();
  }

  /*************************************************************
   * Limpia los valores de los campos para crear nuevo tipo
   ************************************************************/ 
   setValueCrearTipoEvento( content: any): void{
   
      this.tipoEventosForm.setValue({
         nombre:       "",
         descripcion:  "",
         tipo_evento_id:null
       });

       this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
       this.ocultarMensaje();
     }

  /*************************************************************
   * Eliminar Tipo de evento
   ************************************************************/ 
  eliminarTipoEvento(tipoEvento: TipoEventoModel): void{
    this.eventoService.eliminarTipoEvento(tipoEvento).subscribe((datos) =>{
      this.mensaje = "Tipo Evento eliminado exitosamente!";
      this.mostrarMensaje();
      this.consultarTiposEvento();
    }, (e: any) => {
      if(e.status === 401){
        this.mensaje = "Señor usuario usted no esta autorizado para eliminar tipos de eventos.";
        this.modalService.dismissAll({'dismissed': true});
        this.mostrarMensajeError();
      }
    });
  }

  /*************************************************************
   * Abre el modal para crear tipo evento
   ************************************************************/ 
  abreModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }


  mostrarMensaje() {
    this.isShown = true;
  }

  ocultarMensaje() {
    this.isShown = false;
    this.isShownErr  = false;
  }

/************************************************************
 * mostrarMensajeError :: Muestra mensaje de exito de operación
 *************************************************************/
  mostrarMensajeError() {
    this.isShownErr = true;
  }
}
