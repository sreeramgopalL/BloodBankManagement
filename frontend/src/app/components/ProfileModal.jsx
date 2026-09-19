import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { X, User, Camera, Mail, Shield, Smartphone, MapPin, Save, Edit3 } from 'lucide-react';
import { Button, Card } from 'react-bootstrap';

import { useState } from 'react';

export function ProfileModal({ onClose }) {
    const { user, updateProfile } = useAuth();
    const { donors, updateDonorDetails } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '9500457895',
        address: user?.address || '',
        city: user?.city || ''
    });

    const handleSave = async () => {
        // 1. Update local Auth state
        updateProfile(formData);

        // 2. Persist to backend if Donor
        if (user?.role?.toLowerCase() === 'donor') {
            const donorRecord = donors.find(d => d.email === user.email || d.name === user.name);
            if (donorRecord) {
                await updateDonorDetails(donorRecord.id, {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city || donorRecord.city
                });
            }
        }

        setIsEditing(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateProfile({ profileImage: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="position-fixed inset-0 z-2000 overflow-hidden" style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000 }}>
            {/* Backdrop */}
            <div
                className="position-absolute w-100 h-100 bg-black opacity-25"
                onClick={onClose}
                style={{ backdropFilter: 'blur(4px)', transition: 'opacity 0.3s ease' }}
            />

            {/* Side Drawer */}
            <div
                className="position-absolute top-0 end-0 h-100 bg-white shadow-lg d-flex flex-column border-start transition-all"
                style={{ width: '100%', maxWidth: '400px', zIndex: 2010 }}
            >
                {/* Header */}
                <div className="p-4 d-flex justify-content-between align-items-center border-bottom">
                    <h5 className="fw-bold mb-0 text-dark">Donor Profile</h5>
                    <Button
                        variant="light"
                        onClick={onClose}
                        className="rounded-circle p-2 d-flex align-items-center justify-content-center border shadow-sm"
                        style={{ width: '40px', height: '40px' }}
                    >
                        <X size={20} className="text-dark" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-grow-1 overflow-auto px-4 py-5 text-center">
                    <div className="position-relative d-inline-block mb-4">
                        <div
                            className="rounded-circle overflow-hidden border border-4 border-white shadow-lg mx-auto d-flex align-items-center justify-content-center bg-light"
                            style={{ width: '180px', height: '180px' }}
                        >
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt="Profile" className="w-100 h-100 object-fit-cover" />
                            ) : (
                                <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-primary-red-light text-primary-red">
                                    <User size={80} />
                                </div>
                            )}
                        </div>

                        {/* Camera Overlay Button */}
                        <label
                            className="position-absolute bottom-0 end-0 bg-primary-red text-white p-3 rounded-circle shadow-lg border border-3 border-white cursor-pointer hover-shadow transition-all"
                            style={{ cursor: 'pointer', transform: 'translate(-10%, -10%)' }}
                            title="Update Profile Photo"
                        >
                            <Camera size={20} />
                            <input
                                type="file"
                                className="d-none"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    {isEditing ? (
                        <div className="px-4 mb-4">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-control form-control-lg text-center fw-bold border-0 bg-light rounded-3"
                                placeholder="Your Name"
                            />
                        </div>
                    ) : (
                        <h3 className="fw-bold text-dark mt-3 mb-1">{user?.name}</h3>
                    )}

                    <Badge bg="danger" className="bg-opacity-10 text-danger border border-danger border-opacity-25 px-3 py-2 rounded-pill fw-bold text-uppercase mb-4" style={{ fontSize: '11px' }}>
                        {user?.role} Account
                    </Badge>

                    <div className="w-100 mt-5 pt-4 border-top text-start">
                        <div className="d-flex justify-content-between align-items-center mb-4 ps-2">
                            <h6 className="small fw-bold text-secondary text-uppercase mb-0" style={{ letterSpacing: '1px' }}>Account Information</h6>
                            <Button
                                variant="link"
                                className="text-primary-red p-0 text-decoration-none small fw-bold"
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            >
                                {isEditing ? <><Save size={14} className="me-1" /> Save</> : <><Edit3 size={14} className="me-1" /> Edit</>}
                            </Button>
                        </div>

                        <Card className="border-0 bg-light rounded-4 mb-3">
                            <Card.Body className="p-3 d-flex align-items-center gap-3">
                                <div className="bg-white p-2 rounded-3 shadow-sm text-primary-red">
                                    <Mail size={18} />
                                </div>
                                <div className="flex-grow-1">
                                    <small className="text-secondary d-block" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</small>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-control form-control-sm border-0 bg-transparent p-0 shadow-none fw-medium"
                                        />
                                    ) : (
                                        <span className="fw-medium">{user?.email || 'Not provided'}</span>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 bg-light rounded-4 mb-3">
                            <Card.Body className="p-3 d-flex align-items-center gap-3">
                                <div className="bg-white p-2 rounded-3 shadow-sm text-primary-red">
                                    <Smartphone size={18} />
                                </div>
                                <div className="flex-grow-1">
                                    <small className="text-secondary d-block" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Contact Number</small>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="form-control form-control-sm border-0 bg-transparent p-0 shadow-none fw-medium"
                                        />
                                    ) : (
                                        <span className="fw-medium">{user?.phone || '+91 9500457895'}</span>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 bg-light rounded-4 mb-3">
                            <Card.Body className="p-3 d-flex align-items-center gap-3">
                                <div className="bg-white p-2 rounded-3 shadow-sm text-primary-red">
                                    <MapPin size={18} />
                                </div>
                                <div className="flex-grow-1">
                                    <small className="text-secondary d-block" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Address</small>
                                    {isEditing ? (
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="form-control form-control-sm border-0 bg-transparent p-0 shadow-none fw-medium"
                                            rows="2"
                                            placeholder="Enter your full address"
                                        />
                                    ) : (
                                        <span className="fw-medium">{user?.address || 'Not provided'}</span>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="border-0 bg-light rounded-4 mb-3">
                            <Card.Body className="p-3 d-flex align-items-center gap-3">
                                <div className="bg-white p-2 rounded-3 shadow-sm text-primary-red">
                                    <Shield size={18} />
                                </div>
                                <div>
                                    <small className="text-secondary d-block" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Account Security</small>
                                    <span className="fw-medium text-success">Verified Donor Account</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-top">
                    <Button
                        variant="primary-red"
                        className="w-100 py-3 rounded-3 fw-bold shadow-sm"
                        onClick={onClose}
                    >
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Helper component for Badge if not imported
function Badge({ children, bg, className, style }) {
    return (
        <span className={`badge bg-${bg} ${className}`} style={style}>
            {children}
        </span>
    );
}
