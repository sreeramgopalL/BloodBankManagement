import { Container, Row, Col } from 'react-bootstrap';
import { Droplet, Facebook, Twitter, Youtube, Instagram } from 'lucide-react';
import logo from '../../assets/logo.jpg';

export function Footer() {
    return (
        <footer className="text-white py-4" style={{ backgroundColor: '#0f0f0f' }}>
            <Container>
                <Row className="gy-4 mb-4">
                    <Col lg={3} md={6}>
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <img
                                src={logo}
                                alt="Blood Bank Logo"
                                className="rounded-3"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div>
                                <h5 className="mb-0 fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '16px' }}>Blood Bank</h5>
                                <small className="text-secondary" style={{ fontSize: '10px' }}>MANAGEMENT SYSTEM</small>
                            </div>
                        </div>
                    </Col>
                    <Col lg={3} md={6}>
                        <h6 className="fw-bold mb-4 text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '2px' }}>Quick Links</h6>
                        <ul className="list-unstyled text-secondary small">
                            <li className="mb-3"><a href="#" className="text-white text-decoration-none hover-opacity-75">About Us</a></li>
                            <li className="mb-3"><a href="#" className="text-white text-decoration-none hover-opacity-75">Contact</a></li>
                            <li className="mb-3"><a href="#" className="text-white text-decoration-none hover-opacity-75">FAQs</a></li>
                        </ul>
                    </Col>
                    <Col lg={3} md={6}>
                        <h6 className="fw-bold mb-4 text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '2px' }}>Services</h6>
                        <ul className="list-unstyled text-secondary small">
                            <li className="mb-3"><a href="#" className="text-white text-decoration-none hover-opacity-75">Donate Blood</a></li>
                            <li className="mb-3"><a href="#" className="text-white text-decoration-none hover-opacity-75">Request Blood</a></li>
                            <li className="mb-3"><a href="#" className="text-white text-decoration-none hover-opacity-75">Health Tips</a></li>
                        </ul>
                    </Col>
                    <Col lg={3} md={6}>
                        <h6 className="fw-bold mb-4 text-uppercase text-secondary" style={{ fontSize: '11px', letterSpacing: '2px' }}>Contact</h6>
                        <ul className="list-unstyled text-secondary small">
                            <li className="mb-3 text-white">Emergency: 911</li>
                            <li className="mb-3 text-white">Phone: +1 234 567 8900</li>
                            <li className="mb-3 text-white">Email: info@bloodbank.org</li>
                        </ul>
                    </Col>
                </Row>

                <div className="border-top border-secondary opacity-10 mb-4"></div>

                <div className="d-flex flex-column align-items-center gap-3">
                    <div className="d-flex gap-3">
                        {[Facebook, Twitter, Youtube, Instagram].map((Icon, i) => (
                            <a key={i} href="#" className="text-white text-decoration-none" style={{ transition: 'opacity 0.2s' }}>
                                <div className="rounded-circle border border-secondary d-flex align-items-center justify-content-center hover-border-white text-secondary hover-text-white" style={{ width: '36px', height: '36px' }}>
                                    <Icon size={16} />
                                </div>
                            </a>
                        ))}
                    </div>
                    <div className="text-center">
                        <p className="mb-0 text-secondary" style={{ fontSize: '11px' }}>&copy; Copyright. All rights reserved.</p>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
