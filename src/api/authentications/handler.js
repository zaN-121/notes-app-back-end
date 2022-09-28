const ClientError = require("../../exceptions/ClientError");

class AutenticationHandler {
  constructor(
    authenticationsService,
    usersService,
    tokenManager,
    validator,) {
    this._authService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthHandler = this.postAuthHandler.bind(this);
    this.putAuthHandler = this.putAuthHandler.bind(this);
    this.deleteAuthHandler = this.deleteAuthHandler.bind(this);
  }

  async postAuthHandler(request, h) {
    try{
      this._validator.validatePostAuthPayload(request.payload);
      const { username, password } = request.payload;

      const id = await this._usersService.verifyCredential(username, password);

      const accessToken =  this._tokenManager.generateAcessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      await this._authService.addRefreshToken(refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
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
        message: 'Terjadi kesalahan pada server kami',
      });
      response.code(500);
      return response;
    }
  }

  async putAuthHandler(request, h) {
    try {
      this._validator.validatePutAuthPayload(request.payload);
      const { refreshToken } = request.payload;
      await this._authService.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = await this._tokenManager.generateAcessToken({ id });

      return {
        status: 'success',
        message: 'Access token berhasil diperbarui',
        data: {
          accessToken,
        },
      }
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

  async deleteAuthHandler(request, h) {
    try {
      this._validator.validateDeleteAuthPayload(request.payload);
      const { refreshToken } = request.payload;
      await this._authService.verifyRefreshToken(refreshToken); 
      await this._authService.deleteRefreshToken(refreshToken);

      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      }
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

module.exports = AutenticationHandler;