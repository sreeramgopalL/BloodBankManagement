import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Calendar, Star, Award } from 'lucide-react';
import { DonorDashboard, DonorAppointments, DonorReviews, DonorCertificates } from '@/app/components/donor';
import { Container, Nav, Button } from 'react-bootstrap';

export function DonorPortal() {
    const [activeTab, setActiveTab] = useState('details');
    const { user, logout } = useAuth();

    const tabs = [
        { id: 'details', label: 'My Details', icon: User, component: DonorDashboard },
        { id: 'appointments', label: 'Appointments', icon: Calendar, component: DonorAppointments },
        { id: 'reviews', label: 'Reviews', icon: Star, component: DonorReviews },
        { id: 'certificates', label: 'Certificates', icon: Award, component: DonorCertificates },
    ];

    return (
        <Container className="py-4">
           

           
            <div className="border-bottom mb-4">
                <Nav variant="underline" className="gap-4">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <Nav.Item key={tab.id}>
                                <Nav.Link
                                    active={isActive}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`d-flex align-items-center gap-2 py-3 px-3 rounded-top-3 border-2 ${isActive ? 'bg-danger bg-opacity-10 text-danger fw-bold border-bottom-0' : 'border-transparent text-secondary'}`}
                                    style={{
                                        marginBottom: '-2px',
                                        border: isActive ? '1px solid #FECACA' : '1px solid transparent',
                                        borderBottom: isActive ? 'none' : 'transparent'
                                    }}
                                >
                                    <Icon size={16} className={isActive ? 'text-danger' : 'text-secondary'} />
                                    {tab.label}
                                </Nav.Link>
                            </Nav.Item>
                        );
                    })}
                </Nav>
            </div>

            
            <div style={{ minHeight: '400px' }}>
                {activeTab === 'details' && <DonorDashboard />}
                {activeTab === 'appointments' && <DonorAppointments />}
                {activeTab === 'reviews' && <DonorReviews />}
                {activeTab === 'certificates' && <DonorCertificates />}
            </div>
        </Container>
    );
}
