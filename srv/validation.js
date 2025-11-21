// Simple validation helper functions
const validators = {
    MaintenanceRequest: (data) => {
        const errors = [];

        if (!data.title || typeof data.title !== 'string' || data.title.length === 0) {
            errors.push('Title is required and must be a non-empty string');
        }

        if (data.title && data.title.length > 200) {
            errors.push('Title must not exceed 200 characters');
        }

        if (data.description && typeof data.description !== 'string') {
            errors.push('Description must be a string');
        }

        if (data.description && data.description.length > 2000) {
            errors.push('Description must not exceed 2000 characters');
        }

        if (!data.priority) {
            errors.push('Priority is required');
        }

        const priorityNum = Number(data.priority);
        if (data.priority && (isNaN(priorityNum) || priorityNum < 1 || priorityNum > 3)) {
            errors.push('Priority must be 1 (Low), 2 (Medium), or 3 (High)');
        }

        if (!data.asset_ID) {
            errors.push('Asset ID is required');
        }

        return errors;
    }
};

function validateRequest(entityName, data) {
    const errors = validators[entityName]?.(data) || [];
    if (errors.length > 0) {
        const error = new Error(errors.join('; '));
        error.details = errors.map(msg => ({ message: msg }));
        throw error;
    }
}

module.exports = {
    validateRequest
};