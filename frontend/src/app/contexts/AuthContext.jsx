import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

const API_BASE_URL = `${import.meta.env.VITE_API_URL || ''}/api/auth`;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for stored authentication on mount
        const storedUser = localStorage.getItem('auth_user');
        const storedToken = localStorage.getItem('auth_token');

        if (storedUser && storedToken) {
            try {
                // Simplified JWT check
                const parts = storedToken.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(atob(parts[1]));
                    if (payload.exp * 1000 > Date.now()) {
                        setUser({ ...JSON.parse(storedUser), token: storedToken });
                    } else {
                        logout();
                    }
                }
            } catch (error) {
                console.error('Error loading stored auth:', error);
                logout();
            }
        }
    }, []);

    const login = async (email, password, expectedRole) => {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) return false;

            const data = await response.json();
            const token = data.token;

            // Decode token to get role (role is stored in payload)
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            // Map backend role (e.g. ROLE_ADMIN) to frontend expectations if needed
            // Our backend roles are ADMIN, HOSPITAL, DONOR
            let role = payload.role.toLowerCase(); 
            if (role.startsWith('role_')) {
                role = role.substring(5);
            }

            if (expectedRole && role !== expectedRole.toLowerCase()) {
                return false;
            }

            const userData = {
                id: payload.sub,
                email: payload.sub,
                name: payload.sub.split('@')[0], // Fallback name
                role: role,
                token
            };

            setUser(userData);
            localStorage.setItem('auth_user', JSON.stringify(userData));
            localStorage.setItem('auth_token', token);

            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const updateProfile = (updates) => {
        if (user) {
            const updatedUser = { ...user, ...updates };
            setUser(updatedUser);
            localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
    };

    const hasRole = (role) => {
        return user?.role === role;
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
        updateProfile
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
