import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit} from '@angular/core';
import {catalogos} from '../../../../environments/catalogos';
import swal from 'sweetalert2';
import {User} from '../../../models/user';
import {Ability} from '../../../models/ability';
import {ProfessionalService} from '../../../services/professional.service';

@Component({
  selector: 'app-fortalezas',
  templateUrl: './fortalezas.component.html',
  styleUrls: ['./fortalezas.component.css']
})
export class FortalezasComponent implements OnInit {
  abilities: Array<Ability>;
  selectedAbility: Ability;
  actual_page: number;
  records_per_page: number;
  total_pages: number;
  flagPagination: boolean;
  messages: any;
  userLogged: User;
  categorias: Array<any>;

  constructor(
    private modalService: NgbModal,
    public postulanteService: ProfessionalService) {
  }

  ngOnInit() {
    this.actual_page = 1;
    this.records_per_page = 4;
    this.total_pages = 1;
    this.flagPagination = false;
    this.userLogged = JSON.parse(sessionStorage.getItem('user_logged')) as User;
    this.selectedAbility = new Ability();
    this.categorias = catalogos.categoriasFortaleza;
    this.messages = catalogos.messages;
    this.getAbilities();

  }

  paginate(siguiente: boolean) {
    this.flagPagination = true;
    if (siguiente) {
      if (this.actual_page === this.total_pages) {
        this.flagPagination = false;
        return;
      } else {
        this.actual_page++;
      }
    } else {
      if (this.actual_page === 1) {
        this.flagPagination = false;
        return;
      } else {
        this.actual_page--;
      }
    }
    this.getAbilities();
  }

  open(content, selectedAbility: Ability, editar) {
    if (editar) {
      this.selectedAbility = selectedAbility;
    } else {
      this.selectedAbility = new Ability();
    }
    this.modalService.open(content)
      .result
      .then((resultModal => {
        if (resultModal === 'save') {
          if (editar) {
            this.updateAbility();
          } else {
            this.createAbility();
          }
        }
      }), (resultCancel => {

      }));
  }

  getAbilities(): void {
    this.postulanteService.getAbilities(this.actual_page, this.records_per_page, this.userLogged.id, this.userLogged.api_token)
      .subscribe(
        response => {
          this.abilities = response['abilities']['data'];
          this.total_pages = response['pagination']['last_page'];
          this.flagPagination = false;
        },
        error => {
          if (error.status === 401) {
            swal({
              position: this.messages['createError401']['position'],
              type: this.messages['createError401']['type'],
              title: this.messages['createError401']['title'],
              text: this.messages['createError401']['text'],
              showConfirmButton: this.messages['createError401']['showConfirmButton'],
              backdrop: this.messages['createError401']['backdrop']
            });
          }
        });
  }

  createAbility(): void {
    this.selectedAbility.state = 'ACTIVE';
    this.postulanteService.createAbility(
      {'ability': this.selectedAbility, 'user': this.userLogged}, this.userLogged.api_token)
      .subscribe(
        response => {
          this.getAbilities();
          swal({
            position: this.messages['createSuccess']['position'],
            type: this.messages['createSuccess']['type'],
            title: this.messages['createSuccess']['title'],
            text: this.messages['createSuccess']['text'],
            timer: this.messages['createSuccess']['timer'],
            showConfirmButton: this.messages['createSuccess']['showConfirmButton'],
            backdrop: this.messages['createSuccess']['backdrop']
          });
        },
        error => {

          if (error.valueOf().error.errorInfo[0] === '23505') {
            swal({
              position: this.messages['createError23505']['position'],
              type: this.messages['createError23505']['type'],
              title: this.messages['createError23505']['title'],
              text: this.messages['createError23505']['text'],
              showConfirmButton: this.messages['createError23505']['showConfirmButton'],
              backdrop: this.messages['createError23505']['backdrop']
            });
          }
          if (error.status === 401) {
            swal({
              position: this.messages['createError401']['position'],
              type: this.messages['createError401']['type'],
              title: this.messages['createError401']['title'],
              text: this.messages['createError401']['text'],
              showConfirmButton: this.messages['createError401']['showConfirmButton'],
              backdrop: this.messages['createError401']['backdrop']
            });
          }

          if (error.status === 500) {
            swal({
              position: this.messages['createError500']['position'],
              type: this.messages['createError500']['type'],
              title: this.messages['createError500']['title'],
              text: this.messages['createError500']['text'],
              showConfirmButton: this.messages['createError500']['showConfirmButton'],
              backdrop: this.messages['createError500']['backdrop']
            });
          }
        });
  }

  updateAbility(): void {
    this.postulanteService.updateAbility({'ability': this.selectedAbility}, this.userLogged.api_token)
      .subscribe(
        response => {
          this.getAbilities();
          swal({
            position: this.messages['updateSuccess']['position'],
            type: this.messages['updateSuccess']['type'],
            title: this.messages['updateSuccess']['title'],
            text: this.messages['updateSuccess']['text'],
            timer: this.messages['updateSuccess']['timer'],
            showConfirmButton: this.messages['updateSuccess']['showConfirmButton'],
            backdrop: this.messages['updateSuccess']['backdrop']
          });
        },
        error => {
          if (error.status === 401) {
            swal({
              position: this.messages['updateError401']['position'],
              type: this.messages['updateError401']['type'],
              title: this.messages['updateError401']['title'],
              text: this.messages['updateError401']['text'],
              showConfirmButton: this.messages['updateError401']['showConfirmButton'],
              backdrop: this.messages['updateError401']['backdrop']
            });
          }

          if (error.status === 500) {
            swal({
              position: this.messages['updateError500']['position'],
              type: this.messages['updateError500']['type'],
              title: this.messages['updateError500']['title'],
              text: this.messages['updateError500']['text'],
              showConfirmButton: this.messages['updateError500']['showConfirmButton'],
              backdrop: this.messages['updateError500']['backdrop']
            });
          }
        });
  }

  deleteAbility(ability: Ability): void {
    swal({
      position: this.messages['deleteQuestion']['position'],
      type: this.messages['deleteQuestion']['type'],
      title: this.messages['deleteQuestion']['title'],
      text: this.messages['deleteQuestion']['text'],
      showConfirmButton: this.messages['deleteQuestion']['showConfirmButton'],
      showCancelButton: this.messages['deleteQuestion']['showCancelButton'],
      confirmButtonColor: this.messages['deleteQuestion']['confirmButtonColor'],
      cancelButtonColor: this.messages['deleteQuestion']['cancelButtonColor'],
      confirmButtonText: this.messages['deleteQuestion']['confirmButtonText'],
      cancelButtonText: this.messages['deleteQuestion']['cancelButtonText'],
      reverseButtons: this.messages['deleteQuestion']['reverseButtons'],
      backdrop: this.messages['deleteQuestion']['backdrop'],
    }).then((result) => {
      if (result.value) {
        this.postulanteService.deleteAbility(ability.id, this.userLogged.api_token).subscribe(
          response => {
            this.getAbilities();
            swal({
              position: this.messages['deleteSuccess']['position'],
              type: this.messages['deleteSuccess']['type'],
              title: this.messages['deleteSuccess']['title'],
              text: this.messages['deleteSuccess']['text'],
              timer: this.messages['deleteSuccess']['timer'],
              showConfirmButton: this.messages['deleteSuccess']['showConfirmButton'],
              backdrop: this.messages['deleteSuccess']['backdrop'],
            });
          },
          error => {
            if (error.status === 401) {
              swal({
                position: this.messages['deleteError401']['position'],
                type: this.messages['deleteError401']['type'],
                title: this.messages['deleteError401']['title'],
                text: this.messages['deleteError401']['text'],
                showConfirmButton: this.messages['deleteError401']['showConfirmButton'],
                backdrop: this.messages['deleteError401']['backdrop']
              });
            }

            if (error.status === 500) {
              swal({
                position: this.messages['deleteError500']['position'],
                type: this.messages['deleteError500']['type'],
                title: this.messages['deleteError500']['title'],
                text: this.messages['deleteError500']['text'],
                showConfirmButton: this.messages['deleteError500']['showConfirmButton'],
                backdrop: this.messages['deleteError500']['backdrop']
              });
            }
          });
      }
    });
  }
}
