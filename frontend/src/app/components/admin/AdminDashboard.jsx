import {
    Users,
    TrendingUp,
    Droplet,
    FlaskConical,
    Package,
    UserCheck,
    Calendar,
    XCircle,
    Clock,
    CheckCircle,
} from 'lucide-react';
import { Row, Col, Card } from 'react-bootstrap';

export function AdminDashboard({ stats, inventory = [], hospitalRequests = [], bloodTests = [], donors = [], camps = [] }) {
    const activities = [];

    // 1. Donors
    donors.forEach(d => {
        if (d.status === 'APPROVED') {
            activities.push({
                type: 'success',
                icon: CheckCircle,
                title: `Donor ${d.name} verified successfully`,
                subtitle: `Blood Group: ${d.bloodGroup} • Hemoglobin: ${d.hemoglobin || '12.5'} g/dL`,
                time: 'Recent'
            });
        } else if (d.status === 'REJECTED') {
            activities.push({
                type: 'danger',
                icon: XCircle,
                title: `Donor ${d.name} rejected`,
                subtitle: `Reason: ${d.rejectionReason || 'Ineligible'}`,
                time: 'Recent'
            });
        } else if (d.status === 'PENDING' || !d.status) {
            activities.push({
                type: 'warning',
                icon: Users,
                title: `New donor registered`,
                subtitle: `${d.name} (${d.bloodGroup || '—'}) added to registry`,
                time: 'Recent'
            });
        }
    });

    // 2. Hospital Requests
    hospitalRequests.forEach(r => {
        const hName = r.hospitalName || r.hospital || 'Hospital';
        if (r.status?.toLowerCase() === 'fulfilled' || r.status?.toLowerCase() === 'approved') {
            activities.push({
                type: 'primary',
                icon: Droplet,
                title: `Blood request fulfilled`,
                subtitle: `${hName} • ${r.units} units ${r.bloodGroup}`,
                time: 'Recent'
            });
        } else if (r.status?.toLowerCase() === 'rejected') {
            activities.push({
                type: 'danger',
                icon: XCircle,
                title: `Blood request rejected`,
                subtitle: `${hName} • ${r.units} units ${r.bloodGroup}`,
                time: 'Recent'
            });
        } else if (r.status?.toLowerCase() === 'pending' || !r.status) {
            activities.push({
                type: 'warning',
                icon: Clock,
                title: `New blood request received`,
                subtitle: `${hName} requested ${r.units} units ${r.bloodGroup}`,
                time: 'Recent'
            });
        }
    });

    // 3. Blood Tests
    bloodTests.forEach(t => {
        if (t.result === 'PASSED') {
            activities.push({
                type: 'success',
                icon: CheckCircle,
                title: `Blood bag ${t.bloodBagId || 'BAG'} cleared all tests`,
                subtitle: `Passed safety screening - ${t.bloodGroup} Group`,
                time: 'Recent'
            });
        } else if (t.result === 'FAILED') {
            activities.push({
                type: 'danger',
                icon: XCircle,
                title: `Blood bag ${t.bloodBagId || 'BAG'} discarded`,
                subtitle: `Failed safety screen - Safety protocol followed`,
                time: 'Recent'
            });
        }
    });

    // 4. Camps
    camps.forEach(c => {
        if (c.status === 'completed') {
            activities.push({
                type: 'success',
                icon: Calendar,
                title: `Donation camp completed`,
                subtitle: `${c.campName || c.name || 'Drive'} in ${c.location}`,
                time: 'Recent'
            });
        } else {
            activities.push({
                type: 'primary',
                icon: Calendar,
                title: `New donation camp scheduled`,
                subtitle: `${c.campName || c.name || 'Drive'} in ${c.location} on ${c.campDate || c.date || 'upcoming'}`,
                time: 'Recent'
            });
        }
    });

    // Get the most recent ones (reverse to put newest first, limit to 6)
    const dynamicActivities = activities.reverse().slice(0, 6);

    // Fallback static activities if no dynamic activities are present
    const finalActivities = dynamicActivities.length > 0 ? dynamicActivities : [
        {
            type: 'success',
            icon: CheckCircle,
            title: 'Blood bag BAG2024003 cleared all tests',
            subtitle: 'Added to inventory - B+ Blood Group',
            time: '2 hours ago'
        },
        {
            type: 'danger',
            icon: XCircle,
            title: 'Blood bag BAG2024004 discarded',
            subtitle: 'Hepatitis B positive - Safety protocol followed',
            time: '3 hours ago'
        },
        {
            type: 'primary',
            icon: Droplet,
            title: 'Blood request fulfilled',
            subtitle: 'City Hospital - 3 units A+',
            time: '4 hours ago'
        },
        {
            type: 'warning',
            icon: Calendar,
            title: 'Blood camp completed',
            subtitle: 'University Drive - 187 donations collected',
            time: '1 day ago'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <Row className="g-4 mb-4">
                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm h-100 rounded-3 transition-all hover-shadow">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="p-2 rounded" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}>
                                    <Users className="text-primary-red" size={24} />
                                </div>
                                <TrendingUp className="text-success" size={20} />
                            </div>
                            <h6 className="text-secondary mb-1">Total Donors</h6>
                            <h3 className="fw-bold text-dark mb-1">{stats.totalDonors}</h3>
                            <small className="text-success fw-bold">+12% from last month</small>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm h-100 rounded-3 transition-all hover-shadow">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="p-2 rounded" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}>
                                    <Droplet className="text-primary-red" size={24} />
                                </div>
                                <TrendingUp className="text-success" size={20} />
                            </div>
                            <h6 className="text-secondary mb-1">Total Donations</h6>
                            <h3 className="fw-bold text-dark mb-1">{stats.totalDonations}</h3>
                            <small className="text-success fw-bold">+15% from last month</small>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm h-100 rounded-3 transition-all hover-shadow">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="p-2 rounded" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}>
                                    <FlaskConical className="text-primary-red" size={24} />
                                </div>
                            </div>
                            <h6 className="text-secondary mb-1">Pending Tests</h6>
                            <h3 className="fw-bold text-dark mb-1">{stats.pendingTests}</h3>
                            <small className="text-muted">Requires testing</small>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm h-100 rounded-3 transition-all hover-shadow">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="p-2 rounded" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}>
                                    <Package className="text-primary-red" size={24} />
                                </div>
                            </div>
                            <h6 className="text-secondary mb-1">Inventory Units</h6>
                            <h3 className="fw-bold text-dark mb-1">{stats.inventoryUnits}</h3>
                            <small className="text-muted">Across all locations</small>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm h-100 rounded-3 transition-all hover-shadow">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="p-2 rounded" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}>
                                    <UserCheck className="text-primary-red" size={24} />
                                </div>
                            </div>
                            <h6 className="text-secondary mb-1">Active Donors</h6>
                            <h3 className="fw-bold text-dark mb-1">{stats.activeDonors}</h3>
                            <small className="text-success fw-bold">+8% from last month</small>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm h-100 rounded-3 transition-all hover-shadow">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="p-2 rounded" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}>
                                    <Calendar className="text-primary-red" size={24} />
                                </div>
                            </div>
                            <h6 className="text-secondary mb-1">Upcoming Camps</h6>
                            <h3 className="fw-bold text-dark mb-1">{stats.upcomingCamps}</h3>
                            <small className="text-muted">This month</small>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm h-100 rounded-3 transition-all hover-shadow">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="p-2 rounded" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}>
                                    <XCircle className="text-primary-red" size={24} />
                                </div>
                            </div>
                            <h6 className="text-secondary mb-1">Discarded Bags</h6>
                            <h3 className="fw-bold text-dark mb-1">{stats.discardedBags}</h3>
                            <small className="text-muted">Safety protocols</small>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} lg={3}>
                    <Card className="border-0 shadow-sm h-100 rounded-3 transition-all hover-shadow">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="p-2 rounded" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA' }}>
                                    <Clock className="text-primary-red" size={20} />
                                </div>
                            </div>
                            <h6 className="text-secondary mb-1">Pending Requests</h6>
                            <h3 className="fw-bold text-dark mb-1">{stats.pendingRequests}</h3>
                            <small className="text-muted">Requires attention</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Dynamic Recent Activity */}
            <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                    <h5 className="mb-4 fw-bold text-dark">Recent Activity</h5>
                    <div className="d-flex flex-column gap-3">
                        {finalActivities.map((act, index) => {
                            const IconComponent = act.icon;
                            return (
                                <div key={index} className={`d-flex align-items-start gap-3 pb-3 ${index < finalActivities.length - 1 ? 'border-bottom' : ''}`}>
                                    <div className={`bg-${act.type} bg-opacity-10 p-2 rounded`}>
                                        <IconComponent className={`text-${act.type}`} size={20} />
                                    </div>
                                    <div>
                                        <p className="mb-1 text-dark fw-bold" style={{ fontSize: '14.5px' }}>{act.title}</p>
                                        <p className="mb-1 small text-secondary">{act.subtitle}</p>
                                        <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>{act.time}</small>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}
