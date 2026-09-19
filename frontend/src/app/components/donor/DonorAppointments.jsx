import { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, User } from 'lucide-react';
import { Card, Button, Form, Row, Col, Alert, Badge } from 'react-bootstrap';
import Swal, { showSuccess, showConfirm, showToast } from '../../utils/swal';

export function DonorAppointments() {
    const [formData, setFormData] = useState({
        location: 'Central Blood Bank',
        donationType: 'Whole Blood',
        date: '',
        time: '09:00 AM - 10:00 AM'
    });

    const [appointments, setAppointments] = useState([
        {
            id: 'APT001',
            status: 'CONFIRMED',
            variant: 'success',
            date: '2024-12-20',
            time: '10:00 AM',
            location: 'Central Blood Bank',
            type: 'Blood Donation'
        },
        {
            id: 'APT002',
            status: 'PENDING',
            variant: 'warning',
            date: '2024-12-28',
            time: '02:00 PM',
            location: 'City Hospital Camp',
            type: 'Blood Donation Camp'
        }
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newApt = {
            id: `APT${Math.floor(100 + Math.random() * 900)}`,
            status: 'PENDING',
            variant: 'warning',
            date: formData.date || 'TBD',
            time: formData.time.split(' - ')[0],
            location: formData.location,
            type: formData.donationType
        };
        setAppointments([newApt, ...appointments]);
        showToast('Appointment booked successfully!');
    };

    const handleReschedule = async (id) => {
        const { value: newDate } = await Swal.fire({
            title: 'Reschedule Appointment',
            input: 'date',
            inputLabel: 'Select new date',
            inputValue: new Date().toISOString().split('T')[0],
            showCancelButton: true,
            confirmButtonColor: '#d33',
        });

        if (newDate) {
            setAppointments(prev => prev.map(apt =>
                apt.id === id ? { ...apt, date: newDate, status: 'RESCHEDULED', variant: 'info' } : apt
            ));
            showToast('Appointment rescheduled!');
        }
    };

    const handleCancel = async (id) => {
        const result = await showConfirm('Cancel Appointment', 'Are you sure you want to cancel this appointment?');
        if (result.isConfirmed) {
            setAppointments(prev => prev.filter(apt => apt.id !== id));
            showToast('Appointment cancelled.');
        }
    };

    return (
        <div className="space-y-6">

            <Alert variant="success" className="d-flex align-items-start gap-3">
                <CheckCircle className="flex-shrink-0 mt-1" size={24} />
                <div>
                    <Alert.Heading className="fs-6 fw-bold">You're Eligible to Donate!</Alert.Heading>
                    <p className="mb-0 small">It's been more than 3 months since your last donation. Book an appointment below.</p>
                </div>
            </Alert>


            <Card className="border-0 shadow-sm rounded-4 mb-5">
                <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4">Book New Appointment</h5>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-4">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Location</Form.Label>
                                    <Form.Select
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    >
                                        <option>Central Blood Bank</option>
                                        <option>City Hospital</option>
                                        <option>Community Camp</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Donation Type</Form.Label>
                                    <Form.Select
                                        value={formData.donationType}
                                        onChange={e => setFormData({ ...formData, donationType: e.target.value })}
                                    >
                                        <option>Whole Blood</option>
                                        <option>Platelets</option>
                                        <option>Plasma</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Preferred Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Preferred Time</Form.Label>
                                    <Form.Select
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    >
                                        <option>09:00 AM - 10:00 AM</option>
                                        <option>10:00 AM - 11:00 AM</option>
                                        <option>11:00 AM - 12:00 PM</option>
                                        <option>02:00 PM - 03:00 PM</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="mt-4">
                            <Button variant="danger" type="submit">Book Appointment</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>


            <h5 className="fw-bold mb-4">Your Appointments</h5>
            <div className="d-flex flex-column gap-3">
                {appointments.map(apt => (
                    <Card key={apt.id} className="border shadow-sm rounded-4">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center gap-2">
                                    <Badge bg={apt.variant}>{apt.status}</Badge>
                                    <small className="text-muted">ID: {apt.id}</small>
                                </div>
                            </div>

                            <Row className="g-3 mb-4">
                                <Col md={6}>
                                    <div className="d-flex align-items-center gap-2 text-secondary">
                                        <Calendar size={16} /> {apt.date}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center gap-2 text-secondary">
                                        <Clock size={16} /> {apt.time}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center gap-2 text-secondary">
                                        <MapPin size={16} /> {apt.location}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center gap-2 text-secondary">
                                        <User size={16} /> {apt.type}
                                    </div>
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-end gap-2 text-secondary">
                                <Button variant="light" size="sm" onClick={() => handleReschedule(apt.id)}>Reschedule</Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleCancel(apt.id)}>Cancel</Button>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
}
