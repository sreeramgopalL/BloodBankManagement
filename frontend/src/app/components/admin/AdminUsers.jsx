import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, XCircle, CheckCircle, Search, Filter, Shield, Hospital, User as UserIcon, MoreVertical } from 'lucide-react';
import { Card, Button, Table, Badge, Form, Row, Col, Modal, InputGroup, Dropdown } from 'react-bootstrap';

export function AdminUsers({
    systemUsers,
    showAddUserForm,
    setShowAddUserForm,
    newUser,
    setNewUser,
    handleAddUser,
    handleToggleUserStatus,
    handleDeleteUser
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const getAvatarColor = (name) => {
        const colors = [
            '#e63946', '#457b9d', '#1d3557', '#2a9d8f', '#f4a261',
            '#8338ec', '#ff006e', '#3a86ff', '#fb5607', '#ffbe0b'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const getRoleBadgeStyle = (role) => {
        switch (role.toLowerCase()) {
            case 'admin': return { bg: '#fee2e2', text: '#991b1b', icon: <Shield size={12} /> };
            case 'hospital': return { bg: '#e0f2fe', text: '#075985', icon: <Hospital size={12} /> };
            case 'staff': return { bg: '#fef9c3', text: '#854d0e', icon: <UserIcon size={12} /> };
            case 'donor': return { bg: '#dcfce7', text: '#166534', icon: <Plus size={12} /> };
            default: return { bg: '#f3f4f6', text: '#374151', icon: <UserIcon size={12} /> };
        }
    };

    const filteredUsers = useMemo(() => {
        return systemUsers.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [systemUsers, searchTerm, roleFilter]);

    return (
        <div className="space-y-6">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h4 className="fw-bold mb-1 text-dark">User Accounts</h4>
                    <p className="text-secondary small mb-0">Manage system access and permissions for all users</p>
                </div>
                <Button
                    variant="primary-red"
                    className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 rounded-3 shadow-sm"
                    onClick={() => setShowAddUserForm(true)}
                >
                    <Plus size={18} /> <span className="fw-bold">Add New User</span>
                </Button>
            </div>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <Card.Body className="p-3 bg-white border-bottom">
                    <Row className="g-3">
                        <Col md={8}>
                            <InputGroup className="bg-light rounded-3 border-0">
                                <InputGroup.Text className="bg-transparent border-0 pe-0 text-muted">
                                    <Search size={18} />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Search by name, email or ID..."
                                    className="bg-transparent border-0 py-2 ps-2 shadow-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col md={4}>
                            <div className="d-flex gap-2">
                                <Form.Select
                                    className="bg-light border-0 rounded-3 py-2 shadow-none text-secondary"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <option value="all">Every Role</option>
                                    <option value="admin">Administrators</option>
                                    <option value="hospital">Hospital Staff</option>
                                    <option value="staff">Bank Staff</option>
                                    <option value="donor">Donors</option>
                                </Form.Select>
                                <Button variant="light" className="border-0 rounded-3 shadow-none">
                                    <Filter size={18} />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>

                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover className="mb-0 text-nowrap align-middle border-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-3 ps-4 border-0 text-secondary small text-uppercase fw-bold" style={{ letterSpacing: '0.5px' }}>User</th>
                                    <th className="py-3 border-0 text-secondary small text-uppercase fw-bold" style={{ letterSpacing: '0.5px' }}>Role</th>
                                    <th className="py-3 border-0 text-secondary small text-uppercase fw-bold" style={{ letterSpacing: '0.5px' }}>Access</th>
                                    <th className="py-3 border-0 text-secondary small text-uppercase fw-bold" style={{ letterSpacing: '0.5px' }}>Status</th>
                                    <th className="py-3 border-0 text-secondary small text-uppercase fw-bold" style={{ letterSpacing: '0.5px' }}>Last Activity</th>
                                    <th className="py-3 pe-4 border-0 text-secondary small text-uppercase fw-bold text-end" style={{ letterSpacing: '0.5px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => {
                                        const roleStyle = getRoleBadgeStyle(user.role);
                                        return (
                                            <tr key={user.id} className="transition-all">
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div
                                                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                                                            style={{
                                                                width: '40px',
                                                                height: '40px',
                                                                backgroundColor: getAvatarColor(user.name),
                                                                fontSize: '14px'
                                                            }}
                                                        >
                                                            {getInitials(user.name)}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold text-dark">{user.name}</div>
                                                            <div className="text-secondary small">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span
                                                        className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill small fw-bold"
                                                        style={{ backgroundColor: roleStyle.bg, color: roleStyle.text }}
                                                    >
                                                        {roleStyle.icon}
                                                        {user.role.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="small text-dark fw-medium">
                                                        {user.hospital ? (
                                                            <span className="d-flex align-items-center gap-1">
                                                                <Hospital size={14} className="text-muted" /> {user.hospital}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted italic">System-wide</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <div
                                                            className={`rounded-circle ${user.status === 'active' ? 'bg-success' : 'bg-secondary'}`}
                                                            style={{
                                                                width: '8px',
                                                                height: '8px',
                                                                boxShadow: user.status === 'active' ? '0 0 0 3px rgba(34, 197, 94, 0.2)' : 'none'
                                                            }}
                                                        ></div>
                                                        <span className={`small fw-bold ${user.status === 'active' ? 'text-success' : 'text-secondary'}`}>
                                                            {user.status === 'active' ? 'Active' : 'Disabled'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-secondary small">{user.lastLogin || 'Never'}</div>
                                                </td>
                                                <td className="pe-4 text-end">
                                                    <Dropdown align="end">
                                                        <Dropdown.Toggle as={Button} variant="light" size="sm" className="bg-transparent border-0 p-1 shadow-none">
                                                            <MoreVertical size={18} className="text-muted" />
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu className="border-0 shadow-lg rounded-3">
                                                            <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                                                                <Edit size={14} className="text-primary" /> Edit Profile
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                className="d-flex align-items-center gap-2 py-2"
                                                                onClick={() => handleToggleUserStatus(user.id, user.status)}
                                                            >
                                                                {user.status === 'active' ?
                                                                    <><XCircle size={14} className="text-warning" /> Suspend Access</> :
                                                                    <><CheckCircle size={14} className="text-success" /> Restore Access</>
                                                                }
                                                            </Dropdown.Item>
                                                            <Dropdown.Divider />
                                                            <Dropdown.Item
                                                                className="d-flex align-items-center gap-2 py-2 text-danger"
                                                                onClick={() => handleDeleteUser(user.id)}
                                                            >
                                                                <Trash2 size={14} /> Delete Account
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-5 text-center">
                                            <div className="text-muted">
                                                <Search size={48} className="mb-3 opacity-25" />
                                                <h5>No users found</h5>
                                                <p className="small mb-0">Try adjusting your search terms or filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showAddUserForm} onHide={() => setShowAddUserForm(false)} centered size="lg" className="border-0">
                <Modal.Header closeButton className="border-0 pb-0">
                    <div>
                        <Modal.Title className="fw-bold">Create New User</Modal.Title>
                        <p className="text-secondary small mb-0">Provision access for new system participants</p>
                    </div>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleAddUser}>
                        <Row className="g-4">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary text-uppercase">Full Name</Form.Label>
                                    <Form.Control
                                        placeholder="e.g. John Doe"
                                        className="py-2 rounded-3 bg-light border-0 shadow-none focus-ring-danger"
                                        style={{ '--bs-focus-ring-color': 'rgba(220, 38, 38, 0.25)' }}
                                        type="text"
                                        value={newUser.name}
                                        onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary text-uppercase">Email Address</Form.Label>
                                    <Form.Control
                                        placeholder="name@example.com"
                                        className="py-2 rounded-3 bg-light border-0 shadow-none focus-ring-danger"
                                        type="email"
                                        value={newUser.email}
                                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label className="small fw-bold text-secondary text-uppercase">System Role</Form.Label>
                                    <Form.Select
                                        className="py-2 rounded-3 bg-light border-0 shadow-none focus-ring-danger"
                                        value={newUser.role}
                                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                    >
                                        <option value="staff">Staff Member</option>
                                        <option value="hospital">Hospital Administrator</option>
                                        <option value="admin">System Admin</option>
                                        <option value="donor">User / Donor</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            {newUser.role === 'hospital' && (
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small fw-bold text-secondary text-uppercase">Associated Hospital</Form.Label>
                                        <Form.Control
                                            className="py-2 rounded-3 bg-light border-0 shadow-none focus-ring-danger"
                                            placeholder="Enter hospital name"
                                            type="text"
                                            value={newUser.hospital}
                                            onChange={e => setNewUser({ ...newUser, hospital: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            )}
                        </Row>

                        <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4 mt-5 border">
                            <Shield className="text-secondary" size={24} />
                            <div>
                                <div className="fw-bold small text-dark">Password Generation</div>
                                <div className="text-muted small">A secure, temporary password will be generated. You will see it on the next screen to share with the user.</div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-3 mt-4">
                            <Button variant="light" className="px-4 py-2 rounded-3 fw-bold" onClick={() => setShowAddUserForm(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary-red" className="px-5 py-2 rounded-3 fw-bold shadow-sm">
                                Create Account
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
