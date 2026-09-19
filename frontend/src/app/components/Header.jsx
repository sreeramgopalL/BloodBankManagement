import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Droplet, LogOut, User, ArrowLeft } from 'lucide-react';
import { ProfileModal } from './ProfileModal';
import { Navbar, Container, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router';

import logo from '../../assets/logo.jpg';

export function Header({ showBackButton = false, hideUserInfo = false }) {
    const { user, logout } = useAuth();
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();

    const getRoleBadgeStyles = () => {
        if (!user) return {};
       
        return {
            backgroundColor: 'transparent',
            color: '#10b981',
            border: '1px solid #10b981'
        };
    };

    return (
        <>
            <Navbar bg="white" fixed="top" className="border-bottom shadow-sm py-2" style={{ zIndex: 1050 }}>
                <Container fluid="lg" className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        {showBackButton && (
                            <Button
                                variant="light"
                                className="rounded-circle p-2 me-2"
                                onClick={() => navigate(-1)}
                                title="Go Back"
                            >
                                <ArrowLeft size={20} />
                            </Button>
                        )}
                        <Navbar.Brand className="d-flex align-items-center gap-2 m-0 cursor-pointer" onClick={() => navigate('/')}>
                            <img
                                src={logo}
                                alt="Blood Bank Logo"
                                className="rounded-2 shadow-sm object-fit-cover"
                                style={{ width: '45px', height: '45px' }}
                            />
                            <div className="d-flex flex-column justify-content-center">
                                <span className="h5 mb-0 fw-bold text-dark" style={{ letterSpacing: '-0.5px' }}>Blood Bank</span>
                                <small className="text-secondary fw-medium" style={{ fontSize: '11px', marginTop: '-2px' }}>Management System</small>
                            </div>
                        </Navbar.Brand>
                    </div>

                    {!hideUserInfo && user && (
                        <div className="d-flex align-items-center gap-3">
                            <div className="text-end d-none d-md-block">
                                <p className="mb-0 fw-bold text-dark small lh-sm">{user.name}</p>
                                <p className="mb-0 text-secondary small lh-sm" style={{ fontSize: '0.7rem' }}>{user.email}</p>
                            </div>

                            <Badge
                                pill
                                className="px-3 py-2 fw-bold text-uppercase border-0"
                                style={{ ...getRoleBadgeStyles(), fontSize: '10px', letterSpacing: '0.5px' }}
                            >
                                {user.role}
                            </Badge>

                            <div
                                className="bg-light rounded-circle d-flex align-items-center justify-content-center cursor-pointer hover-bg-gray-200 overflow-hidden"
                                style={{ width: '40px', height: '40px', cursor: 'pointer', border: '2px solid #FECACA' }}
                                onClick={() => setShowProfile(true)}
                            >
                                {user?.profileImage ? (
                                    <img src={user.profileImage} alt="Profile" className="w-100 h-100 object-fit-cover" />
                                ) : (
                                    <User size={20} className="text-secondary" />
                                )}
                            </div>

                            <Button
                                variant="light"
                                className="d-flex align-items-center gap-2 rounded-3 px-3 py-2 border-1"
                                style={{
                                    backgroundColor: '#FEE2E2',
                                    color: '#B91C1C',
                                    border: '1px solid #FECACA'
                                }}
                                onClick={logout}
                            >
                                <LogOut size={16} className="text-primary-red" />
                                <span className="fw-bold small">Logout</span>
                            </Button>
                        </div>
                    )}

                    {hideUserInfo && showBackButton && (
                        <div className="d-flex align-items-center">
                            <span className="text-secondary small fw-medium">Register as a New Donor</span>
                        </div>
                    )}
                </Container>
            </Navbar>

            {showProfile && user && <ProfileModal onClose={() => setShowProfile(false)} />}
        </>
    );
}
