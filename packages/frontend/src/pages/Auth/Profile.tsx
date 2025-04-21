import React, { useState, useEffect } from 'react'
import useAuth from '@/hooks/useAuth'
import Button from '@/components/common/ui/Button'
import Card from '@/components/common/ui/Card'
import Input from '@/components/common/ui/Input'
import useToast from '@/hooks/useToast'

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth()
  const { success } = useToast()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  useEffect(() => {
    // Set document title
    document.title = 'My Profile | Gemstone System'
    
    // Update form data when user changes
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])
  
  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update user info
    if (user) {
      updateUser({ 
        ...user,
        name,
        email 
      })
    }
    
    success('Profile updated successfully')
    setIsEditing(false)
    setIsSaving(false)
  }
  
  if (!user) {
    return <div className="p-8 text-center">Loading profile...</div>
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          
          <div className="space-y-4">
            <div>
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Role
              </label>
              <div className="text-secondary-900 py-2 capitalize">
                {user.role || 'User'}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            {isEditing ? (
              <div className="flex gap-3">
                <Button 
                  variant="primary" 
                  onClick={handleSave}
                  isLoading={isSaving}
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setName(user.name || '')
                    setEmail(user.email || '')
                    setIsEditing(false)
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
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
      
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium mb-2">Account Created</h3>
              <p className="text-secondary-600">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-2">Last Login</h3>
              <p className="text-secondary-600">
                {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-secondary-200">
            <h3 className="text-md font-medium mb-4">Security Settings</h3>
            
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="font-medium">Password</div>
                <div className="text-sm text-secondary-500">Last changed 30 days ago</div>
              </div>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-secondary-500">Enhance your account security</div>
              </div>
              <Button variant="outline" size="sm">
                Not Enabled
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Profile