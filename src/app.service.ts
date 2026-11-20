import { Injectable } from '@nestjs/common';
import mysql from 'mysql2/promise';
import { Foglalas } from './foglalas.js';

const mysqlConnection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'reservations13e'
})

@Injectable()
export class AppService {
  async getIndex() {
    const [results] = await mysqlConnection.execute(
      'SELECT name,email,startDate,guests FROM reservations'
    )
    const rows = results as Foglalas[]
    return rows.length
  }

  async postIndex(foglalas: Foglalas) {
    const [post] = await mysqlConnection.execute(
      'INSERT INTO reservations(name,email,startDate,guests) VALUES(?,?,?,?)',
      [foglalas.name, foglalas.email, foglalas.startDate, foglalas.guests]
    )
    return await this.getIndex();
  }
}
