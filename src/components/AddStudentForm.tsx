import React, { useState } from 'react';

interface StudentFormData {
  firstName: string;
  lastName: string;
  dob: string;
  mother: string;
  father: string;
  guardian: string;
  phone: string;
  location: string;
}

const AddStudentForm: React.FC = () => {
  const [form, setForm] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    dob: '',
    mother: '',
    father: '',
    guardian: '',
    phone: '',
    location: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.dob) newErrors.dob = 'Date of birth is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+?\d{9,15}$/.test(form.phone.trim())) newErrors.phone = 'Enter a valid phone number';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.mother.trim() && !form.father.trim() && !form.guardian.trim()) {
      newErrors.guardian = 'At least one of mother, father, or guardian is required';
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      console.log('Student Data:', form);
      // Reset form or call parent callback here
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white/90 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Add New Student</h2>
      {submitted ? (
        <div className="text-green-600 text-center font-semibold">Student added successfully!</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-400' : 'border-gray-200'} rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="First Name"
              />
              {errors.firstName && <div className="text-xs text-red-500 mt-1">{errors.firstName}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.lastName ? 'border-red-400' : 'border-gray-200'} rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Last Name"
              />
              {errors.lastName && <div className="text-xs text-red-500 mt-1">{errors.lastName}</div>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.dob ? 'border-red-400' : 'border-gray-200'} rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            {errors.dob && <div className="text-xs text-red-500 mt-1">{errors.dob}</div>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
              <input
                type="text"
                name="mother"
                value={form.mother}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.guardian ? 'border-red-400' : 'border-gray-200'} rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Mother's Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
              <input
                type="text"
                name="father"
                value={form.father}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.guardian ? 'border-red-400' : 'border-gray-200'} rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Father's Name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian's Name</label>
            <input
              type="text"
              name="guardian"
              value={form.guardian}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.guardian ? 'border-red-400' : 'border-gray-200'} rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Guardian's Name"
            />
            {errors.guardian && <div className="text-xs text-red-500 mt-1">{errors.guardian}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent's/Guardian's Phone Number *</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-400' : 'border-gray-200'} rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="e.g. +2507xxxxxxx"
            />
            {errors.phone && <div className="text-xs text-red-500 mt-1">{errors.phone}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.location ? 'border-red-400' : 'border-gray-200'} rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Location"
            />
            {errors.location && <div className="text-xs text-red-500 mt-1">{errors.location}</div>}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition-colors"
          >
            Add Student
          </button>
        </form>
      )}
    </div>
  );
};

export default AddStudentForm; 