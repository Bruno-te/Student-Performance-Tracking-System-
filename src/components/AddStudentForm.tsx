"use client"

import React, { useState } from "react"
import { User, Users, GraduationCap, Phone, Plus, Minus } from "lucide-react"

interface Contact {
  firstName: string
  lastName: string
  relationship: string
  contact: string
}

interface StudentFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  class: string
  subclass: string
  guardians: Contact[]
  emergencyContacts: Contact[]
}

export default function AddStudentForm() {
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    class: "",
    subclass: "",
    guardians: [{ firstName: "", lastName: "", relationship: "", contact: "" }],
    emergencyContacts: [{ firstName: "", lastName: "", relationship: "", contact: "" }],
  })

  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const validateRwandaPhone = (phone: string) => {
    const cleanPhone = phone.replace(/[\s\-()]/g, "")
    return /^\+250[0-9]{9}$/.test(cleanPhone)
  }

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleGuardianChange = (index: number, field: keyof Contact, value: string) => {
    const newGuardians = [...formData.guardians]
    newGuardians[index] = { ...newGuardians[index], [field]: value }
    setFormData((prev) => ({ ...prev, guardians: newGuardians }))
    
    if (errors.guardians?.[index]?.[field]) {
      const newErrors = { ...errors }
      if (newErrors.guardians?.[index]) {
        delete newErrors.guardians[index][field]
      }
      setErrors(newErrors)
    }
  }

  const handleEmergencyContactChange = (index: number, field: keyof Contact, value: string) => {
    const newEmergencyContacts = [...formData.emergencyContacts]
    newEmergencyContacts[index] = { ...newEmergencyContacts[index], [field]: value }
    setFormData((prev) => ({ ...prev, emergencyContacts: newEmergencyContacts }))
    
    if (errors.emergencyContacts?.[index]?.[field]) {
      const newErrors = { ...errors }
      if (newErrors.emergencyContacts?.[index]) {
        delete newErrors.emergencyContacts[index][field]
      }
      setErrors(newErrors)
    }
  }

  const addGuardian = () => {
    setFormData((prev) => ({
      ...prev,
      guardians: [...prev.guardians, { firstName: "", lastName: "", relationship: "", contact: "" }]
    }))
  }

  const removeGuardian = (index: number) => {
    if (formData.guardians.length > 1) {
      const newGuardians = formData.guardians.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, guardians: newGuardians }))
    }
  }

  const addEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { firstName: "", lastName: "", relationship: "", contact: "" }]
    }))
  }

  const removeEmergencyContact = (index: number) => {
    if (formData.emergencyContacts.length > 1) {
      const newEmergencyContacts = formData.emergencyContacts.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, emergencyContacts: newEmergencyContacts }))
    }
  }

  const getSubclassOptions = (mainClass: string) => {
    const subclassMap: { [key: string]: string[] } = {
      "kindergarten": ["A", "B", "C"],
      "grade-1": ["A", "B", "C"],
      "grade-2": ["A", "B", "C"],
      "grade-3": ["A", "B", "C"],
      "grade-4": ["A", "B", "C"],
      "grade-5": ["A", "B", "C"],
      "grade-6": ["A", "B", "C"],
      "grade-7": ["A", "B", "C"],
      "grade-8": ["A", "B", "C"],
      "grade-9": ["A", "B", "C"],
      "grade-10": ["A", "B", "C"],
      "grade-11": ["A", "B", "C"],
      "grade-12": ["A", "B", "C"],
    }
    return subclassMap[mainClass] || []
  }

  const validateForm = (): boolean => {
    const newErrors: any = {}
    
    // Student validation
    if (!formData.firstName.trim() || formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }
    if (!formData.lastName.trim() || formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required"
    }
    if (!formData.gender) {
      newErrors.gender = "Gender is required"
    }
    if (!formData.class) {
      newErrors.class = "Please select a class/grade"
    }
    if (!formData.subclass) {
      newErrors.subclass = "Please select a subclass"
    }

    // Guardian validation
    newErrors.guardians = []
    formData.guardians.forEach((guardian, index) => {
      const guardianErrors: any = {}
      if (!guardian.firstName.trim() || guardian.firstName.length < 2) {
        guardianErrors.firstName = "First name must be at least 2 characters"
      }
      if (!guardian.lastName.trim() || guardian.lastName.length < 2) {
        guardianErrors.lastName = "Last name must be at least 2 characters"
      }
      if (!guardian.relationship.trim()) {
        guardianErrors.relationship = "Relationship is required"
      }
      if (!guardian.contact.trim()) {
        guardianErrors.contact = "Contact information is required"
      } else if (!validateRwandaPhone(guardian.contact)) {
        guardianErrors.contact = "Please enter a valid Rwanda phone number (+250xxxxxxxxx)"
      }
      if (Object.keys(guardianErrors).length > 0) {
        newErrors.guardians[index] = guardianErrors
      }
    })

    // Emergency contact validation
    newErrors.emergencyContacts = []
    formData.emergencyContacts.forEach((contact, index) => {
      const contactErrors: any = {}
      if (!contact.firstName.trim() || contact.firstName.length < 2) {
        contactErrors.firstName = "First name must be at least 2 characters"
      }
      if (!contact.lastName.trim() || contact.lastName.length < 2) {
        contactErrors.lastName = "Last name must be at least 2 characters"
      }
      if (!contact.relationship.trim()) {
        contactErrors.relationship = "Relationship is required"
      }
      if (!contact.contact.trim()) {
        contactErrors.contact = "Contact information is required"
      } else if (!validateRwandaPhone(contact.contact)) {
        contactErrors.contact = "Please enter a valid Rwanda phone number (+250xxxxxxxxx)"
      }
      if (Object.keys(contactErrors).length > 0) {
        newErrors.emergencyContacts[index] = contactErrors
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 || 
           (Object.keys(newErrors).every(key => 
             key === 'guardians' || key === 'emergencyContacts') && 
           newErrors.guardians?.every((g: any) => !g) && 
           newErrors.emergencyContacts?.every((e: any) => !e))
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setLoading(true)
      setTimeout(() => {
        console.log("Student Information:", formData)
        alert("Student information submitted successfully!")
        setLoading(false)
      }, 1200)
    }
  }

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      class: "",
      subclass: "",
      guardians: [{ firstName: "", lastName: "", relationship: "", contact: "" }],
      emergencyContacts: [{ firstName: "", lastName: "", relationship: "", contact: "" }],
    })
    setErrors({})
  }

  const handleClassChange = (value: string) => {
    setFormData((prev) => ({ ...prev, class: value, subclass: "" }))
    if (errors.class) {
      setErrors((prev: any) => ({ ...prev, class: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl shadow-2xl bg-white p-8 max-h-[80vh] overflow-y-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold">Student Registration</h2>
            <p className="text-gray-600">Enter student information for the performance tracking system</p>
          </div>
          
          <div className="space-y-8">
            {/* Student Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <User className="h-5 w-5" />
                Student Information
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block font-medium">First Name *</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("firstName", e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                    autoFocus
                  />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block font-medium">Last Name *</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("lastName", e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="dateOfBirth" className="block font-medium">Date of Birth *</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("dateOfBirth", e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.dateOfBirth ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="gender" className="block font-medium">Gender *</label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange("gender", e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border bg-white ${errors.gender ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="class" className="block font-medium">Class/Grade *</label>
                  <select
                    id="class"
                    value={formData.class}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleClassChange(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border bg-white ${errors.class ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select class/grade</option>
                    <option value="kindergarten">Kindergarten</option>
                    <option value="grade-1">Grade 1</option>
                    <option value="grade-2">Grade 2</option>
                    <option value="grade-3">Grade 3</option>
                    <option value="grade-4">Grade 4</option>
                    <option value="grade-5">Grade 5</option>
                    <option value="grade-6">Grade 6</option>
                    <option value="grade-7">Grade 7</option>
                    <option value="grade-8">Grade 8</option>
                    <option value="grade-9">Grade 9</option>
                    <option value="grade-10">Grade 10</option>
                    <option value="grade-11">Grade 11</option>
                    <option value="grade-12">Grade 12</option>
                  </select>
                  {errors.class && <p className="text-sm text-red-500">{errors.class}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subclass" className="block font-medium">Subclass *</label>
                  <select
                    id="subclass"
                    value={formData.subclass}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange("subclass", e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border bg-white ${errors.subclass ? "border-red-500" : "border-gray-300"}`}
                    disabled={!formData.class}
                  >
                    <option value="">Select subclass</option>
                    {getSubclassOptions(formData.class).map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.subclass && <p className="text-sm text-red-500">{errors.subclass}</p>}
                </div>
              </div>
            </div>

            <hr className="my-6" />

            {/* Parent/Guardian Information Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                  <Users className="h-5 w-5" />
                  Parent/Guardian Information
                </div>
                <button
                  type="button"
                  onClick={addGuardian}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  tabIndex={0}
                >
                  <Plus className="h-4 w-4" />
                  Add Guardian
                </button>
              </div>
              
              {formData.guardians.map((guardian, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Guardian {index + 1}</h4>
                    {formData.guardians.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGuardian(index)}
                        className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                        tabIndex={0}
                      >
                        <Minus className="h-4 w-4" />
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block font-medium">First Name *</label>
                      <input
                        type="text"
                        placeholder="Enter first name"
                        value={guardian.firstName}
                        onChange={(e) => handleGuardianChange(index, "firstName", e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.guardians?.[index]?.firstName ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors.guardians?.[index]?.firstName && (
                        <p className="text-sm text-red-500">{errors.guardians[index].firstName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block font-medium">Last Name *</label>
                      <input
                        type="text"
                        placeholder="Enter last name"
                        value={guardian.lastName}
                        onChange={(e) => handleGuardianChange(index, "lastName", e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.guardians?.[index]?.lastName ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors.guardians?.[index]?.lastName && (
                        <p className="text-sm text-red-500">{errors.guardians[index].lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block font-medium">Relationship *</label>
                      <select
                        value={guardian.relationship}
                        onChange={(e) => handleGuardianChange(index, "relationship", e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border bg-white ${errors.guardians?.[index]?.relationship ? "border-red-500" : "border-gray-300"}`}
                      >
                        <option value="">Select relationship</option>
                        <option value="father">Father</option>
                        <option value="mother">Mother</option>
                        <option value="guardian">Guardian</option>
                        <option value="stepfather">Stepfather</option>
                        <option value="stepmother">Stepmother</option>
                        <option value="grandparent">Grandparent</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.guardians?.[index]?.relationship && (
                        <p className="text-sm text-red-500">{errors.guardians[index].relationship}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block font-medium">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="+250xxxxxxxxx"
                        value={guardian.contact}
                        onChange={(e) => handleGuardianChange(index, "contact", e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.guardians?.[index]?.contact ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors.guardians?.[index]?.contact && (
                        <p className="text-sm text-red-500">{errors.guardians[index].contact}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-6" />

            {/* Emergency Contact Information Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                  <Phone className="h-5 w-5" />
                  Emergency Contact Information
                </div>
                <button
                  type="button"
                  onClick={addEmergencyContact}
                  className="flex items-center gap-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                  tabIndex={0}
                >
                  <Plus className="h-4 w-4" />
                  Add Emergency Contact
                </button>
              </div>
              
              {formData.emergencyContacts.map((contact, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4 bg-red-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Emergency Contact {index + 1}</h4>
                    {formData.emergencyContacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmergencyContact(index)}
                        className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:bg-red-100 rounded"
                        tabIndex={0}
                      >
                        <Minus className="h-4 w-4" />
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block font-medium">First Name *</label>
                      <input
                        type="text"
                        placeholder="Enter first name"
                        value={contact.firstName}
                        onChange={(e) => handleEmergencyContactChange(index, "firstName", e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.emergencyContacts?.[index]?.firstName ? "border-red-500" : "border-gray-300"} bg-white`}
                      />
                      {errors.emergencyContacts?.[index]?.firstName && (
                        <p className="text-sm text-red-500">{errors.emergencyContacts[index].firstName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block font-medium">Last Name *</label>
                      <input
                        type="text"
                        placeholder="Enter last name"
                        value={contact.lastName}
                        onChange={(e) => handleEmergencyContactChange(index, "lastName", e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.emergencyContacts?.[index]?.lastName ? "border-red-500" : "border-gray-300"} bg-white`}
                      />
                      {errors.emergencyContacts?.[index]?.lastName && (
                        <p className="text-sm text-red-500">{errors.emergencyContacts[index].lastName}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block font-medium">Relationship *</label>
                      <select
                        value={contact.relationship}
                        onChange={(e) => handleEmergencyContactChange(index, "relationship", e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border bg-white ${errors.emergencyContacts?.[index]?.relationship ? "border-red-500" : "border-gray-300"}`}
                      >
                        <option value="">Select relationship</option>
                        <option value="relative">Relative</option>
                        <option value="friend">Family Friend</option>
                        <option value="neighbor">Neighbor</option>
                        <option value="doctor">Doctor</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.emergencyContacts?.[index]?.relationship && (
                        <p className="text-sm text-red-500">{errors.emergencyContacts[index].relationship}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block font-medium">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="+250xxxxxxxxx"
                        value={contact.contact}
                        onChange={(e) => handleEmergencyContactChange(index, "contact", e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.emergencyContacts?.[index]?.contact ? "border-red-500" : "border-gray-300"} bg-white`}
                      />
                      {errors.emergencyContacts?.[index]?.contact && (
                        <p className="text-sm text-red-500">{errors.emergencyContacts[index].contact}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                onClick={handleSubmit} 
                className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                disabled={loading}
                tabIndex={0}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Register Student'
                )}
              </button>
              <button 
                onClick={handleReset}
                className="flex-1 py-3 rounded-lg border border-blue-600 text-blue-700 font-semibold bg-white hover:bg-blue-50 transition"
              >
                Clear Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}