import React from 'react';
import { Award, Trophy, Medal, Star, Heart, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, Badge, Button } from 'react-bootstrap';

const topDonors = [
    {
        id: '1',
        name: 'Rajan raikhy',
        image: 'https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHNtaWxpbmd8ZW58MXx8fHwxNzY5NDM1MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
        donations: 48,
        bloodGroup: 'O+',
        livesSaved: 144,
        rank: 1,
        badge: 'platinum'
    },
    {
        id: '2',
        name: 'Hussian khan',
        donations: 42,
        bloodGroup: 'A+',
        livesSaved: 126,
        rank: 2,
        badge: 'gold'
    },
    {
        id: '3',
        name: 'Visvhwesh',
        donations: 38,
        bloodGroup: 'B+',
        livesSaved: 114,
        rank: 3,
        badge: 'gold'
    },
    {
        id: '4',
        name: 'adi keshav',
        donations: 35,
        bloodGroup: 'AB+',
        livesSaved: 105,
        rank: 4,
        badge: 'silver'
    },
    {
        id: '5',
        name: 'prakash',
        donations: 32,
        bloodGroup: 'O-',
        livesSaved: 96,
        rank: 5,
        badge: 'silver'
    }
];

const getBadgeVariant = (badge) => {
    switch (badge) {
        case 'platinum': return 'light'; // Bootstrap doesn't have metallic colors by default, mapped to closest
        case 'gold': return 'warning';
        case 'silver': return 'secondary';
        case 'bronze': return 'danger'; // fallback
        default: return 'light';
    }
};

const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="text-warning" size={20} />;
    if (rank === 2) return <Medal className="text-secondary" size={20} />;
    if (rank === 3) return <Medal className="text-danger" size={20} />; // orange -> danger/warning mix usually, using danger
    return <Award className="text-primary" size={20} />;
};

export function TopDonorList() {
    return (
        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
            <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <Card.Title className="fw-bold d-flex align-items-center gap-2 mb-1">
                            <Trophy className="text-warning" size={24} /> Top Donors
                        </Card.Title>
                        <Card.Subtitle className="text-muted small">Community leaders saving lives</Card.Subtitle>
                    </div>
                    <Badge bg="danger" pill className="px-3 py-2">Leaderboard</Badge>
                </div>

                <div className="d-flex flex-column gap-3">
                    {topDonors.map((donor, index) => (
                        <motion.div
                            key={donor.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="d-flex align-items-center gap-3 p-3 border rounded-3 hover-shadow-sm transition-all" style={{ backgroundColor: '#fff' }}>
                                <div className="position-relative">
                                    <div className="rounded-circle overflow-hidden border border-2 border-white shadow-sm" style={{ width: '56px', height: '56px' }}>
                                        <img src={donor.image} alt={donor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="position-absolute top-0 end-0 bg-white rounded-circle p-1 shadow-sm border" style={{ transform: 'translate(25%, -25%)' }}>
                                        {getRankIcon(donor.rank)}
                                    </div>
                                </div>

                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <h6 className="fw-bold mb-0 text-dark">{donor.name}</h6>
                                        <Badge bg={getBadgeVariant(donor.badge)} pill className="text-uppercase small" style={{ fontSize: '0.65rem' }}>{donor.badge}</Badge>
                                    </div>
                                    <div className="d-flex gap-3 small text-secondary">
                                        <div className="d-flex align-items-center gap-1">
                                            <Heart size={12} className="text-danger" /> {donor.donations}
                                        </div>
                                        <div className="d-flex align-items-center gap-1">
                                            <TrendingUp size={12} className="text-success" /> {donor.livesSaved} Lives
                                        </div>
                                        <span className="fw-bold text-danger">{donor.bloodGroup}</span>
                                    </div>
                                </div>

                                <div className="fs-3 fw-bold text-light text-end" style={{ color: '#f8f9fa' }}>
                                    #{donor.rank}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <Button variant="link" className="w-100 text-decoration-none text-secondary mt-3 border-top pt-3">
                    View Full Leaderboard
                </Button>
            </Card.Body>
        </Card>
    );
}
