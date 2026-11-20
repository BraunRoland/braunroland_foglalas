import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { count } from 'console';
import { FoglalasDto } from './foglalas.dto.js';
import { start } from 'repl';
import { Foglalas } from './foglalas.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async getIndex() {
    return {
      count: await this.appService.getIndex()
    }
  }

  @Post()
  @Render('index')
  async postIndex(@Body() body: FoglalasDto) {
    const name = body.name;
    const email = body.email;
    const startDate = body.startDate;
    const guests = body.guests;
   
    const emailRegex = /.{1,}@.{1,}/gmi;
    const nameRegex = /^[A-Z]{1}\w{1,}\ [A-Z]{1}\w{1,}$/gm;
    const dateRegex = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}\T[0-9]{2}\:[0-9]{2}/gm

    const emailErr = emailRegex.test(email)? null : "Rossz email cím!";
    const nameErr = nameRegex.test(name)? null : "Rossz Név!";
    let dateErr = null;
    if (!dateRegex.test(startDate)) {
      dateErr = "Rossz dátum!";
    }
    else if (new Date() > new Date(startDate)) {
      dateErr = "A dátum nem lehet kisebb a mai dátumnál!"
    }
    const guestsErr = Number(guests) <= 10 && Number(guests) >= 1? null : "Rossz nézők száma!"
    const errList = [
      emailErr, nameErr, dateErr, guestsErr
    ];
    
    if (errList.some(e => typeof e === "string")) {
      // inputError
      return {
        count: await this.appService.getIndex(),
        nameErr: nameErr,
        emailErr: emailErr,
        dateErr: dateErr,
        guestsErr: guestsErr,
        name: name,
        email: email,
        startDate: startDate,
        guests: guests
      }
    }
    try {
      const post = await this.appService.postIndex({name: name, email: email, startDate: new Date(startDate), guests: Number(guests)} as Foglalas);
      return{
        //sikeres feltoltes
        count: post,
        postMessage: "Sikeres foglalás!",
        postSuccess: true
      }
    } 
    catch (err) {
      if (err instanceof Error) {
        //adatbazis Error
        return {
          count: await this.appService.getIndex(),
          postMessage: err.message,
          postSuccess: false 
        }
      }
    }
  }
}
