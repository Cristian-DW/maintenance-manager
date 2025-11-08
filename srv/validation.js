const { Validator } = require('@sap/cds/lib/utils/validation');

const validator = new Validator({
  MaintenanceRequest: {
    title: {
      required: true,
      type: 'string',
      maxLength: 200
    },
    description: {
      required: false,
      type: 'string'
    },
    priority: {
      required: true,
      type: 'number',
      min: 1,
      max: 3
    },
    asset_ID: {
      required: true,
      type: 'string',
      format: 'uuid'
    },
    requestedBy_ID: {
      required: false, // Se asignará automáticamente en el handler
      type: 'string',
      format: 'uuid'
    },
    assignedTo_ID: {
      required: false,
      type: 'string',
      format: 'uuid'
    },
    status: {
      required: false, // Se establecerá automáticamente
      type: 'string'
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