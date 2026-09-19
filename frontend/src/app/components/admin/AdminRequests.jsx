import { Package, Droplet, Building2, FileText, Phone, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, Row, Col, Badge, Button, Alert } from 'react-bootstrap';
import { useMemo } from 'react';

export function AdminRequests({ hospitalRequests, inventory, handleApproveRequest, handleRejectRequest }) {

    const pendingRequests = (hospitalRequests || []).filter(r =>
        (r.status?.toUpperCase() === 'PENDING') || (r.status?.toUpperCase() === 'APPROVED' || r.status?.toUpperCase() === 'REJECTED' ? false : !r.status)
    );

    // Aggregate inventory units by blood group
    const aggregatedInventory = useMemo(() => {
        const groups = {};
        (inventory || []).forEach(item => {
            const bg = item.bloodGroup?.toUpperCase();
            if (bg) {
                groups[bg] = (groups[bg] || 0) + (item.units || 0);
            }
        });
        return Object.entries(groups).map(([bg, units]) => ({ bloodGroup: bg, units }));
    }, [inventory]);

    // Normalize field names — backend uses requestedAt
    const normalize = (r) => {
        const rawDate = r.requestedAt || r.requestDate || r.date || r.createdAt;
        let formattedDate = '—';
        if (rawDate) {
            try {
                // If it's an array from LocalDateTime [2024, 3, 18, 10, 30]
                if (Array.isArray(rawDate)) {
                    formattedDate = `${rawDate[0]}-${String(rawDate[1]).padStart(2, '0')}-${String(rawDate[2]).padStart(2, '0')}`;
                } else {
                    formattedDate = new Date(rawDate).toLocaleDateString();
                }
            } catch (e) {
                formattedDate = String(rawDate).split('T')[0];
            }
        }

        return {
            id: r.id || r.requestId,
            hospitalName: r.hospitalName || r.hospital || r.hospitalId || 'Unknown Hospital',
            urgency: (r.urgency || r.priority || 'normal').toLowerCase(),
            bloodGroup: (r.bloodGroup || r.bloodType || r.blood_group || '—').toUpperCase(),
            units: r.units || r.quantity || r.unitsNeeded || 0,
            requestDate: formattedDate,
            patientName: r.patientName || r.patient || '—',
            patientAge: r.patientAge || r.age || '—',
            reason: r.reason || r.notes || r.description || '—',
            hospitalId: r.hospitalId || r.id || '—',
            status: r.status || 'PENDING',
        };
    };

    const allRequests = (hospitalRequests || [])
        .map(normalize);

    const pending = allRequests.filter(r => r.status?.toUpperCase() === 'PENDING');
    const processed = allRequests.filter(r =>
        ['FULFILLED', 'REJECTED', 'APPROVED', 'COMPLETED'].includes(r.status?.toUpperCase())
    );

    const getUrgencyStyle = (urgency) => {
        switch ((urgency || '').toLowerCase()) {
            case 'critical': return { bg: '#dc2626', label: 'CRITICAL' };
            case 'urgent': return { bg: '#f59e0b', label: 'URGENT' };
            default: return { bg: '#374151', label: (urgency || 'NORMAL').toUpperCase() };
        }
    };

    const getBorderColor = (urgency) => {
        switch ((urgency || '').toLowerCase()) {
            case 'critical': return '#dc2626';
            case 'urgent': return '#f59e0b';
            default: return '#e5e7eb';
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1">Hospital Blood Requests</h4>
                    <p className="text-muted mb-0 small">Review and manage pending requests</p>
                </div>
                <span
                    className="px-3 py-2 rounded-3 text-white fw-bold"
                    style={{ backgroundColor: '#374151', fontSize: '14px' }}
                >
                    {pending.length} Pending
                </span>
            </div>

            {/* Inventory Quick View */}
            <Card className="mb-4 border-0 shadow-sm" style={{ background: '#eff6ff', borderLeft: '4px solid #3b82f6' }}>
                <Card.Body>
                    <h6 className="d-flex align-items-center gap-2 fw-bold mb-3" style={{ color: '#1d4ed8' }}>
                        <Package size={18} /> Current Inventory Quick View
                    </h6>
                    <Row className="g-2">
                        {['A+', 'O+', 'B-', 'AB+', 'O-', 'A-', 'B+', 'AB-'].map(bg => {
                            const item = aggregatedInventory.find(i => i.bloodGroup === bg);
                            return (
                                <Col xs={6} sm={4} md={3} lg={1} key={bg}>
                                    <div className="bg-white rounded-3 text-center p-2 shadow-sm border">
                                        <div className="fw-bold text-danger" style={{ fontSize: '13px' }}>{bg}</div>
                                        <div className="fw-bold" style={{ fontSize: '16px' }}>{item?.units || 0}</div>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                </Card.Body>
            </Card>

            {/* Requests */}
            <div className="d-flex flex-column gap-3">
                {pending.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                            <CheckCircle size={48} className="text-success" />
                        </div>
                        <h5>All Caught Up!</h5>
                        <p className="text-muted">No pending requests found.</p>
                    </div>
                ) : (
                    pending
                        .sort((a, b) => (a.urgency === 'critical' ? -1 : 1))
                        .map(request => {
                            const urgStyle = getUrgencyStyle(request.urgency);
                            const availableStock = aggregatedInventory.find(i =>
                                i.bloodGroup === request.bloodGroup
                            );
                            const stockUnits = availableStock?.units || 0;
                            const hasStock = stockUnits >= request.units;
                            const isProcessed = request.status !== 'PENDING';

                            return (
                                <Card
                                    key={request.id}
                                    className="border-0 shadow-sm"
                                    style={{ borderLeft: `5px solid ${getBorderColor(request.urgency)}` }}
                                >
                                    <Card.Body className="p-4">
                                        <div className="d-flex flex-column flex-lg-row gap-4">
                                            <div className="flex-grow-1">
                                                {/* Hospital Name + Urgency Badge */}
                                                <div className="d-flex align-items-center gap-3 mb-2">
                                                    <h5 className="mb-0 fw-bold">{request.hospitalName}</h5>
                                                    <span
                                                        className="px-2 py-1 rounded text-white fw-bold"
                                                        style={{ fontSize: '11px', backgroundColor: urgStyle.bg }}
                                                    >
                                                        {urgStyle.label}
                                                    </span>
                                                    {isProcessed && (
                                                        <Badge bg={['FULFILLED', 'APPROVED', 'COMPLETED'].includes(request.status?.toUpperCase()) ? 'success' : 'danger'} className="ms-auto px-3 py-2">
                                                            {request.status.toUpperCase()}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-muted small mb-3">
                                                    Request ID: {request.id} • {request.requestDate}
                                                </p>

                                                {/* Blood Group / Units / Available */}
                                                <Row className="g-3 mb-3">
                                                    <Col sm={4}>
                                                        <div className="bg-light p-3 rounded-3">
                                                            <small className="text-muted d-block mb-1">Blood Group</small>
                                                            <h5 className="mb-0 text-danger fw-bold d-flex align-items-center gap-2">
                                                                <Droplet size={16} /> {request.bloodGroup}
                                                            </h5>
                                                        </div>
                                                    </Col>
                                                    <Col sm={4}>
                                                        <div className="bg-light p-3 rounded-3">
                                                            <small className="text-muted d-block mb-1">Units Needed</small>
                                                            <h5 className="mb-0 fw-bold">{request.units} units</h5>
                                                        </div>
                                                    </Col>
                                                    <Col sm={4}>
                                                        <div className="bg-light p-3 rounded-3">
                                                            <small className="text-muted d-block mb-1">Available</small>
                                                            <h5 className={`mb-0 fw-bold ${hasStock ? 'text-success' : 'text-danger'}`}>
                                                                {stockUnits} units
                                                            </h5>
                                                        </div>
                                                    </Col>
                                                </Row>

                                                {/* Meta info */}
                                                <div className="d-flex flex-wrap gap-4 text-muted small">
                                                    <span className="d-flex align-items-center gap-1">
                                                        <Building2 size={14} />
                                                        Patient: <strong className="ms-1">{request.patientName}</strong>
                                                    </span>
                                                    <span className="d-flex align-items-center gap-1">
                                                        <FileText size={14} />
                                                        Reason: {request.reason}
                                                    </span>
                                                    <span className="d-flex align-items-center gap-1">
                                                        <Phone size={14} />
                                                        Hospital ID: {request.hospitalId}
                                                    </span>
                                                </div>

                                                {!hasStock && (
                                                    <Alert variant="danger" className="mt-3 py-2 px-3 d-flex align-items-center gap-2 mb-0">
                                                        <AlertTriangle size={16} />
                                                        <small>Insufficient Stock! Short by {request.units - (availableStock?.units || 0)} units.</small>
                                                    </Alert>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div
                                                className="d-flex flex-column gap-2 justify-content-center"
                                                style={{ minWidth: '140px', borderLeft: '1px solid #e5e7eb', paddingLeft: '1.5rem' }}
                                            >
                                                {!isProcessed ? (
                                                    <>
                                                        <Button
                                                            variant={hasStock ? 'success' : 'secondary'}
                                                            disabled={!hasStock}
                                                            className="d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-bold"
                                                            onClick={() => handleApproveRequest(request.id, request.bloodGroup, request.units)}
                                                        >
                                                            <CheckCircle size={16} /> Approve
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            className="d-flex align-items-center justify-content-center gap-2 py-2 rounded-3 fw-bold"
                                                            onClick={() => handleRejectRequest(request.id)}
                                                        >
                                                            <XCircle size={16} /> Reject
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <div className="text-center">
                                                        <div className={`p-2 rounded-3 fw-bold small ${['FULFILLED', 'APPROVED', 'COMPLETED'].includes(request.status?.toUpperCase()) ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                                                            {['FULFILLED', 'APPROVED', 'COMPLETED'].includes(request.status?.toUpperCase()) ? 'DISPATCHED' : 'REJECTED'}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            );
                        })
                )}
            </div>
        </div>
    );
}
