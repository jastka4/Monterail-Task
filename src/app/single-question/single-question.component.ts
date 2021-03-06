import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuestionsService } from '../_services/questions.service';
import { ProfilesService } from '../_services/profiles.service';
import * as moment from 'moment';

@Component({
  selector: 'app-single-question',
  templateUrl: './single-question.component.html',
  styleUrls: ['./single-question.component.scss']
})
export class SingleQuestionComponent implements OnInit {
  _route: any;
  id: number;
  questions: any = [];
  question =[];
  profiles:any = [];

  constructor(private questionsService: QuestionsService,
              private profilesService: ProfilesService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.questions = this.questionsService.questions;
    this.profiles = this.profilesService.profiles;
    this._route = this.route.params.subscribe(params => {
      this.id = +params['id']
      //console.log(this.route);
      //console.log(this.id);
      this.question = this.questions[this.id];
      console.log(this.question)
    });
  }

  ngOnDestroy() {
    this._route.unsubscribe()
  }

  ifUpvotes(votes: number): string {
    if (votes >= 0)
        return 'upvotes'
    else
        return 'downvotes'
  }

  toNaturalNumber(number: number) {
    return number > 0 ? number : -number
  }

  getProfilePicture(username: string) {
    for(let i = 0; i < this.profiles.length; i++) {
        if (this.profiles[i].username === username)
            return this.profiles[i].picture
    }
  }

  getLastActivityDate(id: number): number {
    let last = this.questions[id].date;
    console.log(last);
    for(let i = 0, _answers = this.questions[id].answers ; i < _answers.length; i++) {
      last = _answers[i].date < last ? _answers[i].date : last;
      if(_answers[i].comments){
        for(let j, _comments = _answers[i].comments; j < _comments.length; j++) {
          last = _comments[j].date < last ? _comments[j].date : last;
          console.log(last);
        }
      } 
    }
    let create = moment(this.questions[id].date);
    last = moment(last);
    return last.diff(create, 'days') === 0 ? 1 : last.diff(create, 'days')
  }
}
