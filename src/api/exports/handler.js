const ClientError = require("../../exceptions/ClientError");

class ExportNotesHandler {
  constructor(
    service,
    validator,
  ) {
    this._service = service;
    this._validator = validator;

    this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
  }

  async postExportNotesHandler(request, h) {
    try {
      await this._validator.validateExportPayload(request.payload);

      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
      }

      await this._service.sendMessage('export:notes', JSON.stringify(message)); // message harus dalam bentuk string maka JSON.stringify() kan!

      const response = h.response({
        status: 'success',
        message: 'Permintaan anda dalam antrean',
      }).code(201);

      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);

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

module.exports = ExportNotesHandler;
