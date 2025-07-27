"use client"

import React, { useState, useRef, useEffect } from "react"
import { User, Users, GraduationCap, Phone, Plus, Minus, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react"

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

const steps = [
  "Student Information",
  "Guardians",
  "Emergency Contacts"
]

// Add prop to AddStudentForm
interface AddStudentFormProps {
  onCancel?: () => void;
}

export default function AddStudentForm({ onCancel }: AddStudentFormProps) {
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
  const [step, setStep] = useState(0)
  const [success, setSuccess] = useState("")
  const [errorBanner, setErrorBanner] = useState("")
  const firstFieldRef = useRef<HTMLInputElement>(null)
  // Replace with static class options 1-6
  const staticClasses = [
    { class_id: 1, class_name: '1' },
    { class_id: 2, class_name: '2' },
    { class_id: 3, class_name: '3' },
    { class_id: 4, class_name: '4' },
    { class_id: 5, class_name: '5' },
    { class_id: 6, class_name: '6' },
  ];

  // Relationship options for dropdown
  const relationshipOptions = [
    "Father",
    "Mother",
    "Guardian",
    "Grandparent",
    "Sibling",
    "Aunt/Uncle",
    "Other"
  ];

  React.useEffect(() => {
    if (firstFieldRef.current) firstFieldRef.current.focus()
  }, [step])

  const validateRwandaPhone = (phone: string) => {
    const cleanPhone = phone.replace(/\s|\-|\(|\)/g, "")
    return /^\+250[0-9]{9}$/.test(cleanPhone)
  }

  // Update getSubclassOptions to always return A, B, C for classes 1-6
  const getSubclassOptions = (mainClass: string) => {
    if (["1", "2", "3", "4", "5", "6"].includes(mainClass)) {
      return ["A", "B", "C"];
    }
    return [];
  };

  // --- Validation per step ---
  const validateStep = (): boolean => {
    const newErrors: any = {}
    if (step === 0) {
      // Student info
      if (!formData.firstName.trim() || formData.firstName.length < 2) newErrors.firstName = "First name must be at least 2 characters"
      if (!formData.lastName.trim() || formData.lastName.length < 2) newErrors.lastName = "Last name must be at least 2 characters"
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
      if (!formData.gender) newErrors.gender = "Gender is required"
      if (!formData.class) newErrors.class = "Please select a class/grade"
      if (!formData.subclass) newErrors.subclass = "Please select a subclass"
    } else if (step === 1) {
      // Guardians
      newErrors.guardians = []
      formData.guardians.forEach((g, i) => {
        const gErr: any = {}
        if (!g.firstName.trim() || g.firstName.length < 2) gErr.firstName = "First name must be at least 2 characters"
        if (!g.lastName.trim() || g.lastName.length < 2) gErr.lastName = "Last name must be at least 2 characters"
        if (!g.relationship.trim()) gErr.relationship = "Relationship is required"
        if (!g.contact.trim()) gErr.contact = "Contact information is required"
        else if (!validateRwandaPhone(g.contact)) gErr.contact = "Please enter a valid Rwanda phone number (+250xxxxxxxxx)"
        if (Object.keys(gErr).length > 0) newErrors.guardians[i] = gErr
      })
    } else if (step === 2) {
      // Emergency contacts
      newErrors.emergencyContacts = []
      formData.emergencyContacts.forEach((c, i) => {
        const cErr: any = {}
        if (!c.firstName.trim() || c.firstName.length < 2) cErr.firstName = "First name must be at least 2 characters"
        if (!c.lastName.trim() || c.lastName.length < 2) cErr.lastName = "Last name must be at least 2 characters"
        if (!c.relationship.trim()) cErr.relationship = "Relationship is required"
        if (!c.contact.trim()) cErr.contact = "Contact information is required"
        else if (!validateRwandaPhone(c.contact)) cErr.contact = "Please enter a valid Rwanda phone number (+250xxxxxxxxx)"
        if (Object.keys(cErr).length > 0) newErrors.emergencyContacts[i] = cErr
      })
    }
    setErrors(newErrors)
    // Only allow next if no errors for this step
    if (step === 1 && newErrors.guardians) return newErrors.guardians.every((g: any) => !g)
    if (step === 2 && newErrors.emergencyContacts) return newErrors.emergencyContacts.every((e: any) => !e)
    return Object.keys(newErrors).length === 0
  }

  // --- Handlers ---
  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev: any) => ({ ...prev, [field]: "" }))
  }
  const handleGuardianChange = (index: number, field: keyof Contact, value: string) => {
    const newGuardians = [...formData.guardians]
    newGuardians[index] = { ...newGuardians[index], [field]: value }
    setFormData((prev) => ({ ...prev, guardians: newGuardians }))
    if (errors.guardians?.[index]?.[field]) {
      const newErrors = { ...errors }
      if (newErrors.guardians?.[index]) delete newErrors.guardians[index][field]
      setErrors(newErrors)
    }
  }
  const handleEmergencyContactChange = (index: number, field: keyof Contact, value: string) => {
    const newEmergencyContacts = [...formData.emergencyContacts]
    newEmergencyContacts[index] = { ...newEmergencyContacts[index], [field]: value }
    setFormData((prev) => ({ ...prev, emergencyContacts: newEmergencyContacts }))
    if (errors.emergencyContacts?.[index]?.[field]) {
      const newErrors = { ...errors }
      if (newErrors.emergencyContacts?.[index]) delete newErrors.emergencyContacts[index][field]
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
  const copyGuardianToEmergency = (index: number) => {
    if (formData.guardians[index]) {
      setFormData((prev) => ({
        ...prev,
        emergencyContacts: [
          { ...prev.guardians[index] },
          ...prev.emergencyContacts.slice(1)
        ]
      }))
    }
  }
  const handleClassChange = (value: string) => {
    setFormData((prev) => ({ ...prev, class: value, subclass: "" }))
    if (errors.class) setErrors((prev: any) => ({ ...prev, class: "" }))
  }
  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1)
      setErrorBanner("")
    } else {
      setErrorBanner("Please fix the errors below before continuing.")
    }
  }
  const handleBack = () => {
    setStep((prev) => prev - 1)
    setErrorBanner("")
  }
  const handleSubmit = async () => {
    if (validateStep()) {
      setLoading(true);
      setSuccess("");
      setErrorBanner("");
      try {
        // Prepare payload with class_id as a number
        const payload = {
          ...formData,
          class_id: Number(formData.class),
          full_name: formData.firstName + ' ' + formData.lastName,
        };
        delete payload.class;
        const response = await fetch("http://127.0.0.1:5051/api/students/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          setSuccess("Student information submitted successfully!");
          setStep(0);
          setFormData({
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            gender: "",
            class: "",
            subclass: "",
            guardians: [{ firstName: "", lastName: "", relationship: "", contact: "" }],
            emergencyContacts: [{ firstName: "", lastName: "", relationship: "", contact: "" }],
          });
          setErrors({});
        } else {
          const data = await response.json();
          setErrorBanner(data.message || "Failed to submit student information.");
        }
      } catch (err) {
        setErrorBanner("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrorBanner("Please fix the errors below before submitting.");
    }
  };
  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear the form?")) {
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
      setStep(0)
      setSuccess("")
      setErrorBanner("")
    }
  }

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-8 sm:px-4">
      <div className="max-w-full mx-auto sm:max-w-2xl">
        <div className="rounded-2xl shadow-2xl bg-white p-4 max-h-[90vh] overflow-y-auto sm:p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold">Student Registration</h2>
            <p className="text-gray-600">Enter student information for the performance tracking system</p>
          </div>
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-6">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white ${i === step ? 'bg-blue-600' : 'bg-gray-300'}`}>{i+1}</div>
                {i < steps.length-1 && <div className="w-8 h-1 bg-gray-300 mx-1 rounded" />}
              </div>
            ))}
                </div>
          <div className="text-center mb-4 font-semibold text-blue-700">{steps[step]}</div>
          {success && (
            <div className="mb-4 flex items-center justify-center bg-green-100 text-green-700 rounded-lg px-4 py-2"><CheckCircle className="w-5 h-5 mr-2" />{success}</div>
          )}
          {errorBanner && (
            <div className="mb-4 flex items-center justify-center bg-red-100 text-red-700 rounded-lg px-4 py-2"><AlertCircle className="w-5 h-5 mr-2" />{errorBanner}</div>
          )}
          {/* Step 1: Student Info */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-1">First Name</label>
                <input ref={firstFieldRef} type="text" className={`w-full px-4 py-2 rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`} value={formData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} aria-label="First Name" />
                {errors.firstName && <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>}
                </div>
              <div>
                <label className="block font-medium mb-1">Last Name</label>
                <input type="text" className={`w-full px-4 py-2 rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`} value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} aria-label="Last Name" />
                {errors.lastName && <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>}
              </div>
              <div>
                <label className="block font-medium mb-1">Date of Birth</label>
                <input type="date" className={`w-full px-4 py-2 rounded-lg border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`} value={formData.dateOfBirth} onChange={e => handleInputChange('dateOfBirth', e.target.value)} aria-label="Date of Birth" />
                {errors.dateOfBirth && <div className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</div>}
                </div>
              <div>
                <label className="block font-medium mb-1">Gender</label>
                <select className={`w-full px-4 py-2 rounded-lg border ${errors.gender ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`} value={formData.gender} onChange={e => handleInputChange('gender', e.target.value)} aria-label="Gender">
                  <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  <option value="other">Other</option>
                  </select>
                {errors.gender && <div className="text-red-500 text-sm mt-1">{errors.gender}</div>}
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Class/Grade</label>
                  <select className={`w-full px-4 py-2 rounded-lg border ${errors.class ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`} value={formData.class} onChange={e => handleClassChange(e.target.value)} aria-label="Class">
                    <option value="">Select Class</option>
                    {staticClasses.map(cls => (
                      <option key={cls.class_id} value={cls.class_id}>{cls.class_name}</option>
                    ))}
                  </select>
                  {errors.class && <div className="text-red-500 text-sm mt-1">{errors.class}</div>}
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Subclass</label>
                  <select className={`w-full px-4 py-2 rounded-lg border ${errors.subclass ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`} value={formData.subclass} onChange={e => handleInputChange('subclass', e.target.value)} aria-label="Subclass">
                    <option value="">Select Subclass</option>
                    {getSubclassOptions(formData.class).map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                  {errors.subclass && <div className="text-red-500 text-sm mt-1">{errors.subclass}</div>}
                </div>
              </div>
            </div>
          )}
          {/* Step 2: Guardians */}
          {step === 1 && (
            <div className="space-y-6">
              {formData.guardians.map((g, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 mb-2 border border-gray-200 relative">
                  <div className="font-semibold mb-2 flex items-center gap-2">Guardian {i+1} <Users className="w-4 h-4 text-blue-400" /></div>
                    {formData.guardians.length > 1 && (
                    <button type="button" className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeGuardian(i)} aria-label="Remove Guardian"><Minus /></button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-1">First Name</label>
                      <input type="text" className={`w-full px-4 py-2 rounded-lg border ${errors.guardians?.[i]?.firstName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`} value={g.firstName} onChange={e => handleGuardianChange(i, 'firstName', e.target.value)} aria-label="Guardian First Name" />
                      {errors.guardians?.[i]?.firstName && <div className="text-red-500 text-sm mt-1">{errors.guardians[i].firstName}</div>}
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Last Name</label>
                      <input type="text" className={`w-full px-4 py-2 rounded-lg border ${errors.guardians?.[i]?.lastName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`} value={g.lastName} onChange={e => handleGuardianChange(i, 'lastName', e.target.value)} aria-label="Guardian Last Name" />
                      {errors.guardians?.[i]?.lastName && <div className="text-red-500 text-sm mt-1">{errors.guardians[i].lastName}</div>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block font-medium mb-1">Relationship</label>
                      <select className={`w-full px-4 py-2 rounded-lg border ${errors.guardians?.[i]?.relationship ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`} value={g.relationship} onChange={e => handleGuardianChange(i, 'relationship', e.target.value)} aria-label="Guardian Relationship">
                        <option value="">Select Relationship</option>
                        {relationshipOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {errors.guardians?.[i]?.relationship && <div className="text-red-500 text-sm mt-1">{errors.guardians[i].relationship}</div>}
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Phone</label>
                      <input type="text" className={`w-full px-4 py-2 rounded-lg border ${errors.guardians?.[i]?.contact ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`} value={g.contact} onChange={e => handleGuardianChange(i, 'contact', e.target.value)} aria-label="Guardian Phone" placeholder="+250xxxxxxxxx" />
                      {errors.guardians?.[i]?.contact && <div className="text-red-500 text-sm mt-1">{errors.guardians[i].contact}</div>}
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200" onClick={addGuardian}><Plus className="w-4 h-4" /> Add Guardian</button>
            </div>
          )}
          {/* Step 3: Emergency Contacts */}
          {step === 2 && (
            <div className="space-y-6">
              {formData.emergencyContacts.map((c, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 mb-2 border border-gray-200 relative">
                  <div className="font-semibold mb-2 flex items-center gap-2">Contact {i+1} <Phone className="w-4 h-4 text-blue-400" /></div>
                  {formData.emergencyContacts.length > 1 && (
                    <button type="button" className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeEmergencyContact(i)} aria-label="Remove Contact"><Minus /></button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium mb-1">First Name</label>
                      <input type="text" className={`w-full px-4 py-2 rounded-lg border ${errors.emergencyContacts?.[i]?.firstName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`} value={c.firstName} onChange={e => handleEmergencyContactChange(i, 'firstName', e.target.value)} aria-label="Contact First Name" />
                      {errors.emergencyContacts?.[i]?.firstName && <div className="text-red-500 text-sm mt-1">{errors.emergencyContacts[i].firstName}</div>}
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Last Name</label>
                      <input type="text" className={`w-full px-4 py-2 rounded-lg border ${errors.emergencyContacts?.[i]?.lastName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`} value={c.lastName} onChange={e => handleEmergencyContactChange(i, 'lastName', e.target.value)} aria-label="Contact Last Name" />
                      {errors.emergencyContacts?.[i]?.lastName && <div className="text-red-500 text-sm mt-1">{errors.emergencyContacts[i].lastName}</div>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block font-medium mb-1">Relationship</label>
                      <select className={`w-full px-4 py-2 rounded-lg border ${errors.emergencyContacts?.[i]?.relationship ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`} value={c.relationship} onChange={e => handleEmergencyContactChange(i, 'relationship', e.target.value)} aria-label="Contact Relationship">
                        <option value="">Select Relationship</option>
                        {relationshipOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {errors.emergencyContacts?.[i]?.relationship && <div className="text-red-500 text-sm mt-1">{errors.emergencyContacts[i].relationship}</div>}
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Phone</label>
                      <input type="text" className={`w-full px-4 py-2 rounded-lg border ${errors.emergencyContacts?.[i]?.contact ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`} value={c.contact} onChange={e => handleEmergencyContactChange(i, 'contact', e.target.value)} aria-label="Contact Phone" placeholder="+250xxxxxxxxx" />
                      {errors.emergencyContacts?.[i]?.contact && <div className="text-red-500 text-sm mt-1">{errors.emergencyContacts[i].contact}</div>}
                    </div>
                  </div>
                  {formData.guardians[i] && (
                    <button type="button" className="mt-2 px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100" onClick={() => copyGuardianToEmergency(i)} aria-label={`Copy Guardian Info`}>Copy from Guardian {i+1}</button>
                  )}
                </div>
              ))}
              <button type="button" className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200" onClick={addEmergencyContact}><Plus className="w-4 h-4" /> Add Contact</button>
            </div>
          )}
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <button type="button" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200" onClick={handleBack}><ChevronLeft /> Back</button>
            ) : <div />}
            {step < steps.length - 1 ? (
              <button type="button" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={handleNext}><span>Next</span> <ChevronRight /></button>
            ) : (
              <button type="button" className={`flex items-center gap-2 px-4 py-2 rounded-lg ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} text-white`} onClick={handleSubmit} disabled={loading}>{loading ? (<><svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Submitting...</>) : (<><CheckCircle className="w-5 h-5" />Submit</>)}</button>
            )}
            <div className="flex gap-2 ml-0 sm:gap-4 sm:ml-4">
              <button type="button" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200" onClick={handleReset}>Reset</button>
              <button type="button" className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200" onClick={onCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}