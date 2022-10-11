// environment
require('dotenv').config();
const path = require('path');

//server
const Hapi = require('@hapi/hapi');

//jwt
const Jwt = require('@hapi/jwt');

//inert
const Inert = require('@hapi/inert');

// plugin
const notes = require('./api/notes');
const users = require('./api/users');
const auth = require('./api/authentications');
const collab = require('./api/collaborations');
const _exports = require('./api/exports');
const uploads = require('./api/uploads');

// services
const NotesService = require('./services/postgres/NotesService');
const UsersService = require('./services/postgres/UsersService');
const AuthenticationsService = require('./services/postgres/AuthenticationsServices');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const ProducerService = require('./services/rabbitmq/ProducerService');
const StorageService = require('./services/storage/StorageService');

// validator
const NoteValidator = require('./validator/notes');
const UsersValidator = require('./validator/users');
const authValidator = require('./validator/authentications');
const collabValidator = require('./validator/collaborations');
const exportsValidator = require('./validator/exports');
const UploadsValidator = require('./validator/uploads');

// token
const tokenManager = require('./tokenize/TokenManager');

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const usersService = new UsersService();
  const notesService = new NotesService(collaborationsService);
  const authService = new AuthenticationsService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

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
    {
      plugin: Inert,
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
    {
      plugin: collab,
      options: {
        collaborationsService,
        notesService,
        validator: collabValidator,
      }
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: exportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
  ]);
  
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
