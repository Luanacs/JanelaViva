import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Evento } from '../model/Evento';
import { Postagem } from '../model/Postagem';
import { EventoService } from '../service/evento.service';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css']
})
export class EventoComponent implements OnInit {

  evento: Evento = new Evento()
  listaEventos: Evento[]
  tipoUsuario: string = '';

  constructor(
    private router: Router,
    private eventoService: EventoService
  ) { }

  ngOnInit() {
    if (environment.token == '') {
      alert('Sua seção expirou, faça o login novamente.')
      this.router.navigate(['/entrar'])
    }

    this.findAllEventos()
  }

  findAllEventos() {
    this.eventoService.getAllEventos().subscribe((resp: Evento[]) => {
      this.listaEventos = resp
    })
  }

  cadastrar() {

    this.eventoService.postEvento(this.evento).subscribe((resp: Evento) => {
      this.evento = resp
      alert('Tema cadastrado com sucesso!')
      this.findAllEventos()
      this.evento = new Evento()
    })
  }

  checaPossibilidadeAlteracaoEvento(idEvento: number) {
    let evento: Evento | undefined = this.listaEventos.find((e) => e.id === idEvento);
    let postagens: Postagem[] | undefined = evento?.postagens.filter((e, i) => e.usuario.id === environment.id);

    return (this.isUsuarioAdmin() && postagens!.length > 0)
  }

  isUsuarioAdmin(): boolean {
    this.tipoUsuario = environment.tipo;
    return this.tipoUsuario === 'adm';
  }

}
