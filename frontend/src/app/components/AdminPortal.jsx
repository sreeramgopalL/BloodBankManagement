import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
    BarChart3,
    Users,
    ClipboardList,
    Settings,
    LayoutDashboard,
    FlaskConical,
    Tent,
    FileText,
    Phone
} from 'lucide-react';
import { Container, Row, Col, Nav, Tab, Button, Badge } from 'react-bootstrap';

// Sub-components
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminInventory } from './admin/AdminInventory';
import { AdminTesting } from './admin/AdminTesting';
import { AdminDonors } from './admin/AdminDonors';
import { AdminCamps } from './admin/AdminCamps';
import { AdminUsers } from './admin/AdminUsers';
import { AdminReports } from './admin/AdminReports';
import { AdminRequests } from './admin/AdminRequests';

import { useState, useMemo } from 'react';
import Swal, { showSuccess, showConfirm, showToast, showError } from '../utils/swal';

export function AdminPortal() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');

    const {
        inventory,
        hospitalRequests,
        bloodTests,
        donors,
        camps,
        addInventory,
        deleteInventory,
        updateInventory,
        updateRequestStatus,
        verifyDonor,
        updateTestResult,
        createUser,
        discardBloodBag,
        approveBloodBag,
        addCamp,
        deleteCamp,
        updateCamp
    } = useData();

    const [systemUsers, setSystemUsers] = useState([
        { id: 'USR001', name: 'Dr. Sarah Connor', email: 'sarah@bloodbank.org', role: 'admin', status: 'active', lastLogin: '2024-03-18 09:30' },
        { id: 'USR002', name: 'James Wright', email: 'james@cityhospital.com', role: 'hospital', hospital: 'City Hospital', status: 'active', lastLogin: '2024-03-17 14:20' },
        { id: 'USR003', name: 'Emily Chen', email: 'emily@bloodbank.org', role: 'hospital', status: 'active', lastLogin: '2024-03-18 08:45' },
    ]);

    const stats = useMemo(() => {
        return {
            totalDonors: donors.length,
            totalDonations: inventory.length + 120, // Example offset for historical data
            pendingTests: bloodTests.filter(t => (t.result || t.testStatus) === 'PENDING').length,
            inventoryUnits: inventory.reduce((sum, item) => sum + (item.units || 0), 0),
            activeDonors: donors.filter(d => d.status === 'APPROVED').length,
            upcomingCamps: camps.filter(c => c.status === 'scheduled').length,
            discardedBags: bloodTests.filter(t => (t.result || t.testStatus) === 'FAILED').length,
            pendingRequests: hospitalRequests.filter(r => r.status?.toUpperCase() === 'PENDING').length
        };
    }, [donors, inventory, bloodTests, camps, hospitalRequests]);

    const [showAddStockForm, setShowAddStockForm] = useState(false);
    const [newStock, setNewStock] = useState({ bloodGroup: '', units: '', component: 'RBC', location: '', expiryDate: '' });

    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'hospital', hospital: '' });

    const [newCamp, setNewCamp] = useState({ name: '', location: '', date: '', time: '', expectedDonors: '' });

    // --- HANDLERS ---
    const handleSubmitStock = async (e) => {
        e.preventDefault();

        const unitsToAdd = parseInt(newStock.units) || 1;
        const normalizedLocation = newStock.location || 'Central Bank';

        // Find existing stock with same blood group, location, and component
        const existingItem = inventory.find(item =>
            item.bloodGroup === newStock.bloodGroup &&
            (item.location === normalizedLocation || (!item.location && normalizedLocation === 'Central Bank')) &&
            (item.component || '').toUpperCase() === (newStock.component || '').toUpperCase()
        );

        try {
            if (existingItem) {
                // Update existing stock
                const updatedUnits = (existingItem.units || 0) + unitsToAdd;
                const success = await updateInventory(existingItem.id || existingItem._id, updatedUnits);
                if (success) {
                    showToast(`Added ${unitsToAdd} units to existing ${newStock.bloodGroup} ${newStock.component} stock in ${normalizedLocation}.`);
                } else {
                    Swal.fire('Error', 'Failed to update existing stock units.', 'error');
                }
            } else {
                // Create new stock entry
                const stockItem = {
                    bloodGroup: newStock.bloodGroup,
                    units: unitsToAdd,
                    component: (newStock.component || 'RBC').toUpperCase(),
                    location: normalizedLocation,
                    expiryDate: newStock.expiryDate || null,
                    collectedDate: new Date().toISOString().split('T')[0],
                    status: 'AVAILABLE',
                    testStatus: 'PASSED'
                };
                const success = await addInventory(stockItem);
                if (success) {
                    showToast(`Created new ${newStock.bloodGroup} ${newStock.component} stock in ${normalizedLocation}.`);
                } else {
                    Swal.fire('Error', 'Failed to add new stock to inventory.', 'error');
                }
            }
        } catch (error) {
            console.error('Error submitting stock:', error);
            Swal.fire('Error', 'An unexpected error occurred while saving stock.', 'error');
        }

        setShowAddStockForm(false);
        setNewStock({ bloodGroup: '', units: '', component: 'RBC', location: '', expiryDate: '' });
    };

    const handleUpdateTestResult = (bagId, testData) => {
        updateTestResult(bagId, testData);
    };

    const handleApproveBloodBag = async (bagId) => {
        try {
            const success = await approveBloodBag(bagId);
            if (success) {
                showSuccess('Approved', `Blood bag ${bagId} approved and added to inventory.`);
            } else {
                Swal.fire('Error', `Failed to approve blood bag ${bagId}.`, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to connect to inventory service.', 'error');
        }
    };

    const handleDiscardBloodBag = async (bagId) => {
        const result = await showConfirm('Discard Blood Bag', `Are you sure you want to discard blood bag ${bagId}?`);
        if (result.isConfirmed) {
            discardBloodBag(bagId);
            showSuccess('Discarded', `Blood bag ${bagId} discarded safely and removed from testing list.`);
        }
    };

    const handleDeleteInventory = async (id) => {
        const result = await showConfirm('Delete Item', 'Are you sure you want to delete this inventory item?');
        if (result.isConfirmed) {
            const success = await deleteInventory(id);
            if (success) {
                showToast('Item removed from inventory.');
            } else {
                Swal.fire('Error', 'Failed to remove item from inventory.', 'error');
            }
        }
    };

    const handleEditInventory = async (id) => {
        const item = inventory.find(i => String(i.id || i._id) === String(id));
        if (!item) return; // Defensive check
        const { value: newUnits } = await Swal.fire({
            title: `Update Units for ${item.bloodGroup}`,
            input: 'number',
            inputLabel: 'Enter new unit count',
            inputValue: item.units,
            showCancelButton: true,
            confirmButtonColor: '#d33',
        });

        if (newUnits !== undefined && newUnits !== null) {
            const parsedUnits = parseInt(newUnits);
            const finalUnits = isNaN(parsedUnits) ? item.units : parsedUnits;
            const success = await updateInventory(id, finalUnits);
            if (success) {
                showToast('Inventory updated!');
            } else {
                Swal.fire('Error', 'Failed to update inventory units.', 'error');
            }
        }
    };

    const handleVerifyDonor = async (id, status, healthStatus, hemoglobin, rejectionReason) => {
        try {
            const res = await verifyDonor(id, status, healthStatus, hemoglobin, rejectionReason);
            if (res && res.ok) {
                showToast(`Donor ${status.toLowerCase()}!`);
                return true;
            } else {
                const errorText = res ? await res.text() : 'Verification failed';
                // Try parsing JSON or display raw text
                let errMsg = errorText;
                try {
                    const json = JSON.parse(errorText);
                    if (json.message) errMsg = json.message;
                } catch(e) {}
                Swal.fire('Eligibility Alert', errMsg || 'Donor does not meet eligibility criteria.', 'warning');
                return false;
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to connect to verification service.', 'error');
            return false;
        }
    };

    const handleSubmitCamp = async (e) => {
        e.preventDefault();
        const camp = {
            campName: newCamp.name,
            location: newCamp.location,
            campDate: newCamp.date,
            campTime: newCamp.time,
            expectedDonors: parseInt(newCamp.expectedDonors) || 0,
            actualDonors: 0,
            status: 'scheduled',
            organizer: 'System Admin'
        };

        try {
            const res = await addCamp(camp);
            if (res && res.ok) {
                setNewCamp({ name: '', location: '', date: '', time: '', expectedDonors: '' });
                showSuccess('Success', 'Donation camp scheduled successfully!');
            } else {
                const errorText = await res.text();
                Swal.fire('Error', errorText || 'Failed to create camp. Please check your connection.', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to connect to camp service.', 'error');
        }
    };

    const handleDeleteCamp = async (id) => {
        const result = await showConfirm('Cancel Camp', 'Are you sure you want to cancel this donation camp?');
        if (result.isConfirmed) {
            await deleteCamp(id);
            showToast('Camp cancelled.');
        }
    };

    const handleEditCamp = async (camp) => {
        // Simple prompt for updating expected donors for now
        const { value: newExpected } = await Swal.fire({
            title: `Update Expected Donors`,
            input: 'number',
            inputValue: camp.expectedDonors,
            showCancelButton: true,
            confirmButtonColor: '#d33',
        });

        if (newExpected) {
            await updateCamp(camp.id, { ...camp, expectedDonors: parseInt(newExpected) });
            showToast('Camp updated!');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        // Generate a random temporary password
        const tempPassword = Math.random().toString(36).slice(-8);

        // Map the FE role to Backend role
        const roleMap = {
            'admin': 'ADMIN',
            'donor': 'DONOR',
            'staff': 'STAFF',
            'hospital': 'HOSPITAL'
        };
        const backendRole = roleMap[newUser.role] || 'HOSPITAL';

        const userData = {
            name: newUser.name,
            email: newUser.email,
            password: tempPassword,
            role: backendRole
        };

        try {
            const response = await createUser(userData);

            if (response.ok) {
                // Success Modal with Credentials
                await Swal.fire({
                    title: 'Account Provisioned!',
                    html: `
                        <div class="text-start border rounded-3 p-3 bg-light position-relative">
                            <div class="mb-2 pe-1"><strong>Email:</strong> ${newUser.email}</div>
                            <div class="mb-2 pe-1"><strong>Temporal Password:</strong> <code id="temp-password" style="font-size: 1.25rem;">${tempPassword}</code></div>
                            <button onclick="navigator.clipboard.writeText('${tempPassword}'); this.innerText='Copied!'; setTimeout(() => this.innerText='Copy', 2000);" 
                                    class="btn btn-sm btn-outline-primary position-absolute top-0 end-0 m-3">
                                Copy
                            </button>
                            <div class="small text-danger mt-3">
                                <i class="bi bi-exclamation-triangle-fill me-1"></i>
                                Please share these credentials securely with the user.
                            </div>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'I have copied the password'
                });

                setShowAddUserForm(false);
                setNewUser({ name: '', email: '', role: 'hospital', hospital: '' });
                // We should manually add the user to the list for UI update since we don't have a list from backend yet
                setSystemUsers(prev => [...prev, {
                    id: `USR${Math.floor(Math.random() * 1000)}`,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    hospital: newUser.hospital,
                    status: 'active',
                    lastLogin: 'Never'
                }]);
            } else {
                const errorText = await response.text();
                let errMsg = errorText;
                try {
                    const json = JSON.parse(errorText);
                    if (json.error) errMsg = json.error;
                    else if (json.message) errMsg = json.message;
                } catch(e) {}
                showError('Provisioning Failed', errMsg || 'Could not create user account.');
            }
        } catch (error) {
            showError('Network Error', 'Could not connect to authentication service.');
        }
    };

    const handleToggleUserStatus = (userId, currentStatus) => {
        setSystemUsers(users => users.map(u =>
            u.id === userId ? { ...u, status: currentStatus === 'active' ? 'inactive' : 'active' } : u
        ));
    };

    const handleDeleteUser = async (userId) => {
        const result = await showConfirm('Delete User', 'Are you sure you want to delete this user?');
        if (result.isConfirmed) {
            setSystemUsers(users => users.filter(u => u.id !== userId));
            showToast('User deleted.');
        }
    };

    const handleApproveRequest = async (id, bloodGroup, units) => {
        const res = await updateRequestStatus(id, 'fulfilled');
        if (res && res.ok) {
            showSuccess('Request Approved', `Request ${id} approved. ${units} units of ${bloodGroup} dispatched.`);
        } else {
            const errorText = await res.text();
            let errMsg = errorText;
            try {
                const json = JSON.parse(errorText);
                if (json.message) errMsg = json.message;
                else if (json.error) errMsg = json.error;
            } catch(e) {}
            Swal.fire('Error', errMsg || 'Failed to approve request.', 'error');
        }
    };

    const handleRejectRequest = async (id) => {
        const result = await showConfirm('Reject Request', 'Reject this request?');
        if (result.isConfirmed) {
            const res = await updateRequestStatus(id, 'rejected');
            if (res && res.ok) {
                showToast('Request rejected.');
            } else {
                Swal.fire('Error', 'Failed to reject request.', 'error');
            }
        }
    };

    const getStatusColor = (status) => {
        // Helper for consistency if needed props down the line
        return status;
    };

    // --- RENDER ---
    return (
        <div className="d-flex min-vh-100 bg-light" style={{ marginTop: '0px' }}>

            <div className="d-none d-lg-block bg-white border-end" style={{ width: '260px', position: 'fixed', top: '73px', bottom: 0, overflowY: 'auto', zIndex: 1020 }}>
                <div className="p-3 border-bottom bg-light bg-opacity-50">
                    <h6 className="fw-bold text-secondary mb-0 text-uppercase small" style={{ letterSpacing: '1px' }}>Admin Menu</h6>
                </div>
                <div className="p-3">
                    <Nav className="flex-column gap-2">
                        {[
                            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                            { id: 'inventory', icon: BarChart3, label: 'Inventory' },
                            { id: 'testing', icon: FlaskConical, label: 'Blood Testing' },
                            { id: 'donors', icon: Users, label: 'Donor Verification' },
                            { id: 'camps', icon: Tent, label: 'Donation Camps' },
                            { id: 'users', icon: Settings, label: 'User Management' },
                            { id: 'reports', icon: FileText, label: 'Reports' },
                            { id: 'requests', icon: Phone, label: 'Requests' },
                        ].map(item => (
                            <Nav.Link
                                key={item.id}
                                active={activeTab === item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-secondary ${activeTab === item.id ? 'bg-danger bg-opacity-10 text-danger fw-bold shadow-sm' : 'hover-bg-light'}`}
                                style={{
                                    cursor: 'pointer',
                                    border: activeTab === item.id ? '1px solid #FECACA' : '1px solid transparent'
                                }}
                            >
                                <item.icon size={18} />
                                <span className="small fw-bold">{item.label}</span>
                                {item.id === 'requests' && hospitalRequests.filter(r => r.status === 'pending').length > 0 && (
                                    <Badge bg="danger" pill className="ms-auto" style={{ fontSize: '10px' }}>
                                        {hospitalRequests.filter(r => r.status === 'pending').length}
                                    </Badge>
                                )}
                            </Nav.Link>
                        ))}
                    </Nav>
                </div>

            </div>


            <div className="flex-grow-1" style={{ marginLeft: '260px' }}>
                <Container fluid className="p-4">

                    <div className="d-lg-none mb-4 d-flex justify-content-between align-items-center bg-white p-3 rounded-4 shadow-sm">
                        <h5 className="fw-bold text-danger mb-0">Admin Panel</h5>
                        <Badge bg="danger">ADMIN</Badge>
                    </div>

                    {activeTab === 'dashboard' && (
                        <AdminDashboard
                            stats={stats}
                            inventory={inventory}
                            hospitalRequests={hospitalRequests}
                            bloodTests={bloodTests}
                            donors={donors}
                            camps={camps}
                        />
                    )}

                    {activeTab === 'inventory' && (
                        <AdminInventory
                            inventory={inventory}
                            donors={donors}
                            showAddStockForm={showAddStockForm}
                            setShowAddStockForm={setShowAddStockForm}
                            newStock={newStock}
                            setNewStock={setNewStock}
                            handleSubmitStock={handleSubmitStock}
                            handleDeleteInventory={handleDeleteInventory}
                            handleEditInventory={handleEditInventory}
                        />
                    )}

                    {activeTab === 'testing' && (
                        <AdminTesting
                            bloodTests={bloodTests}
                            handleUpdateTestResult={handleUpdateTestResult}
                            handleApproveBloodBag={handleApproveBloodBag}
                            handleDiscardBloodBag={handleDiscardBloodBag}
                        />
                    )}

                    {activeTab === 'donors' && (
                        <AdminDonors
                            donorVerifications={donors}
                            handleVerifyDonor={handleVerifyDonor}
                        />
                    )}

                    {activeTab === 'camps' && (
                        <AdminCamps
                            camps={camps}
                            newCamp={newCamp}
                            setNewCamp={setNewCamp}
                            handleSubmitCamp={handleSubmitCamp}
                            handleDeleteCamp={handleDeleteCamp}
                            handleEditCamp={handleEditCamp}
                        />
                    )}

                    {activeTab === 'users' && (
                        <AdminUsers
                            systemUsers={systemUsers}
                            showAddUserForm={showAddUserForm}
                            setShowAddUserForm={setShowAddUserForm}
                            newUser={newUser}
                            setNewUser={setNewUser}
                            handleAddUser={handleAddUser}
                            handleToggleUserStatus={handleToggleUserStatus}
                            handleDeleteUser={handleDeleteUser}
                        />
                    )}

                    {activeTab === 'reports' && <AdminReports />}

                    {activeTab === 'requests' && (
                        <AdminRequests
                            hospitalRequests={hospitalRequests}
                            inventory={inventory}
                            handleApproveRequest={handleApproveRequest}
                            handleRejectRequest={handleRejectRequest}
                        />
                    )}
                </Container>
            </div>
        </div>
    );
}
