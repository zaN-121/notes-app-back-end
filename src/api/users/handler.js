const { response } = require("@hapi/hapi/lib/validation");
const ClientError = require("../../exceptions/ClientError");

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      await this._validator.validateUserPayload(request.payload);
  
      const result = await this._service.addUser(request.payload);
      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId: result,
        },
      });
      response.code(201);
      return response;
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: err.message,
      });
      response.code(500);
      return response;
    }
  }

  async getUsersByUsernameHandler(request, h) {
    try {
      const { username } = request.query;
      const result = await this._service.getUsersByUsername(username);
  
      const response = h.response({
        status: 'success',
        data: {
          users: result,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'success',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server kami',
      });
      response.code(500);
      return response;
    }
  }

  async getUserByIdHandler(request, h) {
    try {
      const { userId } = request.params
      const user = await this._service.getUserById(userId);
      const response = h.response({
        status: 'success',
        data: {
          user,
        },
      });
      response.code(200);
      return response;
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server kami',
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = UsersHandler;