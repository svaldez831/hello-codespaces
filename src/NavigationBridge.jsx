// src/NavigationBridge.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setNavigate } from './navigation.js'

export function NavigationBridge() {
  const navigate = useNavigate()

  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])

  return null
}
