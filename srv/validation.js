const { Validator } = require('@sap/cds/lib/utils/validation');

const validator = new Validator({
  MaintenanceRequest: {
    title: {
      required: true,
      type: 'string',
      maxLength: 100
    },
    description: {
      required: true,
      type: 'string',
      maxLength: 1000
    },
    priority: {
      required: true,
      type: 'number',
      min: 1,
      max: 3
    },
    assetCode: {
      required: true,
      type: 'string',
      maxLength: 50
    },
    assetLocation: {
      type: 'string',
      maxLength: 200
    },
    assignedTo: {
      type: 'string',
      format: 'uuid'
    }
  }
});

module.exports = {
  validateRequest: (entity, data) => {
    const result = validator.validate(entity, data);
    if (!result.valid) {
      const error = new Error('Validation failed');
      error.code = 'INVALID_INPUT';
      error.details = result.errors;
      throw error;
    }
    return true;
  }
};