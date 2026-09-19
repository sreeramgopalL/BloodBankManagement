import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import bgImage from '../../../assets/blood4.jpg';

export function DonorLogin() {
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

        const email = formData.email || 'john.smith@donor.com';
        const password = formData.password || 'donor@123';

        try {
            const success = await login(email, password, 'donor');
            if (success) {
                navigate('/dashboard');
            } else {
                setError('Invalid donor credentials.');
            }
        } catch (err) {
            console.error('Donor login error:', err);
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
            {/* Red overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(180, 0, 0, 0.55)',
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
                                    <User className="text-white" size={48} />
                                </div>
                                <div>
                                    <h1 className="display-5 fw-bold mb-0 text-white">Donor Login</h1>
                                    <p className="lead mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>Access your donor dashboard</p>
                                </div>
                            </div>
                            <p className="fs-5 mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>
                                Check your eligibility, schedule appointments, and track your impact.
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
                                            <Form.Label className="text-secondary small fw-bold">Email Address (Optional)</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="john.smith@donor.com"
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
                                            {loading ? 'Entering...' : 'Sign In as Donor'}
                                        </Button>
                                    </Form>
                                    <div className="mt-3 text-center">
                                        <span className="text-muted small">New donor? </span>
                                        <Button variant="link" className="text-primary-red p-0 small fw-bold" onClick={() => navigate('/donor/register')}>Register Now</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}
