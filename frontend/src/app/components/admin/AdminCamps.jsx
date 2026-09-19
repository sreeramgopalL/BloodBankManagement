import { useState } from 'react';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';
import { Card, Button, Badge, Row, Col, Form, Modal } from 'react-bootstrap';

export function AdminCamps({
    camps,
    handleSubmitCamp,
    newCamp,
    setNewCamp,
    handleDeleteCamp,
    handleEditCamp
}) {

    const [selectedCamp, setSelectedCamp] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const handleViewDetails = (camp) => {
        setSelectedCamp(camp);
        setShowDetails(true);
    };

    const getBadgeVariant = (status) => {
        if (status === 'completed') return 'success';
        if (status === 'ongoing') return 'info';
        if (status === 'scheduled') return 'primary';
        return 'secondary';
    };

    return (
        <div className="space-y-6">

            <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
                <h5 className="mb-4">Organize New Camp</h5>
                <Form onSubmit={handleSubmitCamp}>
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Camp Name *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g. Community Drive"
                                    value={newCamp.name}
                                    onChange={e => setNewCamp({ ...newCamp, name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Location *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g. City Center"
                                    value={newCamp.location}
                                    onChange={e => setNewCamp({ ...newCamp, location: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Date *</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={newCamp.date}
                                    onChange={e => setNewCamp({ ...newCamp, date: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Time *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="09:00 AM - 05:00 PM"
                                    value={newCamp.time}
                                    onChange={e => setNewCamp({ ...newCamp, time: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Expected Donors *</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="100"
                                    value={newCamp.expectedDonors}
                                    onChange={e => setNewCamp({ ...newCamp, expectedDonors: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button type="submit" variant="danger" className="mt-4 px-4">Create Camp</Button>
                </Form>
            </Card>

            <Card className="border-0 shadow-sm rounded-4 p-4">
                <h5 className="mb-4">Blood Donation Camps</h5>
                <div className="d-flex flex-column gap-3">
                    {camps.map(camp => (
                        <div key={camp.id} className="border rounded-3 p-3">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <Badge bg={getBadgeVariant(camp.status)}>{camp.status ? camp.status.toUpperCase() : 'UNKNOWN'}</Badge>
                                <small className="text-muted">{camp.id || camp._id}</small>
                            </div>
                            <h5 className="mb-3">{camp.campName || camp.name}</h5>

                            <Row className="g-3 mb-3">
                                <Col xs={6} md={3}>
                                    <div className="d-flex align-items-center gap-2 text-muted">
                                        <MapPin size={16} /> <small>Location</small>
                                    </div>
                                    <span className="d-block text-dark">{camp.location}</span>
                                </Col>
                                <Col xs={6} md={3}>
                                    <div className="d-flex align-items-center gap-2 text-muted">
                                        <Calendar size={16} /> <small>Date</small>
                                    </div>
                                    <span className="d-block text-dark">{camp.campDate || camp.date}</span>
                                </Col>
                                <Col xs={6} md={3}>
                                    <div className="d-flex align-items-center gap-2 text-muted">
                                        <Clock size={16} /> <small>Time</small>
                                    </div>
                                    <span className="d-block text-dark">{camp.campTime || camp.time}</span>
                                </Col>
                                <Col xs={6} md={3}>
                                    <div className="d-flex align-items-center gap-2 text-muted">
                                        <Users size={16} /> <small>Donors</small>
                                    </div>
                                    <span className="d-block text-dark">{camp.actualDonors || 0} / {camp.expectedDonors || 0}</span>
                                </Col>
                            </Row>

                            <div className="d-flex gap-2">
                                <Button variant="light" size="sm" className="border" onClick={() => handleViewDetails(camp)}>View Details</Button>
                                {camp.status === 'scheduled' && (
                                    <>
                                        <Button variant="outline-primary" size="sm" onClick={() => handleEditCamp(camp)}>Edit</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteCamp(camp.id)}>Cancel Drive</Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Modal show={showDetails} onHide={() => setShowDetails(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold text-danger">Donation Camp Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedCamp && (
                        <div className="space-y-4">
                            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-4">
                                <div>
                                    <span className="text-muted d-block small fw-bold">CAMP ID</span>
                                    <strong className="fs-5">{selectedCamp.id || selectedCamp._id}</strong>
                                </div>
                                <div className="text-end">
                                    <Badge bg={getBadgeVariant(selectedCamp.status)} className="px-3 py-2 rounded-pill fs-6 uppercase">
                                        {(selectedCamp.status || 'unknown').toUpperCase()}
                                    </Badge>
                                </div>
                            </div>

                            <Row className="g-4">
                                <Col md={6}>
                                    <div className="p-3 border rounded-4 bg-white h-100">
                                        <h6 className="text-secondary small fw-bold mb-3 uppercase">General Information</h6>
                                        <div className="space-y-2">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Camp Name:</span>
                                                <span className="fw-bold text-dark">{selectedCamp.campName}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Organizer:</span>
                                                <span className="fw-bold text-dark">{selectedCamp.organizer || 'System Admin'}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Location:</span>
                                                <span className="fw-bold text-dark">{selectedCamp.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="p-3 border rounded-4 bg-white h-100">
                                        <h6 className="text-secondary small fw-bold mb-3 uppercase">Schedule & Attendance</h6>
                                        <div className="space-y-2">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Date:</span>
                                                <span className="fw-bold text-dark">{selectedCamp.campDate}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Time:</span>
                                                <span className="fw-bold text-dark">{selectedCamp.campTime || 'N/A'}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Donors Registered:</span>
                                                <span className="fw-bold text-danger">{selectedCamp.actualDonors || 0} / {selectedCamp.expectedDonors || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="danger" onClick={() => setShowDetails(false)} className="px-5 rounded-3">Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
