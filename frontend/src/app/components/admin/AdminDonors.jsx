import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import Swal from '../../utils/swal';

export function AdminDonors({ donorVerifications, handleVerifyDonor }) {

    const getBadgeVariant = (status) => {
        const s = (status || '').toLowerCase();
        if (s === 'approved') return 'success';
        if (s === 'pending') return 'warning';
        if (s === 'rejected') return 'danger';
        return 'secondary';
    };

    const onApproveClick = async (donor) => {
        const { value: hb } = await Swal.fire({
            title: 'Approve Donor Verification',
            input: 'number',
            inputLabel: 'Enter Hemoglobin Level (g/dL)',
            inputPlaceholder: 'e.g. 13.5',
            inputAttributes: {
                min: 0,
                step: 0.1
            },
            showCancelButton: true,
            confirmButtonText: 'Approve & Verify',
            confirmButtonColor: '#198754',
            cancelButtonColor: '#6c757d',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write the hemoglobin level!';
                }
                const num = parseFloat(value);
                if (isNaN(num) || num <= 0) {
                    return 'Please enter a valid hemoglobin level!';
                }
            }
        });

        if (hb) {
            const hbValue = parseFloat(hb);
            // Frontend eligibility check:
            if (hbValue < 12.5) {
                await Swal.fire({
                    title: 'Ineligible Donor',
                    text: `The entered hemoglobin level (${hbValue} g/dL) is below the required 12.5 g/dL. This donor is medically ineligible and cannot be approved. Please reject the donor instead.`,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#d33'
                });
                return;
            }
            await handleVerifyDonor(donor.id, 'APPROVED', 'Good Health', hbValue, null);
        }
    };

    const onRejectClick = async (donor) => {
        const { value: reason } = await Swal.fire({
            title: 'Reject Donor Verification',
            input: 'textarea',
            inputLabel: 'Reason for Rejection',
            inputPlaceholder: 'Type the reason why this donor is ineligible...',
            showCancelButton: true,
            confirmButtonText: 'Reject Donor',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            inputValidator: (value) => {
                if (!value) {
                    return 'You must provide a rejection reason!';
                }
            }
        });

        if (reason) {
            await handleVerifyDonor(donor.id, 'REJECTED', 'Ineligible', null, reason);
        }
    };

    return (
        <Card className="border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-4">Donor Health Verification</h5>
            <div className="d-flex flex-column gap-3">
                {(donorVerifications || []).length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <AlertCircle className="mb-2" size={32} />
                        <p className="mb-0">No donor verification requests found.</p>
                    </div>
                ) : (
                    (donorVerifications || []).map((donor) => (
                        <div key={donor.id} className="border rounded-4 p-4 shadow-sm bg-white">
                            <div className="d-flex flex-column flex-md-row justify-content-between gap-4">
                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center gap-2 mb-4">
                                        <Badge bg={getBadgeVariant(donor.status)} className="px-3 py-2 rounded-2 fw-bold">
                                            {(donor.status || 'PENDING').toUpperCase()}
                                        </Badge>
                                        <small className="text-muted fw-bold">ID: {donor.id}</small>
                                        {donor.phone && (
                                            <small className="text-muted ms-3">Phone: {donor.phone}</small>
                                        )}
                                    </div>

                                    <Row className="g-4 text-start mb-3">
                                        <Col xs={6} md={3}>
                                            <small className="text-muted d-block mb-1 text-uppercase fw-bold letter-spacing-1" style={{ fontSize: '11px' }}>Name</small>
                                            <h6 className="fw-bold mb-0">{donor.name}</h6>
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <small className="text-muted d-block mb-1 text-uppercase fw-bold letter-spacing-1" style={{ fontSize: '11px' }}>Blood Group</small>
                                            <h6 className="mb-0">{donor.bloodGroup}</h6>
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <small className="text-muted d-block mb-1 text-uppercase fw-bold letter-spacing-1" style={{ fontSize: '11px' }}>Age & Weight</small>
                                            <h6 className="mb-0">{donor.age ? `${donor.age} yrs` : 'N/A'} | {donor.weight ? `${donor.weight} kg` : 'N/A'}</h6>
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <small className="text-muted d-block mb-1 text-uppercase fw-bold letter-spacing-1" style={{ fontSize: '11px' }}>Health Status</small>
                                            <h6 className={`mb-0 ${donor.healthStatus?.toLowerCase() === 'good' ? 'text-success' : 'text-danger'}`}>
                                                {donor.healthStatus || 'Good'}
                                            </h6>
                                        </Col>
                                    </Row>

                                    <Row className="g-4 text-start">
                                        <Col xs={12} md={6}>
                                            <small className="text-muted d-block mb-1 text-uppercase fw-bold letter-spacing-1" style={{ fontSize: '11px' }}>Medical History</small>
                                            <p className="mb-0 small text-secondary bg-light p-2 rounded-3 border" style={{ minHeight: '38px' }}>
                                                {donor.medicalHistory || 'No history reported during registration.'}
                                            </p>
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <small className="text-muted d-block mb-1 text-uppercase fw-bold letter-spacing-1" style={{ fontSize: '11px' }}>Hemoglobin</small>
                                            <h6 className="mb-0 fw-bold">{donor.hemoglobin ? `${donor.hemoglobin} g/dL` : 'Not recorded'}</h6>
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <small className="text-muted d-block mb-1 text-uppercase fw-bold letter-spacing-1" style={{ fontSize: '11px' }}>Last Donation</small>
                                            <h6 className="mb-0">{donor.lastDonationDate || 'First Time'}</h6>
                                        </Col>
                                    </Row>

                                    {donor.status === 'REJECTED' && donor.rejectionReason && (
                                        <div className="mt-3 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-3 p-3 text-start">
                                            <small className="text-danger fw-bold d-block mb-1">Rejection Reason:</small>
                                            <span className="text-danger small">{donor.rejectionReason}</span>
                                        </div>
                                    )}
                                </div>

                                {(donor.status || 'pending').toLowerCase() === 'pending' && (
                                    <div className="d-flex flex-md-column justify-content-center align-items-center gap-2 border-start ps-md-4" style={{ minWidth: '160px' }}>
                                        <Button
                                            variant="success"
                                            className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 rounded-3 fw-bold w-100"
                                            onClick={() => onApproveClick(donor)}
                                        >
                                            <CheckCircle size={16} /> Approve
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 rounded-3 fw-bold w-100"
                                            onClick={() => onRejectClick(donor)}
                                        >
                                            <XCircle size={16} /> Reject
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
