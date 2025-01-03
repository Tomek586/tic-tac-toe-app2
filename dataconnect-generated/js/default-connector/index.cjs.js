const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'tic-tac-toe-app2',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

