const ClientError = require("../../exceptions/ClientError");
const response = require('../../utils/response');

class CollaborationsHandler  {
    constructor(collaborationsService, notesService, validator) {
        this._collabService = collaborationsService;
        this._notesService = notesService;
        this._validator = validator;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }

    async postCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { noteId, userId } = request.payload;
            
            await this._notesService.verifyNoteOwner(noteId, credentialId);
            
            const collaborationId = await this._collabService.addCollaboration(noteId, userId);
            return response(h, {
                status: 'success',
                message: 'Kolaborasi berhasil ditambahkan',
                data: {
                    collaborationId,
                },
            }, 201);
        } catch (error) {
            if (error instanceof ClientError) {
                return response(h, {
                    status: 'fail',
                    message: error.message,
                }, error.statusCode);
            }
            return response(h, {
                status: 'error',
                message: 'Terjadi kesalahan pada server kami',
                error: error.message
            }, 500);
        }
    }

    async deleteCollaborationHandler(request, h) {
        try{
            this._validator.validateCollaborationPayload(request.payload);
            const { noteId, userId } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            await this._notesService.verifyNoteOwner(noteId, credentialId);

            await this._collabService.deleteCollaboration(noteId, userId);
            return response(h, {
                status: 'success',
                message: 'Kolaborasi berhasil dihapus',
            }, 200);
        } catch (error) {
            if (error instanceof ClientError) {
                return response(h, {
                    status: 'fail',
                    message: error.message,
                }, error.statusCode);
            }
            return response(h, {
                status: 'error',
                message: 'Terjadi kesalahan pada server kami',
            }, 500);
        }
    }
}

module.exports = CollaborationsHandler;