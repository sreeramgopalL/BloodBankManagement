import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Droplet, ArrowLeft, Activity, CheckCircle } from 'lucide-react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { TopDonorList } from '@/app/components/TopDonorList';
import { showSuccess, showError } from '../utils/swal';

export function DonorRegistration() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bloodGroup: '',
        age: '',
        weight: '',
        address: '',
        medicalConditions: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            showError('Error', 'Passwords do not match!');
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'DONOR'
                })
            });

            if (response.ok) {
                // Also create a donor record in donor-camp-service
                await fetch(`${apiUrl}/api/donors`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        bloodGroup: formData.bloodGroup,
                        city: formData.address,
                        phone: formData.phone,
                        status: 'PENDING',
                        healthStatus: 'Good',
                        available: true,
                        age: parseInt(formData.age) || null,
                        weight: parseFloat(formData.weight) || null,
                        medicalHistory: formData.medicalConditions || ''
                    })
                });

                await showSuccess('Registration Successful', `You can now login with your email and password.`);
                navigate('/login/donor');
            } else {
                showError('Registration Failed', 'Could not register donor. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showError('Error', 'An error occurred during registration.');
        }
    };

    return (
        <div className="bg-light min-vh-100" style={{ paddingTop: '100px', paddingBottom: '48px' }}>
            <Container className="py-4">
                <Row className="g-5">

                    <Col lg={7}>
                        <Card className="border-0 shadow-lg rounded-4 p-4 p-md-5">
                            <div className="text-center mb-5">
                                <div className="bg-primary-red d-inline-flex p-3 rounded-circle shadow-sm mb-4">
                                    <Activity className="text-white" size={32} />
                                </div>
                                <h2 className="fw-bold mb-2">Register as Blood Donor</h2>
                                <p className="text-secondary">Join our community of life-savers</p>
                            </div>

                            <Form onSubmit={handleSubmit}>

                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <h5 className="fw-bold mb-0 text-nowrap">Personal Information</h5>
                                    <hr className="w-100" />
                                </div>

                                <Row className="g-3 mb-4">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Full Name <span className="text-primary-red">*</span></Form.Label>
                                            <Form.Control
                                                size="lg"
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                className="fs-6"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Email <span className="text-primary-red">*</span></Form.Label>
                                            <Form.Control
                                                size="lg"
                                                type="email"
                                                placeholder="your.email@example.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                className="fs-6"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Phone Number <span className="text-primary-red">*</span></Form.Label>
                                            <Form.Control
                                                size="lg"
                                                type="tel"
                                                placeholder="+91 234-567-8900"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                required
                                                className="fs-6"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Blood Group <span className="text-primary-red">*</span></Form.Label>
                                            <Form.Select
                                                size="lg"
                                                value={formData.bloodGroup}
                                                onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                                                required
                                                className="fs-6"
                                            >
                                                <option value="">Select Blood Group</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Age <span className="text-primary-red">*</span></Form.Label>
                                            <Form.Control
                                                size="lg"
                                                type="text"
                                                placeholder="Age (18-65)"
                                                value={formData.age}
                                                onChange={e => setFormData({ ...formData, age: e.target.value })}
                                                required
                                                className="fs-6"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Weight (kg) <span className="text-primary-red">*</span></Form.Label>
                                            <Form.Control
                                                size="lg"
                                                type="text"
                                                placeholder="Minimum 50kg"
                                                value={formData.weight}
                                                onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                                required
                                                className="fs-6"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Address</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                placeholder="Enter your address"
                                                value={formData.address}
                                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                className="fs-6"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Medical Conditions (if any)</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                placeholder="List any medical conditions, medications, or allergies"
                                                value={formData.medicalConditions}
                                                onChange={e => setFormData({ ...formData, medicalConditions: e.target.value })}
                                                className="fs-6"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>


                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <h5 className="fw-bold mb-0 text-nowrap">Account Security</h5>
                                    <hr className="w-100" />
                                </div>

                                <Row className="g-3 mb-5">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Password <span className="text-primary-red">*</span></Form.Label>
                                            <Form.Control
                                                size="lg"
                                                type="password"
                                                placeholder="Min 6 chars"
                                                value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                required
                                                className="fs-6"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="fw-bold small">Confirm Password <span className="text-primary-red">*</span></Form.Label>
                                            <Form.Control
                                                size="lg"
                                                type="password"
                                                placeholder="Re-enter password"
                                                value={formData.confirmPassword}
                                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                required
                                                className="fs-6"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>


                                <Alert
                                    className="rounded-4 p-4"
                                    style={{
                                        backgroundColor: '#FEE2E2',
                                        color: '#B91C1C',
                                        border: '1px solid #FECACA'
                                    }}
                                >
                                    <div className="d-flex align-items-center gap-2 mb-3 fw-bold fs-5">
                                        <CheckCircle size={22} className="text-primary-red" /> Donor Eligibility Criteria
                                    </div>
                                    <Row className="gy-2">
                                        <Col md={6}>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-primary-red rounded-circle" style={{ width: 6, height: 6 }}></div>
                                                <span>Age: 18-65 years</span>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-primary-red rounded-circle" style={{ width: 6, height: 6 }}></div>
                                                <span>Weight: Minimum 50 kg</span>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-primary-red rounded-circle" style={{ width: 6, height: 6 }}></div>
                                                <span>Good general health</span>
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-primary-red rounded-circle" style={{ width: 6, height: 6 }}></div>
                                                <span>3 months gap between donations</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Alert>

                                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mt-5">
                                    <Button variant="primary-red" size="lg" type="submit" className="px-5 w-100 w-sm-auto rounded-3">
                                        Register as Donor
                                    </Button>
                                    <Button variant="link" className="text-secondary text-decoration-none" onClick={() => navigate('/login/donor')}>
                                        Already have an account? <span className="fw-bold text-primary-red">Login</span>
                                    </Button>
                                </div>

                            </Form>
                        </Card>
                    </Col>


                    <Col lg={5}>
                        <div className="sticky-top" style={{ top: '2rem' }}>
                            <TopDonorList />

                            <Card className="border-0 shadow-sm rounded-4 p-4 mt-4">
                                <h5 className="fw-bold mb-3">Why Register?</h5>
                                <ul className="list-unstyled d-flex flex-column gap-3 text-secondary">
                                    <li className="d-flex gap-3">
                                        <div className="bg-primary-red bg-opacity-10 p-1 rounded-circle flex-shrink-0" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Droplet size={14} className="text-primary-red" />
                                        </div>
                                        <small>Save up to three lives with a single donation.</small>
                                    </li>
                                    <li className="d-flex gap-3">
                                        <div className="bg-primary-red bg-opacity-10 p-1 rounded-circle flex-shrink-0" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Droplet size={14} className="text-primary-red" />
                                        </div>
                                        <small>Track your impact and donation history.</small>
                                    </li>
                                    <li className="d-flex gap-3">
                                        <div className="bg-primary-red bg-opacity-10 p-1 rounded-circle flex-shrink-0" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Droplet size={14} className="text-primary-red" />
                                        </div>
                                        <small>Earn badges and recognition in the community.</small>
                                    </li>
                                </ul>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
