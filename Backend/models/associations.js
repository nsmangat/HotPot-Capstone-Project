const Report = require('./report');
const Pothole = require('./pothole');

Report.belongsTo(Pothole, { foreignKey: 'pothole_id', as: 'Pothole' });

module.exports = { Report, Pothole };
