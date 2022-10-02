const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsersByUsernameHandler,
  },
  {
    method: 'GET',
    path: '/users/{userId}',
    handler: handler.getUserByIdHandler,
  },
]
module.exports = routes;
