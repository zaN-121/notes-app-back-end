const ExportNotesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (
    server,
    {
      service,
      validator,
    }
  ) => {
    const exportNotesHandler = new ExportNotesHandler(service, validator);
    server.route(routes(exportNotesHandler));
  }
};
