export const validateTask = (data) => {
    const errors = {}

    if (!data.title || data.title.trim() === '') {
        errors.title = 'Title is required'
    } else if (data.title.length > 255) {
        errors.title = 'Title must be less than 255 characters long'
    }

    if (data.description && data.description.length > 1000) {
        errors.description = 'Description must be less than 1000 characters long'
    } 

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}