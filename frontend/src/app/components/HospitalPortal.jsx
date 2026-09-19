import { useState, useMemo } from 'react';
import {
    Search,
    Droplet,
    MapPin,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    Phone,
    Mail,
    FileText,
    Plus,
    Filter
} from 'lucide-react';
import { Container, Row, Col, Card, Button, Badge, Form, Nav, Alert, InputGroup } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Modal } from 'react-bootstrap';
import { showSuccess, showConfirm } from '../utils/swal';

export function HospitalPortal() {
    const [activeTab, setActiveTab] = useState('search');
    const { user, logout } = useAuth();
    const { inventory, hospitalRequests, addRequest, cancelRequest } = useData();
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const [searchFilters, setSearchFilters] = useState({
        bloodGroup: '',
        location: '',
        minUnits: ''
    });

    const [newRequest, setNewRequest] = useState({
        bloodGroup: '',
        units: '',
        component: 'RBC',
        urgency: 'normal',
        patientName: '',
        patientAge: '',
        reason: '',
        requiredBy: '',
        location: ''
    });

    // Filtering logic
    const filteredInventory = inventory.filter(item => {
        const matchesGroup = !searchFilters.bloodGroup || item.bloodGroup === searchFilters.bloodGroup;
        const matchesLocation = !searchFilters.location || (item.location && item.location.toLowerCase().includes(searchFilters.location.toLowerCase()));
        const matchesUnits = !searchFilters.minUnits || item.units >= parseInt(searchFilters.minUnits);
        return matchesGroup && matchesLocation && matchesUnits;
    });

    const aggregatedInventory = useMemo(() => {
        const totals = {};
        filteredInventory.forEach(item => {
            const bg = item.bloodGroup;
            if (!totals[bg]) totals[bg] = { name: bg, units: 0 };
            totals[bg].units += (item.units || item.available || 0);
        });
        return Object.values(totals).sort((a, b) => b.units - a.units);
    }, [filteredInventory]);

    const myRequests = hospitalRequests.filter(req => {
        const isMyHospital = (req.hospitalId === user?.id || req.hospitalId === user?.email) ||
            (req.hospitalName === user?.hospitalName);
        const isNotCancelled = req.status?.toUpperCase() !== 'CANCELLED';
        return isMyHospital && isNotCancelled;
    });

    const handleSubmitRequest = (e) => {
        e.preventDefault();
        const requestData = {
            hospitalId: user?.id || user?.email || 'hospital@city.com',
            hospitalName: user?.hospitalName || 'City Hospital',
            bloodGroup: newRequest.bloodGroup,
            units: parseInt(newRequest.units),
            component: newRequest.component,
            urgency: newRequest.urgency,
            patientName: newRequest.patientName,
            patientAge: parseInt(newRequest.patientAge),
            reason: newRequest.reason,
            requiredBy: newRequest.requiredBy,
            location: newRequest.location,
            status: 'PENDING'
        };

        addRequest(requestData);
        showSuccess('Success', `Blood request submitted successfully!`);

        // Reset form
        setNewRequest({
            bloodGroup: '',
            units: '',
            component: 'RBC',
            urgency: 'normal',
            patientName: '',
            patientAge: '',
            reason: '',
            requiredBy: '',
            location: ''
        });

        // Switch to requests tab
        setActiveTab('requests');
    };

    const getAvailabilityVariant = (available) => {
        if (available >= 30) return { text: 'success', border: 'success' };
        if (available >= 15) return { text: 'warning', border: 'warning' };
        return { text: 'danger', border: 'danger' };
    };

    const getUrgencyVariant = (urgency) => {
        if (urgency === 'critical') return 'danger';
        if (urgency === 'high') return 'warning';
        return 'primary';
    };

    const getStatusVariant = (status) => {
        const s = status?.toUpperCase();
        if (s === 'FULFILLED' || s === 'COMPLETED') return 'success';
        if (s === 'APPROVED') return 'primary';
        if (s === 'REJECTED' || s === 'CANCELLED') return 'danger';
        return 'warning';
    };

    return (
        <Container className="py-4">
            <div className="border-bottom mb-4">
                <Nav variant="underline" className="gap-1">
                    {[
                        { id: 'search', icon: Search, label: 'Search Inventory' },
                        { id: 'requests', icon: FileText, label: 'My Requests' },
                        { id: 'new-request', icon: Plus, label: 'New Request' }
                    ].map(tab => (
                        <Nav.Item key={tab.id}>
                            <Nav.Link
                                active={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`d-flex align-items-center gap-2 py-3 px-4 position-relative ${activeTab === tab.id ? 'text-primary-red fw-semibold' : 'text-secondary'}`}
                                style={{
                                    marginBottom: '-1px',
                                    border: 'none',
                                    borderBottom: activeTab === tab.id ? '2px solid #dc2626' : '2px solid transparent',
                                    backgroundColor: 'transparent',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    if (activeTab !== tab.id) {
                                        e.currentTarget.style.borderBottom = '2px solid #fca5a5';
                                        e.currentTarget.style.backgroundColor = '#fef2f2';
                                        e.currentTarget.style.color = '#dc2626';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeTab !== tab.id) {
                                        e.currentTarget.style.borderBottom = '2px solid transparent';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#6c757d';
                                    }
                                }}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>
            </div>


            {activeTab === 'search' && (
                <div className="space-y-6">

                    <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <Filter size={20} className="text-secondary" />
                            <h5 className="fw-bold mb-0">Search Filters</h5>
                        </div>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Label>Blood Group</Form.Label>
                                <Form.Select
                                    value={searchFilters.bloodGroup}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, bloodGroup: e.target.value })}
                                >
                                    <option value="">All Blood Groups</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </Form.Select>
                            </Col>
                            <Col md={4}>
                                <Form.Label>Location</Form.Label>
                                <Form.Select
                                    value={searchFilters.location}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
                                >
                                    <option value="">All Locations</option>
                                    <option value="central">Central Blood Bank</option>
                                    <option value="north">North Regional Center</option>
                                    <option value="south">South Regional Center</option>
                                </Form.Select>
                            </Col>
                            <Col md={4}>
                                <Form.Label>Minimum Units</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="e.g., 10"
                                    value={searchFilters.minUnits}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, minUnits: e.target.value })}
                                />
                            </Col>
                        </Row>
                    </Card>


                    <Row className="mb-5">
                        <Col xs={12}>
                            {aggregatedInventory.length > 0 ? (
                                <Card className="border-0 shadow-sm rounded-4 p-4">
                                    <div style={{ height: `${Math.max(300, aggregatedInventory.length * 50)}px`, width: '100%' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={aggregatedInventory}
                                                layout="vertical"
                                                margin={{ top: 20, right: 80, left: 20, bottom: 5 }}
                                            >
                                                <XAxis 
                                                    type="number" 
                                                    axisLine={{ stroke: '#e5e7eb' }} 
                                                    tickLine={{ stroke: '#e5e7eb' }} 
                                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                                />
                                                <YAxis 
                                                    dataKey="name" 
                                                    type="category" 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fill: '#1f2937', fontSize: 14, fontWeight: 500 }} 
                                                />
                                                <Tooltip 
                                                    cursor={{ fill: '#f3f4f6' }}
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                    formatter={(value) => [`${value} units`, 'Available Stock']}
                                                />
                                                <Bar 
                                                    dataKey="units" 
                                                    fill="#dc2626" 
                                                    radius={[0, 4, 4, 0]} 
                                                    barSize={24}
                                                    onClick={(data) => {
                                                        setNewRequest({ ...newRequest, bloodGroup: data.name, component: 'RBC' });
                                                        setActiveTab('new-request');
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <LabelList 
                                                        dataKey="units" 
                                                        position="right" 
                                                        formatter={(val) => `${val} units`} 
                                                        style={{ fill: '#dc2626', fontSize: 14, fontWeight: 600 }}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="text-center mt-3 text-muted small">
                                        * Click on any bar to initiate a request for that blood group.
                                    </div>
                                </Card>
                            ) : (
                                <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
                                    <AlertCircle size={48} className="text-muted mb-3" />
                                    <h5 className="text-secondary">No matching blood units found</h5>
                                    <p className="text-muted">Try adjusting your filters or expanding your search</p>
                                </div>
                            )}
                        </Col>
                    </Row>


                    <Alert
                        className="d-flex flex-column rounded-4 p-4 transition-all hover-shadow"
                        style={{
                            backgroundColor: '#eff6ff',
                            color: '#1e40af',
                            border: '1px solid #bfdbfe'
                        }}
                    >
                        <h5 className="fw-bold mb-3" style={{ color: '#2563eb' }}>Emergency Contact</h5>
                        <Row>
                            <Col md={6} className="d-flex align-items-center gap-3">
                                <Phone className="text-primary" size={20} />
                                <div>
                                    <small className="text-primary d-block opacity-75">Emergency Hotline</small>
                                    <strong className="text-primary">1-800-BLOOD-911</strong>
                                </div>
                            </Col>
                            <Col md={6} className="d-flex align-items-center gap-3">
                                <Mail className="text-primary" size={20} />
                                <div>
                                    <small className="text-primary d-block opacity-75">Email</small>
                                    <strong className="text-primary">emergency@bloodbank.org</strong>
                                </div>
                            </Col>
                        </Row>
                    </Alert>
                </div>
            )}


            {activeTab === 'requests' && (
                <div>
                    <h5 className="fw-bold mb-4">Blood Requests</h5>
                    <div className="d-flex flex-column gap-3">
                        {myRequests.length > 0 ? (
                            myRequests.map(request => (
                                <Card key={request.id} className="border rounded-3 p-4 bg-white">

                                    <div className="mb-3">
                                        <div className="d-flex gap-2 mb-2">
                                            <Badge
                                                bg={getUrgencyVariant(request.urgency)}
                                                className="px-2 py-1 rounded-2 text-uppercase fw-normal"
                                                style={{ fontSize: '11px' }}
                                            >
                                                {request.urgency}
                                            </Badge>
                                            <Badge
                                                bg={getStatusVariant(request.status)}
                                                className="px-2 py-1 rounded-2 text-uppercase fw-normal"
                                                style={{ fontSize: '11px' }}
                                            >
                                                {request.status}
                                            </Badge>
                                        </div>
                                        <div className="text-muted" style={{ fontSize: '13px' }}>
                                            Request ID: {request.id}
                                        </div>
                                    </div>


                                    <Row className="g-4 mb-3">
                                        <Col xs={6} md={3}>
                                            <div className="d-flex align-items-center gap-2">
                                                <Droplet size={16} className="text-primary-red" />
                                                <div>
                                                    <small className="text-muted d-block" style={{ fontSize: '12px' }}>Blood Group</small>
                                                    <strong className="text-dark">{request.bloodGroup}</strong>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <div className="d-flex align-items-center gap-2">
                                                <FileText size={16} className="text-muted" />
                                                <div>
                                                    <small className="text-muted d-block" style={{ fontSize: '12px' }}>Units</small>
                                                    <strong className="text-dark">{request.unitsNeeded || request.units} units {request.component ? `(${request.component})` : ''}</strong>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <div className="d-flex align-items-center gap-2">
                                                <Calendar size={16} className="text-muted" />
                                                <div>
                                                    <small className="text-muted d-block" style={{ fontSize: '12px' }}>Request Date</small>
                                                    <strong className="text-dark">{request.requestDate}</strong>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <div className="d-flex align-items-center gap-2">
                                                <MapPin size={16} className="text-muted" />
                                                <div>
                                                    <small className="text-muted d-block" style={{ fontSize: '12px' }}>Hospital</small>
                                                    <strong className="text-dark">{request.hospitalName || user?.hospitalName || 'City Hospital'}</strong>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>


                                    <div className="d-flex gap-2 pt-3 border-top">
                                        <Button
                                            variant="light"
                                            size="sm"
                                            className="px-3 py-2 rounded-2 border"
                                            style={{ fontSize: '13px' }}
                                            onClick={() => {
                                                setSelectedRequest(request);
                                                setShowDetailsModal(true);
                                            }}
                                        >
                                            View Details
                                        </Button>
                                        {request.status?.toUpperCase() === 'PENDING' && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="px-3 py-2 rounded-2"
                                                style={{ fontSize: '13px' }}
                                                onClick={async () => {
                                                    const result = await showConfirm('Cancel Request', `Are you sure you want to cancel request ${request.id}?`);
                                                    if (result.isConfirmed) {
                                                        await cancelRequest(request.id);
                                                        showSuccess('Cancelled', 'Request cancelled successfully.');
                                                    }
                                                }}
                                            >
                                                Cancel Request
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className="border rounded-3 p-5 bg-white">
                                <div className="text-center">
                                    <FileText size={48} className="text-muted mb-3 opacity-25" />
                                    <h5 className="text-secondary">No requests found</h5>
                                    <p className="text-muted">You haven't submitted any blood requests yet.</p>
                                    <Button variant="primary-red" onClick={() => setActiveTab('new-request')} className="mt-2">Create New Request</Button>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            )}


            {activeTab === 'new-request' && (
                <Card className="border-0 shadow-sm rounded-4 p-4">
                    <h5 className="fw-bold mb-4">Submit Blood Request</h5>
                    <Form onSubmit={handleSubmitRequest}>
                        <Row className="g-4">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Blood Group <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        value={newRequest.bloodGroup}
                                        onChange={e => setNewRequest({ ...newRequest, bloodGroup: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Blood Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Component <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        value={newRequest.component}
                                        onChange={e => setNewRequest({ ...newRequest, component: e.target.value })}
                                        required
                                    >
                                        <option value="RBC">RBC (Packed Red Cells)</option>
                                        <option value="Plasma">Plasma (FFP)</option>
                                        <option value="Platelets">Platelets</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Units Required <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        placeholder="e.g., 2"
                                        value={newRequest.units}
                                        onChange={e => setNewRequest({ ...newRequest, units: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Urgency <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        value={newRequest.urgency}
                                        onChange={e => setNewRequest({ ...newRequest, urgency: e.target.value })}
                                        required
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Required By <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={newRequest.requiredBy}
                                        onChange={e => setNewRequest({ ...newRequest, requiredBy: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Preferred Location</Form.Label>
                                    <Form.Select
                                        value={newRequest.location}
                                        onChange={e => setNewRequest({ ...newRequest, location: e.target.value })}
                                    >
                                        <option value="">Any Location</option>
                                        <option value="central">Central Blood Bank</option>
                                        <option value="north">North Regional Center</option>
                                        <option value="south">South Regional Center</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Patient Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter patient name"
                                        value={newRequest.patientName}
                                        onChange={e => setNewRequest({ ...newRequest, patientName: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Patient Age <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter patient age"
                                        value={newRequest.patientAge}
                                        onChange={e => setNewRequest({ ...newRequest, patientAge: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group>
                                    <Form.Label>Reason for Request <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Describe the medical reason for the blood request"
                                        value={newRequest.reason}
                                        onChange={e => setNewRequest({ ...newRequest, reason: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Alert variant="warning" className="d-flex align-items-center gap-3 mt-4">
                            <AlertCircle size={20} className="flex-shrink-0" />
                            <small className="mb-0">Please ensure all information is accurate. For critical/emergency requests, please also call our emergency hotline at 1-800-BLOOD-911.</small>
                        </Alert>

                        <div className="d-flex gap-3 mt-4">
                            <Button variant="primary-red" size="lg" type="submit" className="px-5">Submit Request</Button>
                            <Button variant="secondary" size="lg" type="button" onClick={() => setNewRequest({
                                bloodGroup: '', units: '', component: 'RBC', urgency: 'normal', patientName: '', patientAge: '', reason: '', requiredBy: '', location: ''
                            })}>Reset Form</Button>
                        </div>
                    </Form>
                </Card>
            )}

            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">Request Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedRequest && (
                        <div className="space-y-4">
                            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-4">
                                <div>
                                    <span className="text-muted d-block small fw-bold">REQUEST ID</span>
                                    <strong className="fs-5">{selectedRequest.id}</strong>
                                </div>
                                <div className="text-end">
                                    <Badge bg={getStatusVariant(selectedRequest.status)} className="px-3 py-2 rounded-pill fs-6 uppercase">
                                        {selectedRequest.status}
                                    </Badge>
                                </div>
                            </div>

                            <Row className="g-4">
                                <Col md={6}>
                                    <div className="p-3 border rounded-4">
                                        <h6 className="text-secondary small fw-bold mb-3 uppercase">Patient Information</h6>
                                        <div className="space-y-2">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Name:</span>
                                                <span className="fw-bold">{selectedRequest.patientName}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Age:</span>
                                                <span className="fw-bold">{selectedRequest.patientAge} years</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="p-3 border rounded-4">
                                        <h6 className="text-secondary small fw-bold mb-3 uppercase">Blood Details</h6>
                                        <div className="space-y-2">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Group:</span>
                                                <span className="fw-bold text-danger">{selectedRequest.bloodGroup}</span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Required Units:</span>
                                                <span className="fw-bold">{selectedRequest.unitsNeeded || selectedRequest.units} units {selectedRequest.component ? `(${selectedRequest.component})` : ''}</span>
                                            </div>
                                            {selectedRequest.location && (
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-muted">Location:</span>
                                                    <span className="fw-bold">{selectedRequest.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className="p-3 border rounded-4">
                                        <h6 className="text-secondary small fw-bold mb-3 uppercase">Medical Context</h6>
                                        <p className="mb-0 text-dark p-2 bg-light rounded-3">{selectedRequest.reason || 'No specific reason provided.'}</p>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="primary-red" onClick={() => setShowDetailsModal(false)} className="px-5 rounded-3">Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
