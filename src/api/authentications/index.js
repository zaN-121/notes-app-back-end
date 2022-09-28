const AutenticationHandler = require("./handler");
const routes = require('./routes');

module.exports = {
  name: 'auth-api',
  version: '1.0.0',
  register: async (server, {authenticationsService, usersService, tokenManager, validator })=> {
    const authHandler = new AutenticationHandler(authenticationsService, usersService, tokenManager, validator);
    server.route(routes(authHandler));
  },
}