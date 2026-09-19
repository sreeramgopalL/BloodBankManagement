import { useState } from 'react';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    FlaskConical,
    FileText
} from 'lucide-react';
import { Row, Col, Card, Button, Badge, Modal, Form } from 'react-bootstrap';

export function AdminTesting({
    bloodTests,
    handleUpdateTestResult,
    handleApproveBloodBag,
    handleDiscardBloodBag,
}) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBagId, setSelectedBagId] = useState(null);
    const [formData, setFormData] = useState({
        hiv: false,
        hbv: false,
        hcv: false,
        syphilis: false,
        malaria: false
    });

    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);

    const getBadgeVariant = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'completed' || s === 'negative' || s === 'safe' || s === 'passed' || s === 'approved') return 'success';
        if (s === 'testing' || s === 'pending') return 'warning';
        if (s === 'positive' || s === 'unsafe' || s === 'failed') return 'danger';
        return 'secondary';
    };

    const getStatusText = (status) => {
        const s = (status || 'PENDING').toUpperCase();
        if (s === 'PASSED' || s === 'APPROVED') return 'SAFE';
        if (s === 'FAILED') return 'UNSAFE';
        return s;
    };

    const handleOpenEdit = (test) => {
        setSelectedBagId(test.bloodBagId);
        setFormData({
            hiv: test.hiv || false,
            hbv: test.hbv || false,
            hcv: test.hcv || false,
            syphilis: test.syphilis || false,
            malaria: test.malaria || false
        });
        setShowEditModal(true);
    };

    const handleSaveResults = () => {
        handleUpdateTestResult(selectedBagId, formData);
        setShowEditModal(false);
    };

    const handleOpenReport = (test) => {
        setSelectedTest(test);
        setShowReportModal(true);
    };

    const uniqueBloodTests = [];
    const seenBagIds = new Set();
    for (const test of (bloodTests || [])) {
        if (test.bloodBagId && !seenBagIds.has(test.bloodBagId)) {
            seenBagIds.add(test.bloodBagId);
            uniqueBloodTests.push(test);
        }
    }

    return (
        <div className="space-y-6">
            <Card className="border-0 shadow-sm rounded-4 p-4">
                <h5 className="fw-bold mb-4">Blood Testing & Quality Control</h5>
                <div className="d-flex flex-column gap-4">
                    {uniqueBloodTests.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <FlaskConical className="mb-2" size={32} />
                            <p className="mb-0">No blood units pending testing.</p>
                        </div>
                    ) : (
                        uniqueBloodTests.map((test) => {
                            const isSafe = test.result === 'PASSED' || test.testStatus === 'SAFE' || test.testStatus === 'APPROVED';
                            const isSafetyChecked = test.testStatus === 'completed' || test.testStatus === 'APPROVED' || test.result === 'PASSED' || test.result === 'FAILED';

                            return (
                                <div key={test.id || test.bloodBagId} className="border rounded-4 p-4 shadow-sm bg-white">
                                    <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
                                        <Badge bg={getBadgeVariant(test.result || test.testStatus || 'testing')} className="px-3 py-2 rounded-2">
                                            {getStatusText(test.result || test.testStatus || 'testing')}
                                        </Badge>
                                        {isSafetyChecked && (
                                            <Badge bg={isSafe ? 'success' : 'danger'} className="px-3 py-2 rounded-2">
                                                {isSafe ? 'SAFE' : 'UNSAFE'}
                                            </Badge>
                                        )}
                                    </div>

                                    <Row className="mb-4 g-4 text-start">
                                        <Col xs={6} md={3}>
                                            <small className="text-muted d-block mb-1 text-uppercase fw-bold letter-spacing-1" style={{ fontSize: '11px' }}>Bag ID</small>
                                            <h6 className="fw-bold mb-0">{test.bloodBagId}</h6>
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <small className="text-muted d-block mb-1 text-uppercase fw-bold letter-spacing-1" style={{ fontSize: '11px' }}>Donor</small>
                                            <h6 className="mb-0">{test.donorName || 'John Doe'}</h6>
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <small className="text-muted d-block mb-1 text-uppercase fw-bold letter-spacing-1" style={{ fontSize: '11px' }}>Blood Group</small>
                                            <h6 className="mb-0">{test.bloodGroup}</h6>
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <small className="text-muted d-block mb-1 text-uppercase fw-bold letter-spacing-1" style={{ fontSize: '11px' }}>Collection Date</small>
                                            <h6 className="mb-0">{test.collectionDate || '2024-03-15'}</h6>
                                        </Col>
                                    </Row>

                                    <Row className="g-2 mb-4">
                                        {[
                                            { label: 'HIV', value: test.hiv },
                                            { label: 'Hep B', value: test.hbv },
                                            { label: 'Hep C', value: test.hcv },
                                            { label: 'Syphilis', value: test.syphilis },
                                            { label: 'Malaria', value: test.malaria }
                                        ].map((t, idx) => (
                                            <Col key={idx} className="flex-grow-1">
                                                <div className="border rounded-3 p-3 text-center bg-light bg-opacity-50">
                                                    <small className="d-block text-muted mb-2 fw-bold" style={{ fontSize: '11px' }}>{t.label}</small>
                                                    <Badge
                                                        bg={t.value === undefined || t.value === null ? 'warning' : (t.value ? 'danger' : 'success')}
                                                        className="w-100 py-2 rounded-2"
                                                    >
                                                        {t.value === undefined || t.value === null ? 'PENDING' : (t.value ? 'POSITIVE' : 'NEGATIVE')}
                                                    </Badge>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>

                                    <div className="d-flex flex-wrap gap-2">
                                        {test.result === 'PENDING' || !isSafetyChecked ? (
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                className="px-4 py-2 rounded-3 fw-bold"
                                                onClick={() => handleOpenEdit(test)}
                                            >
                                                Update Results
                                            </Button>
                                        ) : (
                                            <>
                                                {isSafe ? (
                                                    test.testStatus === 'APPROVED' ? (
                                                        <span className="text-success fw-bold d-flex align-items-center gap-2 small px-2">
                                                            <CheckCircle size={16} /> Approved & In Stock
                                                        </span>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="success"
                                                            className="px-4 py-2 rounded-3 fw-bold d-flex align-items-center gap-2"
                                                            onClick={() => handleApproveBloodBag(test.bloodBagId)}
                                                        >
                                                            <CheckCircle size={16} /> Approve
                                                        </Button>
                                                    )
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="px-4 py-2 rounded-3 fw-bold d-flex align-items-center gap-2"
                                                        onClick={() => handleDiscardBloodBag(test.bloodBagId)}
                                                    >
                                                        <XCircle size={16} /> Discard
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="light"
                                            className="px-4 py-2 rounded-3 fw-bold border"
                                            onClick={() => handleOpenReport(test)}
                                        >
                                            View Full Report
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </Card>

            {/* Safety Protocol Banner */}
            <div className="bg-danger bg-opacity-10 border border-danger p-4 rounded-4 d-flex gap-3 shadow-sm">
                <AlertTriangle className="text-danger flex-shrink-0" size={24} />
                <div>
                    <h6 className="text-danger fw-bold mb-1">Safety Protocol</h6>
                    <p className="text-danger small mb-0 opacity-75">
                        All blood donations must pass the following tests before being added to inventory: HIV, Hepatitis B,
                        Hepatitis C, Syphilis, and Malaria. Any positive result will automatically flag the bag as unsafe and mark for discard.
                    </p>
                </div>
            </div>

            {/* Edit Test Results Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                        <FlaskConical className="text-primary" /> Update Test Results
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4">
                    <p className="text-secondary small mb-4">Record results for blood unit: <strong>{selectedBagId}</strong></p>
                    <Form>
                        {[
                            { id: 'hiv', label: 'HIV (Human Immunodeficiency Virus)', stateKey: 'hiv' },
                            { id: 'hbv', label: 'Hepatitis B (HBV)', stateKey: 'hbv' },
                            { id: 'hcv', label: 'Hepatitis C (HCV)', stateKey: 'hcv' },
                            { id: 'syphilis', label: 'Syphilis (VDRL)', stateKey: 'syphilis' },
                            { id: 'malaria', label: 'Malaria', stateKey: 'malaria' }
                        ].map((t) => (
                            <Form.Group key={t.id} className="mb-3 d-flex justify-content-between align-items-center border-bottom pb-2">
                                <Form.Label className="mb-0 fw-medium text-dark">{t.label}</Form.Label>
                                <div className="d-flex align-items-center gap-2">
                                    <span className={formData[t.stateKey] ? "text-danger fw-bold small" : "text-success small"}>
                                        {formData[t.stateKey] ? "POSITIVE" : "NEGATIVE"}
                                    </span>
                                    <Form.Check
                                        type="switch"
                                        id={`${t.id}-switch`}
                                        checked={formData[t.stateKey]}
                                        onChange={(e) => setFormData({ ...formData, [t.stateKey]: e.target.checked })}
                                    />
                                </div>
                            </Form.Group>
                        ))}
                    </Form>

                    {Object.values(formData).some(val => val) && (
                        <div className="alert alert-danger d-flex align-items-start gap-2 mt-4 mb-0 rounded-3">
                            <AlertTriangle size={18} className="text-danger flex-shrink-0 mt-1" />
                            <span className="small text-danger fw-bold">
                                Warning: One or more test results are POSITIVE. Saving this will mark the bag as UNSAFE, making it unavailable in inventory.
                            </span>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 px-4 pb-4">
                    <Button variant="secondary" className="px-4 rounded-3" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" className="px-4 rounded-3 fw-bold" onClick={handleSaveResults}>
                        Save Results
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* View Full Report Modal */}
            <Modal show={showReportModal} onHide={() => setShowReportModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                        <FileText className="text-danger" /> Blood Screening Report
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4" id="screening-report">
                    {selectedTest && (
                        <div>
                            <div className="text-center mb-4">
                                <h6 className="text-muted text-uppercase fw-bold letter-spacing-1" style={{ fontSize: '11px' }}>Report Status</h6>
                                <Badge bg={getBadgeVariant(selectedTest.result || selectedTest.testStatus)} className="px-4 py-2 fs-6 rounded-pill">
                                    {getStatusText(selectedTest.result || selectedTest.testStatus)}
                                </Badge>
                            </div>
                            
                            <hr />

                            <Row className="gy-3 mb-4 text-start">
                                <Col xs={6}>
                                    <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}>Blood Bag ID</small>
                                    <span className="fw-bold">{selectedTest.bloodBagId}</span>
                                </Col>
                                <Col xs={6}>
                                    <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}>Blood Group</small>
                                    <span className="fw-bold">{selectedTest.bloodGroup}</span>
                                </Col>
                                <Col xs={6}>
                                    <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}>Donor Name</small>
                                    <span>{selectedTest.donorName || 'John Doe'}</span>
                                </Col>
                                <Col xs={6}>
                                    <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}>Screening Date</small>
                                    <span>{selectedTest.collectionDate || '2024-03-15'}</span>
                                </Col>
                            </Row>

                            <h6 className="fw-bold text-dark mb-3 text-start">Infection Screening Results:</h6>
                            <div className="border rounded-4 overflow-hidden">
                                {[
                                    { label: 'HIV-1 / HIV-2 Antibodies', value: selectedTest.hiv },
                                    { label: 'Hepatitis B Surface Antigen (HBsAg)', value: selectedTest.hbv },
                                    { label: 'Hepatitis C Antibodies (Anti-HCV)', value: selectedTest.hcv },
                                    { label: 'Syphilis Antibodies (VDRL/TPA)', value: selectedTest.syphilis },
                                    { label: 'Malaria Parasite Antigen (MP)', value: selectedTest.malaria }
                                ].map((item, idx) => (
                                    <div key={idx} className={`d-flex justify-content-between align-items-center p-3 ${idx < 4 ? 'border-bottom' : ''} ${item.value ? 'bg-danger bg-opacity-10' : 'bg-light bg-opacity-50'}`}>
                                        <span className="small text-secondary fw-medium">{item.label}</span>
                                        <Badge bg={item.value === undefined || item.value === null ? 'warning' : (item.value ? 'danger' : 'success')} className="px-2 py-1">
                                            {item.value === undefined || item.value === null ? 'PENDING' : (item.value ? 'POSITIVE' : 'NEGATIVE')}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="w-100 rounded-3" onClick={() => setShowReportModal(false)}>
                        Close Report
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
