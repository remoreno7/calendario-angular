import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EventoModel } from '../models/evento-model';
import { TipoEventoModel } from '../models/tipo-evento-model';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  constructor( 
    private http: HttpClient) { 
    }

    urlbase: string= environment.urlApi;

    crearTipoEvento(tipoEvento: TipoEventoModel): Observable<TipoEventoModel>{
      const url = `${this.urlbase}/api/TipoEvento`;
      return this.http.post<TipoEventoModel>(url,tipoEvento);
    }

    consultarTiposEvento(): Observable<TipoEventoModel[]>{
      const token : string = localStorage.getItem('jwt')!;
      const url = `${this.urlbase}/api/TipoEvento`;
      return this.http.get<TipoEventoModel[]>(url);
    }

    actualizarTipoEvento(tipoEvento: TipoEventoModel): Observable<TipoEventoModel>{
      const url = `${this.urlbase}/api/TipoEvento/${tipoEvento.tipo_evento_id}`;
      return this.http.put<TipoEventoModel>(url, tipoEvento);
    }

    eliminarTipoEvento(tipoEvento: TipoEventoModel): Observable<TipoEventoModel>{
      const url = `${this.urlbase}/api/TipoEvento/${tipoEvento.tipo_evento_id}`;
      return this.http.delete<TipoEventoModel>(url);
    }

    guardarProgramacionEvento(evento: EventoModel): Observable<EventoModel>{
      const url = `${this.urlbase}/api/ProgramacionEvento`;
      return this.http.post<EventoModel>(url,evento);
    }

    actualizarProgramacionEvento(evento: EventoModel): Observable<EventoModel>{
      const url = `${this.urlbase}/api/ProgramacionEvento/${evento.evento_id}`;
      return this.http.put<EventoModel>(url,evento);
    }

    eliminarProgramacionEvento(id: number): Observable<EventoModel>{
      const url = `${this.urlbase}/api/ProgramacionEvento/${id}`;
      return this.http.delete<EventoModel>(url);
    }

    consultarEventos2(): Observable<EventoModel[]>{
      const url = `${this.urlbase}/api/ProgramacionEvento`;
      return this.http.get<EventoModel[]>(url);
    }

    consultarEventos(): Observable<EventoModel[]>{
      const url = `${this.urlbase}/api/ProgramacionEvento`;
      return this.http.get<EventoModel[]>(url);
    }


}
