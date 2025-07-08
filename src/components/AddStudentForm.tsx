"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { User, Users, GraduationCap } from "lucide-react"

interface StudentFormData {
  firstName: string
  lastName: string
  dateOfBirth: string
  class: string
  guardianFirstName: string
  guardianLastName: string
  guardianContact: string
}

export default function Component() {
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    class: "",
    guardianFirstName: "",
    guardianLastName: "",
    guardianContact: "",
  })

  const [errors, setErrors] = useState<Partial<StudentFormData>>({})

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    return /^[+]?[1-9][\d\s\-()]{7,15}$/.test(phone.replace(/[\s\-()]/g, ""))
  }

  const validateContact = (contact: string) => {
    return validateEmail(contact) || validatePhone(contact)
  }

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<StudentFormData> = {}

    if (!formData.firstName.trim() || formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }

    if (!formData.lastName.trim() || formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required"
    }

    if (!formData.class) {
      newErrors.class = "Please select a class/grade"
    }

    if (!formData.guardianFirstName.trim() || formData.guardianFirstName.length < 2) {
      newErrors.guardianFirstName = "Guardian first name must be at least 2 characters"
    }

    if (!formData.guardianLastName.trim() || formData.guardianLastName.length < 2) {
      newErrors.guardianLastName = "Guardian last name must be at least 2 characters"
    }

    if (!formData.guardianContact.trim()) {
      newErrors.guardianContact = "Contact information is required"
    } else if (!validateContact(formData.guardianContact)) {
      newErrors.guardianContact = "Please enter a valid email address or phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      console.log("Student Information:", formData)
      alert("Student information submitted successfully!")
      // Here you would typically send the data to your backend
    }
  }

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      class: "",
      guardianFirstName: "",
      guardianLastName: "",
      guardianContact: "",
    })
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Student Registration</CardTitle>
            <CardDescription>Enter student information for the performance tracking system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                  <User className="h-5 w-5" />
                  Student Information
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className={errors.dateOfBirth ? "border-red-500" : ""}
                    />
                    {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class">Class/Grade *</Label>
                    <Select onValueChange={(value) => handleInputChange("class", value)}>
                      <SelectTrigger className={errors.class ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select class/grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kindergarten">Kindergarten</SelectItem>
                        <SelectItem value="grade-1">Grade 1</SelectItem>
                        <SelectItem value="grade-2">Grade 2</SelectItem>
                        <SelectItem value="grade-3">Grade 3</SelectItem>
                        <SelectItem value="grade-4">Grade 4</SelectItem>
                        <SelectItem value="grade-5">Grade 5</SelectItem>
                        <SelectItem value="grade-6">Grade 6</SelectItem>
                        <SelectItem value="grade-7">Grade 7</SelectItem>
                        <SelectItem value="grade-8">Grade 8</SelectItem>
                        <SelectItem value="grade-9">Grade 9</SelectItem>
                        <SelectItem value="grade-10">Grade 10</SelectItem>
                        <SelectItem value="grade-11">Grade 11</SelectItem>
                        <SelectItem value="grade-12">Grade 12</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.class && <p className="text-sm text-red-500">{errors.class}</p>}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Parent/Guardian Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                  <Users className="h-5 w-5" />
                  Parent/Guardian Information
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guardianFirstName">Guardian First Name *</Label>
                    <Input
                      id="guardianFirstName"
                      placeholder="Enter guardian first name"
                      value={formData.guardianFirstName}
                      onChange={(e) => handleInputChange("guardianFirstName", e.target.value)}
                      className={errors.guardianFirstName ? "border-red-500" : ""}
                    />
                    {errors.guardianFirstName && <p className="text-sm text-red-500">{errors.guardianFirstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianLastName">Guardian Last Name *</Label>
                    <Input
                      id="guardianLastName"
                      placeholder="Enter guardian last name"
                      value={formData.guardianLastName}
                      onChange={(e) => handleInputChange("guardianLastName", e.target.value)}
                      className={errors.guardianLastName ? "border-red-500" : ""}
                    />
                    {errors.guardianLastName && <p className="text-sm text-red-500">{errors.guardianLastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianContact">Contact Information *</Label>
                  <Input
                    id="guardianContact"
                    placeholder="Enter email address or phone number"
                    value={formData.guardianContact}
                    onChange={(e) => handleInputChange("guardianContact", e.target.value)}
                    className={errors.guardianContact ? "border-red-500" : ""}
                  />
                  <p className="text-sm text-gray-500">Please provide either an email address or phone number</p>
                  {errors.guardianContact && <p className="text-sm text-red-500">{errors.guardianContact}</p>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Register Student
                </Button>
                <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={handleReset}>
                  Clear Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
