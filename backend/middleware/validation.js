const Joi = require('joi');

/**
 * Validation schemas using Joi
 */

// User registration validation
const registerSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.alphanum': 'Username must contain only letters and numbers',
            'string.min': 'Username must be at least 3 characters',
            'string.max': 'Username cannot exceed 50 characters',
            'any.required': 'Username is required'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        })
});

// User login validation
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});

// Food truck creation/update validation
const foodTruckSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Food truck name must be at least 2 characters',
            'string.max': 'Food truck name cannot exceed 100 characters',
            'any.required': 'Food truck name is required'
        }),
    cuisine: Joi.string()
        .valid('burger', 'tacos', 'desserts', 'pizza', 'asian', 'mexican', 'italian', 'american', 'french', 'other')
        .required()
        .messages({
            'any.only': 'Please select a valid cuisine type',
            'any.required': 'Cuisine type is required'
        }),
    city: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'City must be at least 2 characters',
            'any.required': 'City is required'
        }),
    current_location: Joi.string()
        .max(255)
        .allow('', null)
        .optional(),
    average_price: Joi.number()
        .positive()
        .precision(2)
        .max(1000)
        .allow(null)
        .optional()
        .messages({
            'number.positive': 'Average price must be a positive number',
            'number.max': 'Average price cannot exceed 1000'
        }),
    menu: Joi.string()
        .allow('', null)
        .optional(),
    operating_hours: Joi.string()
        .max(255)
        .allow('', null)
        .optional(),
    status: Joi.string()
        .valid('active', 'inactive')
        .default('active')
        .optional(),
    image: Joi.string()
        .uri()
        .allow('', null)
        .optional()
        .messages({
            'string.uri': 'Image must be a valid URL'
        })
});

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true // Remove unknown fields
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        // Replace req.body with validated and sanitized value
        req.body = value;
        next();
    };
};

module.exports = {
    validate,
    registerSchema,
    loginSchema,
    foodTruckSchema
};
