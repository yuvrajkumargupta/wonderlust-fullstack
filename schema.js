const Joi = require('joi');

// Listing Validation Schema
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.string().allow("", null) // optional
    }).required()
});

// Review Validation Schema
const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().min(1).required().messages({
            "string.empty": "Comment cannot be empty!",
            "any.required": "Comment is required!"
        })
    }).required()
});

// Export both schemas
module.exports = { listingSchema, reviewSchema };
