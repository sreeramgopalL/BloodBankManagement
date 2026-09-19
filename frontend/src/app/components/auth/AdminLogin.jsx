import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import bgImage from '../../../assets/admin_bg.png';

export function AdminLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const email = formData.email || 'admin@bloodbank.org';
        const password = formData.password || 'admin@123';

        try {
            const success = await login(email, password, 'admin');
            if (success) {
                navigate('/dashboard');
            } else {
                setError('Invalid admin credentials.');
            }
        } catch (err) {
            console.error('Admin login error:', err);
            setError(err?.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
            }}
        >
            {/* Dark red overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(120, 0, 0, 0.60)',
                    zIndex: 0,
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                }}
            >
                <Container style={{ maxWidth: '1100px' }}>
                    <Button
                        variant="link"
                        className="text-decoration-none d-flex align-items-center gap-2 mb-4 p-0"
                        style={{ color: 'rgba(255,255,255,0.85)' }}
                        onClick={() => navigate('/')}
                    >
                        <ArrowLeft size={16} /> Back to Home
                    </Button>

                    <Row className="align-items-center g-5">
                        <Col lg={6} className="text-center text-lg-start">
                            <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3 mb-4">
                                <div className="bg-primary-red p-3 rounded-4 shadow-sm">
                                    <Shield className="text-white" size={48} />
                                </div>
                                <div>
                                    <h1 className="display-5 fw-bold mb-0 text-white">Admin Login</h1>
                                    <p className="lead mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>System management console</p>
                                </div>
                            </div>
                            <p className="fs-5 mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>
                                Manage blood inventory, donation camps, and system users.
                            </p>
                        </Col>

                        <Col lg={6}>
                            <Card className="border-0 shadow-lg-custom rounded-2xl-custom p-4">
                                <Card.Body>
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <LogIn className="text-primary-red" size={32} />
                                        <h2 className="mb-0 fw-bold">Sign In</h2>
                                    </div>

                                    {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="text-secondary small fw-bold">Admin Email (Optional)</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="admin@bloodbank.org"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="py-3 px-3 shadow-none border-secondary-subtle rounded-3"
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label className="text-secondary small fw-bold">Password (Optional)</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="py-3 px-3 shadow-none border-secondary-subtle rounded-3"
                                            />
                                        </Form.Group>

                                        <Button
                                            variant="primary-red"
                                            type="submit"
                                            className="w-100 py-3 fw-medium rounded-3"
                                            disabled={loading}
                                        >
                                            {loading ? 'Entering...' : 'Sign In as Admin'}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}
