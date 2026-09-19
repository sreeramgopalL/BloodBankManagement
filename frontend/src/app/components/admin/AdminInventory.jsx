import { useState } from 'react';
import {
    Plus,
    BarChart3,
    Activity,
    Droplet,
    CheckCircle,
    AlertTriangle,
    Package,
    Edit,
    Trash2
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { Row, Col, Card, Button, Form, Table, Badge, Modal } from 'react-bootstrap';

const COLORS = ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#2563eb', '#7c3aed', '#db2777', '#059669'];

export function AdminInventory({
    inventory,
    showAddStockForm,
    setShowAddStockForm,
    newStock,
    setNewStock,
    handleSubmitStock,
    handleDeleteInventory,
    handleEditInventory
}) {

    const getStatusColor = (status) => {
        if (status === 'good') return 'success';
        if (status === 'expiring') return 'warning';
        if (status === 'expired') return 'danger';
        return 'secondary';
    };

    return (
        <div className="space-y-6">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0 fw-bold">Blood Inventory Management</h4>
                <Button
                    variant="danger"
                    className="d-flex align-items-center gap-2"
                    onClick={() => setShowAddStockForm(true)}
                >
                    <Plus size={16} /> Add Stock
                </Button>
            </div>

            <Row className="g-4 mb-4">
                {/* Bar Chart */}
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100 rounded-4 p-3">
                        <Card.Body>
                            <h5 className="mb-4 d-flex align-items-center gap-2">
                                <BarChart3 className="text-danger" size={20} />
                                Blood Stock Levels by Group
                            </h5>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={inventory}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="bloodGroup" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                borderColor: '#e5e7eb',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar dataKey="units" fill="#dc2626" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Pie Chart */}
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100 rounded-4 p-3">
                        <Card.Body>
                            <h5 className="mb-4 d-flex align-items-center gap-2">
                                <Activity className="text-primary" size={20} />
                                Stock Distribution
                            </h5>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={inventory}
                                            dataKey="units"
                                            nameKey="bloodGroup"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label={({ bloodGroup, units }) => `${bloodGroup}: ${units}`}
                                        >
                                            {inventory.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Summary Cards */}
            <Row className="g-3 mb-4">
                <Col md={3}>
                    <Card className="border-danger bg-danger bg-opacity-10 text-danger h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Total Units</span>
                                <Droplet size={20} />
                            </div>
                            <h3 className="fw-bold mb-0">{inventory.reduce((sum, item) => sum + item.units, 0)}</h3>
                            <small>Across all groups</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-success bg-success bg-opacity-10 text-success h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Good Stock</span>
                                <CheckCircle size={20} />
                            </div>
                            <h3 className="fw-bold mb-0">{inventory.filter(item => item.status === 'good').reduce((sum, item) => sum + item.units, 0)}</h3>
                            <small>In good condition</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-warning bg-warning bg-opacity-10 text-warning h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Expiring Soon</span>
                                <AlertTriangle size={20} />
                            </div>
                            <h3 className="fw-bold mb-0">{inventory.filter(item => item.status === 'expiring').reduce((sum, item) => sum + item.units, 0)}</h3>
                            <small>Expires soon</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-primary bg-primary bg-opacity-10 text-primary h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Blood Groups</span>
                                <Package size={20} />
                            </div>
                            <h3 className="fw-bold mb-0">{inventory.length}</h3>
                            <small>Types in inventory</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Add Stock Modal */}
            <Modal show={showAddStockForm} onHide={() => setShowAddStockForm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Stock</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitStock}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Blood Group *</Form.Label>
                                    <Form.Select
                                        value={newStock.bloodGroup}
                                        onChange={(e) => setNewStock({ ...newStock, bloodGroup: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Group</option>
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
                                    <Form.Label>Units *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={newStock.units}
                                        onChange={(e) => setNewStock({ ...newStock, units: e.target.value })}
                                        min="1"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Component *</Form.Label>
                                    <Form.Select
                                        value={newStock.component}
                                        onChange={(e) => setNewStock({ ...newStock, component: e.target.value })}
                                        required
                                    >
                                        <option value="RBC">RBC (Packed Cells)</option>
                                        <option value="Plasma">Plasma (FFP)</option>
                                        <option value="Platelets">Platelets</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Location *</Form.Label>
                                    <Form.Select
                                        value={newStock.location}
                                        onChange={(e) => setNewStock({ ...newStock, location: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Location</option>
                                        <option value="Central Bank">Central Bank</option>
                                        <option value="North Center">North Center</option>
                                        <option value="South Center">South Center</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Expiry Date *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={newStock.expiryDate}
                                        onChange={(e) => setNewStock({ ...newStock, expiryDate: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={() => setShowAddStockForm(false)}>Cancel</Button>
                            <Button variant="danger" type="submit">Add Stock</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Inventory Table */}
            <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0 text-nowrap align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="py-3 ps-4 border-0">ID</th>
                                <th className="py-3 border-0">Blood Group</th>
                                <th className="py-3 border-0">Component</th>
                                <th className="py-3 border-0">Units</th>
                                <th className="py-3 border-0">Location</th>
                                <th className="py-3 border-0">Expiry Date</th>
                                <th className="py-3 border-0">Status</th>
                                <th className="py-3 pe-4 border-0">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => {
                                const itemId = item.id || item._id;
                                return (
                                <tr key={itemId}>
                                    <td className="ps-4 text-muted">{itemId}</td>
                                    <td>
                                        <Badge bg="light" text="dark" className="border d-inline-flex align-items-center gap-1 px-2 py-1">
                                            <Droplet size={12} className="text-danger" />
                                            {item.bloodGroup}
                                        </Badge>
                                    </td>
                                    <td>{item.component || 'RBC'}</td>
                                    <td className="fw-bold">{item.units}</td>
                                    <td>{item.location}</td>
                                    <td>{item.expiryDate}</td>
                                    <td>
                                        <Badge bg={getStatusColor(item.status)} className="px-2 py-1">
                                            {item.status.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="pe-4">
                                        <div className="d-flex gap-2">
                                            <Button variant="light" size="sm" className="text-primary" onClick={() => handleEditInventory(itemId)}><Edit size={16} /></Button>
                                            <Button variant="light" size="sm" className="text-danger" onClick={() => handleDeleteInventory(itemId)}><Trash2 size={16} /></Button>
                                        </div>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Alerts Section (Static as per original code structure) */}
            <AlertTriangle className="text-warning me-2" />
            <span className="text-muted small">Low stock alerts: 2 units O- expiring soon.</span>
        </div>
    );
}
