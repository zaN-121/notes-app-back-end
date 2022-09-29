// environment
require('dotenv').config();

//server
const Hapi = require('@hapi/hapi');

//jwt
const Jwt = require('@hapi/jwt');

// plugin
const notes = require('./api/notes');
const users = require('./api/users');
const auth = require('./api/authentications');

// services
const NotesService = require('./services/postgres/NotesService');
const UsersService = require('./services/postgres/UsersService');
const AuthenticationsService = require('./services/postgres/AuthenticationsServices');

// validator
const NoteValidator = require('./validator/notes');
const UsersValidator = require('./validator/users');
const authValidator = require('./validator/authentications');

// token
const tokenManager = require('./tokenize/TokenManager');

const init = async () => {
  const usersService = new UsersService();
  const notesService = new NotesService();
  const authService = new AuthenticationsService()
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  
  await server.register([
    {
    plugin: Jwt,
    },
  ]);
  
  await server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NoteValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: auth,
      options: {
        authenticationsService: authService,
        usersService,
        tokenManager,
        validator: authValidator,
      },
    },
  ]);
  
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
