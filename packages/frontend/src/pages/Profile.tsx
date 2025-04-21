import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/common/ui/Button'
import Card from '@/components/common/ui/Card'
import Input from '@/components/common/ui/Input'
import { handleApiError } from '@/utils/errorHandling'
import useToast from '@/hooks/useToast'
import { userService } from '@/services/api/user.service'

interface ProfileForm {
  name: string
  email: string
}

interface ProfileErrors {
  name?: string
  email?: string
}

const Profile = () => {
  const { user, updateUser } = useAuth()
  const { success } = useToast()
  
  const [formData, setFormData] = useState<ProfileForm>({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [formErrors, setFormErrors] = useState<ProfileErrors>({})
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  useEffect(() => {
    // Set document title
    document.title = 'My Profile | Gemstone System'
    
    // Update form data when user changes (e.g. after login)
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      })
    }
  }, [user])
  
  const handleInputChange = (field: keyof ProfileForm, value: string) => {
    // Clear field error when user types
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const validateForm = (): boolean => {
    const errors: ProfileErrors = {}
    let isValid = true
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
      isValid = false
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid'
      isValid = false
    }
    
    setFormErrors(errors)
    return isValid
  }
  
  const handleSave = async () => {
    if (!validateForm()) return
    
    setIsSaving(true)
    
    try {
      // Only update if values changed
      if (formData.name !== user?.name || formData.email !== user?.email) {
        const updatedUser = await userService.updateProfile({
          name: formData.name,
          email: formData.email,
        })
        
        // Update user in auth context
        updateUser(updatedUser)
        success('Profile updated successfully')
      }
      
      setIsEditing(false)
    } catch (error) {
      handleApiError(error, 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      })
    }
    
    // Clear errors and exit editing mode
    setFormErrors({})
    setIsEditing(false)
  }
  
  if (!user) {
    return <div>Loading...</div>
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="md:col-span-2">
          <Card>
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium mb-4">Profile Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Input
                    label="Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={formErrors.name}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={formErrors.email}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {user.role}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Status</div>
                  <div className="mt-1">
                    {user.isVerified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending Verification
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row sm:space-x-3">
                {isEditing ? (
                  <>
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      isLoading={isSaving}
                      className="mb-3 sm:mb-0"
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </Card>
          
          {/* Security Section */}
          <Card className="mt-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium mb-4">Security</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Password</span>
                  <Button
                    variant="link"
                    onClick={() => {/* Navigate to change password page */}}
                  >
                    Change Password
                  </Button>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Two-Factor Authentication</span>
                  <Button
                    variant="link"
                    onClick={() => {/* Navigate to 2FA setup page */}}
                  >
                    Not Set Up
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Account Stats */}
        <div>
          <Card>
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium mb-4">Account Information</h2>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Member Since</div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Login</div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>
              
              <h3 className="text-md font-medium mt-6 mb-3">Your Collections</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Gemstones</div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rough Stones</div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Jewelry Items</div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Certificates</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile 