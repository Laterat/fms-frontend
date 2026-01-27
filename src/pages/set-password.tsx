import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function SetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        alert('Invalid or expired invite link')
        window.location.href = '/login'
      }
      setLoading(false)
    })
  }, [])

  const handleSetPassword = async () => {
    if (password.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      alert(error.message)
    } else {
      alert('Password set successfully')
      await supabase.auth.signOut()
      window.location.href = '/login'
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Set your password</h1>

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleSetPassword}>
        Set Password
      </button>
    </div>
  )
}
