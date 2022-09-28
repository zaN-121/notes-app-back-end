const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');

const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyNewUserName(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rows[0]) {
      throw new InvariantError('Gagal menambahkan user, Username sudah digunakan');
    }
  }
  
  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    }
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang anda masukkan salah');
    }
    const {id, password: hashedPassword} = result.rows[0];
    
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Password yang anda masukkan salah');
    }
    return id;
  }

  async addUser({username, password, fullname}) {
    
    // TODO : verifikasi username, pastikan belum terdaftar
    await this.verifyNewUserName(username);
      
    // TODO : Bila verfikikasi lolos maka masukkan user baru ke database
      
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10); 
    /*
    bcrypt.hash(data, saltRounds) 
    data: Str = yang di hash,
    saltRounds: Numb = angka yang digunakan algoritma hash untuk menciptakan string yang tidak terprediksi,
    10 adalah nilai standard untuk saltRounds.
    */
    const query = {
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    }
    const result = await this._pool.query(query);
  
    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan user')
    }
    return result.rows[0].id;
  }

  async getUsers() {
    const result = await this._pool.query('SELECT * FROM users');
    return result.rows;
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return result.rows[0];
  }

}

module.exports = UsersService;
