import { useState, useEffect } from 'react';
import { Droplet, Calendar, Heart, Mail, Phone, MapPin, CheckCircle2, Clock, User, Loader2 } from 'lucide-react';
import { Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

export function DonorDashboard() {
    const { user } = useAuth();
    const [donorInfo, setDonorInfo] = useState(null);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonorData = async () => {
            if (!user?.email) return;
            try {
                const apiUrl = import.meta.env.VITE_API_URL || '';
                const resProfile = await fetch(`${apiUrl}/api/donors/email/${user.email}`);
                if (resProfile.ok) {
                    const profile = await resProfile.json();
                    setDonorInfo(profile);
                    
                    if (profile?.id) {
                        const resDonations = await fetch(`${apiUrl}/api/inventory/donor/${profile.id}`);
                        if (resDonations.ok) {
                            const data = await resDonations.json();
                            setDonations(data);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching donor dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDonorData();
    }, [user?.email]);

    const getNextEligibleDate = (lastDateStr) => {
        if (!lastDateStr) return 'Eligible Now';
        try {
            const lastDate = new Date(lastDateStr);
            if (isNaN(lastDate.getTime())) return 'Eligible Now';
            lastDate.setMonth(lastDate.getMonth() + 3);
            const today = new Date();
            if (lastDate <= today) return 'Eligible Now';
            return lastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return 'Eligible Now';
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <Spinner animation="border" variant="danger" />
            </div>
        );
    }

    const bloodGroup = donorInfo?.bloodGroup || 'O+';
    const totalDonations = donations.length;
    const livesSaved = totalDonations * 3;
    const donationStatus = donorInfo?.status === 'APPROVED' ? 'Eligible' : (donorInfo?.status || 'PENDING');
    const lastDonation = donorInfo?.lastDonationDate || 'None';
    const nextEligible = getNextEligibleDate(donorInfo?.lastDonationDate);


    const getInitials = (name) => {
        if (!name) return 'D';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="pb-5">
            <Card 
                className="border-0 shadow-lg mb-4 text-white position-relative overflow-hidden transition-all hover-shadow"
                style={{
                    background: 'linear-gradient(135deg, #e11d48 0%, #be123c 50%, #881337 100%)',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px -15px rgba(225, 29, 72, 0.45)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                {/* Decorative background circle */}
                <div 
                    className="position-absolute rounded-circle bg-white opacity-10"
                    style={{
                        width: '300px',
                        height: '300px',
                        top: '-150px',
                        right: '-50px',
                        filter: 'blur(30px)',
                        pointerEvents: 'none'
                    }}
                />
                
                {/* Secondary decorative background circle */}
                <div 
                    className="position-absolute rounded-circle bg-danger opacity-20"
                    style={{
                        width: '200px',
                        height: '200px',
                        bottom: '-100px',
                        left: '-50px',
                        filter: 'blur(20px)',
                        pointerEvents: 'none'
                    }}
                />

                <Card.Body className="p-4 p-md-5 position-relative z-1">
                    <Row className="align-items-center g-4 mb-4">
                        <Col md="auto" className="text-center text-md-start">
                            <div 
                                className="rounded-circle d-flex align-items-center justify-content-center text-rose fw-bold bg-white shadow-lg mx-auto"
                                style={{
                                    width: '90px',
                                    height: '90px',
                                    fontSize: '32px',
                                    color: '#be123c',
                                    border: '4px solid rgba(255, 255, 255, 0.25)',
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                                }}
                            >
                                {getInitials(donorInfo?.name || user?.name)}
                            </div>
                        </Col>
                        <Col className="text-center text-md-start">
                            <Badge 
                                bg="light" 
                                className="text-rose px-3 py-2 rounded-pill fw-bold text-uppercase mb-2 shadow-sm d-inline-flex align-items-center gap-1 border border-danger border-opacity-10"
                                style={{ fontSize: '11px', color: '#be123c' }}
                            >
                                <CheckCircle2 size={13} fill="#be123c" className="text-white" /> Verified Hero
                            </Badge>
                            <h1 className="display-5 fw-bold mb-1 text-white text-shadow-sm">{donorInfo?.name || user?.name}</h1>
                            <p className="fs-5 text-primary-red-light mb-0 fw-medium opacity-90">Blood Donor Community</p>
                        </Col>
                    </Row>

                    <Row className="mb-4 g-4 text-white text-center text-md-start bg-black bg-opacity-20 p-4 rounded-4 border border-white border-opacity-10 mx-1">
                        <Col xs={4}>
                            <small className="text-primary-red-label d-block mb-1 fw-bold text-uppercase small" style={{ letterSpacing: '1px', opacity: 0.8 }}>Blood Group</small>
                            <h2 className="fw-bold mb-0 display-6 d-flex align-items-center justify-content-center justify-content-md-start gap-1">
                                <Droplet size={24} className="text-rose fill-rose" style={{ color: '#fda4af' }} />
                                {bloodGroup}
                            </h2>
                        </Col>
                        <Col xs={4} className="border-start border-white border-opacity-20">
                            <small className="text-primary-red-label d-block mb-1 fw-bold text-uppercase small" style={{ letterSpacing: '1px', opacity: 0.8 }}>Total Donations</small>
                            <h2 className="fw-bold mb-0 display-6">{totalDonations}</h2>
                        </Col>
                        <Col xs={4} className="border-start border-white border-opacity-20">
                            <small className="text-primary-red-label d-block mb-1 fw-bold text-uppercase small" style={{ letterSpacing: '1px', opacity: 0.8 }}>Lives Saved</small>
                            <h2 className="fw-bold mb-0 display-6 text-warning" style={{ color: '#fef08a' }}>{livesSaved}+</h2>
                        </Col>
                    </Row>

                    <div 
                        className="pt-3 px-4 pb-3 rounded-4 mt-4 text-white"
                        style={{ 
                            backgroundColor: 'rgba(0, 0, 0, 0.15)', 
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                    >
                        <Row className="gy-3 align-items-center small">
                            <Col md={4} className="d-flex justify-content-center justify-content-md-start">
                                <div className="d-flex align-items-center gap-2">
                                    <Phone size={14} className="text-white opacity-75" />
                                    <span>{donorInfo?.phone || user?.phone || '+91 9500457895'}</span>
                                </div>
                            </Col>
                            <Col md={4} className="d-flex justify-content-center">
                                <div className="d-flex align-items-center gap-2">
                                    <Mail size={14} className="text-white opacity-75" />
                                    <span>{donorInfo?.email || user?.email || 'meens@donor.com'}</span>
                                </div>
                            </Col>
                            <Col md={4} className="d-flex justify-content-center justify-content-md-end">
                                <div className="d-flex align-items-center gap-2">
                                    <MapPin size={14} className="text-white opacity-75" />
                                    <span>{donorInfo?.address || donorInfo?.city || user?.address || 'Coimbatore'}</span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Card.Body>
            </Card>

            <Row className="g-4 mb-5">
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Body className="d-flex align-items-center gap-3 p-4">
                            <div className="bg-success bg-opacity-10 p-3 rounded-4">
                                <CheckCircle2 className="text-success" size={28} />
                            </div>
                            <div>
                                <small className="text-secondary d-block">Donation Status</small>
                                <h5 className="fw-bold mb-0 text-success">{donationStatus}</h5>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Body className="d-flex align-items-center gap-3 p-4">
                            <div className="bg-success bg-opacity-10 p-3 rounded-4">
                                <Calendar className="text-success" size={28} />
                            </div>
                            <div>
                                <small className="text-secondary d-block">Last Donation</small>
                                <h5 className="fw-bold mb-0 text-dark">{lastDonation}</h5>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Body className="d-flex align-items-center gap-3 p-4">
                            <div className="bg-success bg-opacity-10 p-3 rounded-4">
                                <Clock className="text-success" size={28} />
                            </div>
                            <div>
                                <small className="text-secondary d-block">Next Eligible</small>
                                <h5 className="fw-bold mb-0 text-success">{nextEligible}</h5>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold text-dark mb-0">Recent Donations</h4>
                </div>
                <div className="d-flex flex-column gap-3">
                    {donations.length === 0 ? (
                        <Card className="border-0 shadow-sm rounded-4 p-5 text-center text-secondary">
                            <Droplet size={48} className="mx-auto text-muted mb-3" />
                            <p className="mb-0 fs-5 fw-medium">No donations recorded yet.</p>
                            <small className="text-muted">Register for upcoming camps or visit a hospital clinic to start saving lives!</small>
                        </Card>
                    ) : (
                        donations.map((donation) => (
                            <Card key={donation.id} className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                                <Card.Body className="p-4">
                                    <Row className="align-items-center g-3">
                                        <Col xs="auto">
                                            <div className="bg-light p-3 rounded-4">
                                                <Droplet className="text-primary-red" size={24} />
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="d-flex flex-wrap justify-content-between align-items-start mb-2">
                                                <div>
                                                    <h6 className="fw-bold text-dark mb-1 fs-5">
                                                        {new Date(donation.collectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </h6>
                                                    <p className="text-secondary mb-0">{donation.location || 'Central Blood Bank'}</p>
                                                </div>
                                                <span className="text-muted small">ID: {donation.id}</span>
                                            </div>
                                            <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 pt-3 border-top border-light">
                                                <div className="text-secondary">
                                                    <small className="d-block mb-1">Units Collected</small>
                                                    <strong>{donation.units} Unit(s) ({donation.component})</strong>
                                                </div>
                                                <Badge bg={donation.status === 'AVAILABLE' ? 'success' : 'secondary'} className="bg-opacity-10 text-success border border-success border-opacity-20 px-3 py-2 rounded-pill fw-medium">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <CheckCircle2 size={12} />
                                                        Status: {donation.status}
                                                    </div>
                                                </Badge>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
