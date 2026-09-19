import { useState, useEffect } from 'react';
import { Heart, Users, Building2, Calendar, Shield, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Container, Row, Col, Button, Carousel, Card, Navbar, Nav } from 'react-bootstrap';

import logo from '../../assets/logo.jpg';

export function HomePage() {
    const navigate = useNavigate();

    const slides = [
        {
            image: 'https://images.unsplash.com/photo-1615461066159-fea0960485d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9vZCUyMGRvbmF0aW9ufGVufDF8fHx8MTc2OTA2MzExMnww&ixlib=rb-4.1.0&q=80&w=1080',
            title: 'Blood Donation Saves Lives',
            description: 'One donation can save up to three lives. Be a hero today!'
        },
        {
            image: 'https://images.unsplash.com/photo-1710074213379-2a9c2653046a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2FyZSUyMGhvc3BpdGFsfGVufDF8fHx8MTc2OTA2MzExMnww&ixlib=rb-4.1.0&q=80&w=1080',
            title: 'Professional Medical Care',
            description: 'Safe and hygienic blood donation process with trained professionals'
        },
        {
            image: 'https://images.unsplash.com/photo-1706806595208-0e823368f240?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB2b2x1bnRlZXJzfGVufDF8fHx8MTc2ODk5NDI1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
            title: 'Community Blood Donation Camps',
            description: 'Join our regular community camps and make a difference'
        },
        {
            image: 'https://images.unsplash.com/photo-1516841273335-e39b37888115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwdGVhbXxlbnwxfHx8fDE3NjkwNjMxMTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
            title: 'Expert Healthcare Team',
            description: 'Dedicated medical professionals ensuring your safety and comfort'
        }
    ];

    return (
        <div className="bg-light min-h-screen">

            <Navbar bg="white" expand="md" sticky="top" className="shadow-sm py-3">
                <Container fluid="lg">
                    <Navbar.Brand href="#" className="d-flex align-items-center gap-3">
                        <img
                            src={logo}
                            alt="Blood Bank Logo"
                            className="rounded-3 shadow-sm object-fit-cover"
                            style={{ width: '48px', height: '48px' }}
                        />
                        <div className="d-flex flex-column">
                            <span className="h5 mb-0 fw-bold text-dark lh-1">Blood Bank</span>
                            <small className="text-secondary text-uppercase fw-bold" style={{ fontSize: '10px', marginTop: '2px' }}>Management System</small>
                        </div>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            <Nav.Link href="#" className="fw-medium text-secondary hover-primary">Home</Nav.Link>
                            <Nav.Link href="#features" className="fw-medium text-secondary hover-primary">Services</Nav.Link>
                            {/* <Nav.Link href="#why-donate" className="fw-medium text-secondary hover-primary">Why Donate</Nav.Link> */}
                            <Nav.Link href="#contact" className="fw-medium text-secondary hover-primary">Contact</Nav.Link>
                        </Nav>
                        <Button
                            variant="primary-red"
                            className="rounded-pill px-4 fw-medium shadow-sm"
                            onClick={() => navigate('/donor/register')}
                        >
                            Become a Donor
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>


            <section className="py-5 text-center">
                <Container>
                    <div className="d-inline-flex align-items-center gap-2 bg-white text-primary-red px-3 py-2 rounded-pill mb-4 shadow-sm border border-success-subtle">
                        <Heart size={16} className="text-primary-red" />
                        <span className="small fw-bold">Save Lives, Donate Blood</span>
                    </div>
                    <h1 className="display-4 fw-bold text-dark mb-4">
                        Every Drop Counts,<br />Every Donor Matters
                    </h1>
                    <p className="lead text-muted mb-5 mx-auto" style={{ maxWidth: '700px' }}>
                        Join our comprehensive blood bank management system. Whether you're a donor,
                        hospital, or administrator, we make blood donation and distribution seamless and efficient.
                    </p>
                    <div className="d-flex gap-3 justify-content-center">
                        <Button
                            variant="primary-red"
                            size="lg"
                            className="px-4 py-3 d-flex align-items-center gap-2"
                            onClick={() => navigate('/login/donor')}
                        >
                            Get Started <ArrowRight size={20} />
                        </Button>
                        <Button
                            variant="outline-dark"
                            size="lg"
                            className="px-4 py-3 bg-white"
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Learn More
                        </Button>
                    </div>
                </Container>
            </section>


            <section className="bg-primary-red py-5 text-white">
                <Container>
                    <Row className="text-center gy-4">
                        <Col md={3}>
                            <h2 className="fw-bold mb-1">3.5k+</h2>
                            <p className="mb-0 text-primary-red-light fw-medium">Donors</p>
                        </Col>
                        <Col md={3}>
                            <h2 className="fw-bold mb-1">1.2k+</h2>
                            <p className="mb-0 text-primary-red-light fw-medium">Hospitals</p>
                        </Col>
                        <Col md={3}>
                            <h2 className="fw-bold mb-1">850+</h2>
                            <p className="mb-0 text-primary-red-light fw-medium">Camps</p>
                        </Col>
                        <Col md={3}>
                            <h2 className="fw-bold mb-1">15k+</h2>
                            <p className="mb-0 text-primary-red-light fw-medium">Lives Saved</p>
                        </Col>
                    </Row>
                </Container>
            </section>


            <section className="py-5">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-dark">Blood Donation & Camp Gallery</h2>
                        <p className="text-muted fs-5">See our impact in the community</p>
                    </div>

                    <Carousel className="rounded-4 overflow-hidden shadow-lg">
                        {slides.map((slide, index) => (
                            <Carousel.Item key={index} interval={5000} className="h-100">
                                <div style={{ height: '500px', position: 'relative' }}>
                                    <img
                                        className="d-block w-100 h-100 object-fit-cover"
                                        src={slide.image}
                                        alt={slide.title}
                                        style={{ objectFit: 'cover' }}
                                    />
                                    <div className="carousel-caption d-none d-md-block text-start p-5 w-100 start-0 bottom-0 bg-gradient-to-t" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                                        <h3 className="display-5 fw-bold">{slide.title}</h3>
                                        <p className="fs-5">{slide.description}</p>
                                    </div>
                                </div>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Container>
            </section>


            <section id="features" className="py-5 bg-white">
                <Container>
                    <Row className="gy-4 justify-content-center">

                        <Col lg={5} md={6}>
                            <Card className="h-100 border shadow-sm rounded-3 p-4 bg-white">
                                <Card.Body className="p-3">

                                    <div
                                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            backgroundColor: '#dbeafe'
                                        }}
                                    >
                                        <Building2 style={{ color: '#2563eb' }} size={28} />
                                    </div>


                                    <Card.Title as="h5" className="fw-bold mb-3 text-dark">For Hospitals</Card.Title>


                                    <ul className="list-unstyled mb-4 text-secondary" style={{ fontSize: '15px' }}>
                                        <li className="mb-2 d-flex align-items-start gap-2">
                                            <span className="rounded-circle mt-1" style={{ width: 6, height: 6, backgroundColor: '#2563eb', flexShrink: 0 }}></span>
                                            <span>Search blood availability</span>
                                        </li>
                                        <li className="mb-2 d-flex align-items-start gap-2">
                                            <span className="rounded-circle mt-1" style={{ width: 6, height: 6, backgroundColor: '#2563eb', flexShrink: 0 }}></span>
                                            <span>Request blood units</span>
                                        </li>
                                        <li className="mb-2 d-flex align-items-start gap-2">
                                            <span className="rounded-circle mt-1" style={{ width: 6, height: 6, backgroundColor: '#2563eb', flexShrink: 0 }}></span>
                                            <span>Track request status</span>
                                        </li>
                                        <li className="mb-2 d-flex align-items-start gap-2">
                                            <span className="rounded-circle mt-1" style={{ width: 6, height: 6, backgroundColor: '#2563eb', flexShrink: 0 }}></span>
                                            <span>Emergency blood requests</span>
                                        </li>
                                    </ul>


                                    <Button
                                        className="w-100 py-2 rounded-3 fw-semibold border-0"
                                        style={{
                                            backgroundColor: '#2563eb',
                                            color: 'white'
                                        }}
                                        onClick={() => navigate('/login/hospital')}
                                    >
                                        Hospital Access
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>


                        <Col lg={5} md={6}>
                            <Card className="h-100 border shadow-sm rounded-3 p-4 bg-white">
                                <Card.Body className="p-3">

                                    <div
                                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            backgroundColor: '#f3e8ff'
                                        }}
                                    >
                                        <Shield style={{ color: '#9333ea' }} size={28} />
                                    </div>


                                    <Card.Title as="h5" className="fw-bold mb-3 text-dark">For Admins</Card.Title>


                                    <ul className="list-unstyled mb-4 text-secondary" style={{ fontSize: '15px' }}>
                                        <li className="mb-2 d-flex align-items-start gap-2">
                                            <span className="rounded-circle mt-1" style={{ width: 6, height: 6, backgroundColor: '#9333ea', flexShrink: 0 }}></span>
                                            <span>Manage blood inventory</span>
                                        </li>
                                        <li className="mb-2 d-flex align-items-start gap-2">
                                            <span className="rounded-circle mt-1" style={{ width: 6, height: 6, backgroundColor: '#9333ea', flexShrink: 0 }}></span>
                                            <span>Organize donation camps</span>
                                        </li>
                                        <li className="mb-2 d-flex align-items-start gap-2">
                                            <span className="rounded-circle mt-1" style={{ width: 6, height: 6, backgroundColor: '#9333ea', flexShrink: 0 }}></span>
                                            <span>Verify donor health status</span>
                                        </li>
                                        <li className="mb-2 d-flex align-items-start gap-2">
                                            <span className="rounded-circle mt-1" style={{ width: 6, height: 6, backgroundColor: '#9333ea', flexShrink: 0 }}></span>
                                            <span>Generate reports</span>
                                        </li>
                                    </ul>


                                    <Button
                                        className="w-100 py-2 rounded-3 fw-semibold border-0"
                                        style={{
                                            backgroundColor: '#9333ea',
                                            color: 'white'
                                        }}
                                        onClick={() => navigate('/login/admin')}
                                    >
                                        Admin Login
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>



        </div>
    );
}
