import { useState, useMemo } from 'react';
import {
    CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, LineChart, ResponsiveContainer
} from 'recharts';
import {
    Droplet, Building2, TrendingUp, FileText, Package,
    Download, Filter, Calendar, Search, Hospital, User as UserIcon
} from 'lucide-react';
import { Card, Row, Col, Button, Form, InputGroup, Table, Badge, Nav } from 'react-bootstrap';
import { useData } from '../../contexts/DataContext';
import { exportToCSV } from '../../utils/exportUtils';
import { showToast } from '../../utils/swal';

export function AdminReports() {
    const { hospitalRequests } = useData();
    const [activeTab, setActiveTab] = useState('analytics');
    const [reportType, setReportType] = useState('hospital'); // 'hospital' or 'donor'
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        status: 'all',
        bloodGroup: 'all'
    });

    // Mock data for donor reports since they might not be in DataContext yet
    const donorReportsMock = [
        { id: 'DR001', donorName: 'John Doe', bloodGroup: 'O+', date: '2024-03-15', units: '1', status: 'Completed', location: 'Central Bank' },
        { id: 'DR002', donorName: 'Jane Smith', bloodGroup: 'A-', date: '2024-03-18', units: '1', status: 'Completed', location: 'City Hospital' },
        { id: 'DR003', donorName: 'Robert Johnson', bloodGroup: 'B+', date: '2024-03-10', units: '1', status: 'Deferred', location: 'Mobile Camp' },
        { id: 'DR004', donorName: 'Emily Davis', bloodGroup: 'AB-', date: '2024-03-22', units: '1', status: 'Completed', location: 'Central Bank' },
        { id: 'DR005', donorName: 'Michael Brown', bloodGroup: 'O-', date: '2024-03-05', units: '1', status: 'Completed', location: 'North Center' },
    ];

    const hospitalReportsData = useMemo(() => {
        return hospitalRequests.map(req => ({
            id: req.id,
            hospital: req.hospitalName || 'City Hospital',
            bloodGroup: req.bloodGroup,
            units: req.unitsNeeded || req.units,
            date: req.requestedAt || req.requestDate || req.date || req.createdAt,
            status: req.status,
            urgency: req.urgency
        }));
    }, [hospitalRequests]);

    const filteredData = useMemo(() => {
        const data = reportType === 'hospital' ? hospitalReportsData : donorReportsMock;
        return data.filter(item => {
            const matchesStatus = filters.status === 'all' || 
                (item.status && item.status.toLowerCase() === filters.status.toLowerCase());
            
            const itemBG = item.bloodGroup ? String(item.bloodGroup).trim().toUpperCase() : '';
            const filterBG = filters.bloodGroup ? String(filters.bloodGroup).trim().toUpperCase() : '';
            const matchesBloodGroup = filterBG === 'ALL' || itemBG === filterBG;

            const itemDateStr = item.date ? String(item.date).split('T')[0] : '';
            const matchesStartDate = !filters.startDate || (itemDateStr && itemDateStr >= filters.startDate);
            const matchesEndDate = !filters.endDate || (itemDateStr && itemDateStr <= filters.endDate);

            return matchesStatus && matchesBloodGroup && matchesStartDate && matchesEndDate;
        });
    }, [reportType, hospitalReportsData, donorReportsMock, filters]);

    const handleExport = () => {
        if (filteredData.length === 0) {
            showToast('No data to export', 'info');
            return;
        }
        const fileName = `${reportType}_report_${new Date().toISOString().split('T')[0]}`;
        exportToCSV(filteredData, fileName);
        showToast(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported!`);
    };

    return (
        <div className="space-y-6 pb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1">Reports & Analytics</h4>
                    <p className="text-secondary small mb-0">Monitor system performance and generator reports</p>
                </div>
            </div>

            <Nav variant="underline" className="mb-4 border-bottom">
                <Nav.Item>
                    <Nav.Link
                        active={activeTab === 'analytics'}
                        onClick={() => setActiveTab('analytics')}
                        className={activeTab === 'analytics' ? 'text-danger fw-bold border-danger' : 'text-secondary'}
                    >
                        Performance Overview
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        active={activeTab === 'export'}
                        onClick={() => setActiveTab('export')}
                        className={activeTab === 'export' ? 'text-danger fw-bold border-danger' : 'text-secondary'}
                    >
                        Custom Reports & Export
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {activeTab === 'analytics' ? (
                <>
                    {/* KPI Cards */}
                    <Row className="g-4 mb-4">
                        {[
                            { title: 'Total Donations', value: '3,421', trend: '+18%', icon: Droplet, color: 'text-danger', bg: 'bg-danger' },
                            { title: 'Hospital Usage', value: '2,897', trend: '+12%', icon: Building2, color: 'text-primary', bg: 'bg-primary' },
                            { title: 'Inventory Balance', value: '450', trend: 'Healthy', icon: Package, color: 'text-success', bg: 'bg-success' }
                        ].map((kpi, idx) => (
                            <Col md={4} key={idx}>
                                <Card className="border-0 shadow-sm rounded-4 p-3 h-100 transition-all hover-shadow">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="text-muted mb-0">{kpi.title}</h6>
                                            <div className={`${kpi.bg} bg-opacity-10 p-2 rounded-3`}>
                                                <kpi.icon className={kpi.color} size={24} />
                                            </div>
                                        </div>
                                        <h2 className="fw-bold mb-1">{kpi.value}</h2>
                                        <div className="d-flex align-items-center gap-1">
                                            <TrendingUp size={14} className="text-success" />
                                            <small className="text-success fw-bold">{kpi.trend}</small>
                                            <small className="text-muted ms-1">vs last year</small>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Charts */}
                    <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold mb-0">Donation vs Usage Trend (2024)</h5>
                            <Badge bg="light" className="text-dark border px-3 py-2 rounded-pill">Monthly View</Badge>
                        </div>
                        <div style={{ height: '350px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[
                                    { month: 'Jan', donations: 298, usage: 267 },
                                    { month: 'Feb', donations: 276, usage: 251 },
                                    { month: 'Mar', donations: 312, usage: 289 },
                                    { month: 'Apr', donations: 285, usage: 244 },
                                    { month: 'May', donations: 301, usage: 278 },
                                    { month: 'Jun', donations: 289, usage: 265 },
                                    { month: 'Jul', donations: 325, usage: 298 },
                                    { month: 'Aug', donations: 318, usage: 287 },
                                    { month: 'Sep', donations: 295, usage: 276 },
                                    { month: 'Oct', donations: 308, usage: 289 },
                                    { month: 'Nov', donations: 297, usage: 271 },
                                    { month: 'Dec', donations: 317, usage: 272 }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="#94a3b8" />
                                    <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend iconType="circle" />
                                    <Line type="monotone" dataKey="donations" stroke="#ef4444" strokeWidth={4} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </>
            ) : (
                <div className="space-y-6">
                    {/* Filters Card */}
                    <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <Filter size={20} className="text-secondary" /> Report Configuration
                        </h5>
                        <Row className="g-3">
                            <Col md={3}>
                                <Form.Label className="small fw-bold text-secondary text-uppercase">Report Type</Form.Label>
                                <div className="d-flex gap-2 p-1 bg-light rounded-3">
                                    <Button
                                        variant={reportType === 'hospital' ? 'white' : 'transparent'}
                                        className={`flex-grow-1 shadow-none border-0 py-2 rounded-2 ${reportType === 'hospital' ? 'shadow-sm fw-bold text-danger' : 'text-secondary'}`}
                                        onClick={() => setReportType('hospital')}
                                    >
                                        Hospital
                                    </Button>
                                    <Button
                                        variant={reportType === 'donor' ? 'white' : 'transparent'}
                                        className={`flex-grow-1 shadow-none border-0 py-2 rounded-2 ${reportType === 'donor' ? 'shadow-sm fw-bold text-danger' : 'text-secondary'}`}
                                        onClick={() => setReportType('donor')}
                                    >
                                        Donor
                                    </Button>
                                </div>
                            </Col>
                            <Col md={2}>
                                <Form.Label className="small fw-bold text-secondary text-uppercase">Status</Form.Label>
                                <Form.Select
                                    className="bg-light border-0 py-2 rounded-3 shadow-none"
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                >
                                    <option value="all">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Label className="small fw-bold text-secondary text-uppercase">Blood Group</Form.Label>
                                <Form.Select
                                    className="bg-light border-0 py-2 rounded-3 shadow-none"
                                    value={filters.bloodGroup}
                                    onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
                                >
                                    <option value="all">All Groups</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                        <option key={group} value={group}>{group}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={5}>
                                <Form.Label className="small fw-bold text-secondary text-uppercase">Date Range</Form.Label>
                                <InputGroup className="bg-light rounded-3 overflow-hidden">
                                    <Form.Control
                                        type="date"
                                        className="bg-transparent border-0 py-2 shadow-none"
                                        value={filters.startDate}
                                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                    />
                                    <InputGroup.Text className="bg-transparent border-0 px-1 text-muted">to</InputGroup.Text>
                                    <Form.Control
                                        type="date"
                                        className="bg-transparent border-0 py-2 shadow-none"
                                        value={filters.endDate}
                                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end mt-4">
                            <Button
                                variant="primary-red"
                                className="px-5 py-2 rounded-3 d-flex align-items-center gap-2 shadow-sm"
                                onClick={handleExport}
                            >
                                <Download size={18} /> Export CSV Report
                            </Button>
                        </div>
                    </Card>

                    {/* Preview Table */}
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mt-4">
                        <Card.Header className="bg-white border-0 py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="fw-bold mb-0">Data Preview ({filteredData.length} records)</h6>
                                <Button variant="light" size="sm" onClick={() => setFilters({ startDate: '', endDate: '', status: 'all', bloodGroup: 'all' })}>
                                    Reset Filters
                                </Button>
                            </div>
                        </Card.Header>
                        <div className="table-responsive">
                            <Table hover className="mb-0 align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="py-3 ps-4 border-0 text-secondary small text-uppercase fw-bold">ID</th>
                                        <th className="py-3 border-0 text-secondary small text-uppercase fw-bold">{reportType === 'hospital' ? 'Hospital' : 'Donor Name'}</th>
                                        <th className="py-3 border-0 text-secondary small text-uppercase fw-bold text-center">Group</th>
                                        <th className="py-3 border-0 text-secondary small text-uppercase fw-bold text-center">Units</th>
                                        <th className="py-3 border-0 text-secondary small text-uppercase fw-bold">Date</th>
                                        <th className="py-3 border-0 text-secondary small text-uppercase fw-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map(item => (
                                            <tr key={item.id}>
                                                <td className="ps-4 font-monospace small text-primary">{item.id}</td>
                                                <td className="fw-bold">
                                                    <div className="d-flex align-items-center gap-2">
                                                        {reportType === 'hospital' ? <Hospital size={14} className="text-muted" /> : <UserIcon size={14} className="text-muted" />}
                                                        {item.hospital || item.donorName}
                                                    </div>
                                                </td>
                                                <td className="text-center font-monospace">
                                                    <Badge bg="danger" className="bg-opacity-10 text-danger border-danger border-opacity-25 border rounded-pill px-2">
                                                        {item.bloodGroup}
                                                    </Badge>
                                                </td>
                                                <td className="text-center fw-medium">{item.units}</td>
                                                <td className="text-secondary small">{item.date}</td>
                                                <td>
                                                    <Badge pill className={`text-uppercase px-2 fw-normal ${item.status.toLowerCase() === 'completed' || item.status.toLowerCase() === 'fulfilled' ? 'bg-success bg-opacity-10 text-success border border-success' :
                                                            item.status.toLowerCase() === 'pending' ? 'bg-warning bg-opacity-10 text-warning border border-warning' :
                                                                'bg-danger bg-opacity-10 text-danger border border-danger'
                                                        }`} style={{ fontSize: '10px' }}>
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-5 text-center text-muted">
                                                <Search size={40} className="mb-2 opacity-25" />
                                                <p>No records found matching current filters.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
