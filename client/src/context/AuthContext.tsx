"use client"
import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
    _id: string
    name: string
    email: string
    role: 'student' | 'alumni' | 'admin' | 'faculty'
    profileImage?: string
    company?: string
    currentCompany?: string
    currentPosition?: string
    jobTitle?: string
    batchYear?: string
    major?: string
    department?: string
    institution?: string
    location?: string
    bio?: string
    linkedin?: string
    skills?: string[]
    isApproved?: boolean
    googleTokens?: {
        access_token?: string
        refresh_token?: string
    }
    totalRating?: number
    ratingCount?: number
    averageRating?: number
    paymentInfo?: {
        upiId: string
        bankDetails: {
            accountNumber: string
            ifscCode: string
            bankName: string
            accountHolder: string
        }
    }
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (email: string, password: string) => Promise<void>
    register: (data: RegisterData) => Promise<void>
    logout: () => void
    isLoading: boolean
    error: string | null
}

interface RegisterData {
    name: string
    email: string
    password: string
    role: string
    batchYear?: string
    company?: string
    jobTitle?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const savedToken = localStorage.getItem('alumni_token')
        if (savedToken) {
            setToken(savedToken)
            fetchUser(savedToken)
        } else {
            setIsLoading(false)
        }
    }, [])

    const fetchUser = async (authToken: string) => {
        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${authToken}` }
            })
            if (res.ok) {
                const userData = await res.json()
                setUser(userData)
            } else {
                localStorage.removeItem('alumni_token')
                setToken(null)
            }
        } catch {
            console.error('Failed to fetch user')
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (email: string, password: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const data = await res.json()
            if (!res.ok) {
                // Surface the friendly pending-approval message from the server
                throw new Error(data.message || data.error || 'Login failed')
            }
            localStorage.setItem('alumni_token', data.token)
            setToken(data.token)
            setUser(data.user)
        } catch (err: any) {
            setError(err.message)
            throw err // Re-throw so login page can avoid redirecting
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (formData: RegisterData) => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Registration failed')
            // ✅ DO NOT auto-login after registration.
            // All new users must wait for Admin approval before they can log in.
            // The signup page will show the 'Verification Pending' screen.
        } catch (err: any) {
            setError(err.message)
            throw err // Re-throw so signup page can catch it
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem('alumni_token')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading, error }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
