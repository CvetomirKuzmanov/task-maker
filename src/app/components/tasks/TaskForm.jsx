'use client'

import { useState } from "react"

export default function TaskForm({ onCreateTask }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    })

    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required'

        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsSubmitting(true)

        try {
            await onCreateTask(formData)

            setFormData({ title: '', description: '' })
        } catch (err) {
            try {
                const parsedErrors = JSON.parse(err.message)
                if (typeof parsedErrors === 'object') {
                    setErrors(parsedErrors)
                }


            } catch (e) {
                setErrors({ form: err.message })
            } finally {
                isSubmitting(false)
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>

            {errors.form && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded">
                    {errors.form}
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Task Title<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
            </div>

            <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md text-white font-medium ${isSubmitting
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
        </form>
    );
}