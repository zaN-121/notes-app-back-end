const CollaborationsHandler = require("./handler")
const routes = require('./routes');

module.exports = {
    name: 'Collaborations-API',
    version: '1.0.0',
    register: async (server, {collaborationsService, notesService, validator}) => {
        const collaborationsHandler  = new CollaborationsHandler(collaborationsService, notesService, validator);
        server.route(routes(collaborationsHandler))
    }
}