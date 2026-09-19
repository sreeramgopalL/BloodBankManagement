import { Star, Heart, Droplet } from 'lucide-react';
import { Card, Badge, Row, Col } from 'react-bootstrap';

export function DonorReviews() {
    const reviews = [
        {
            id: 1,
            name: 'Sarah Johnson',
            hospital: 'City Hospital',
            date: '2024-09-20',
            text: 'Thank you so much for your donation! Your blood helped save my life during a critical surgery. I am forever grateful.',
            bloodGroup: 'O+',
            rating: 5
        },
        {
            id: 2,
            name: 'Michael Chen',
            hospital: 'Regional Hospital',
            date: '2024-06-15',
            text: 'Your generous donation helped me during my emergency treatment. Thank you for being a hero!',
            bloodGroup: 'O+',
            rating: 5
        },
        {
            id: 3,
            name: 'Emily Davis',
            hospital: 'Community Hospital',
            date: '2024-03-10',
            text: 'Words cannot express my gratitude. Your selfless act gave me a second chance at life.',
            bloodGroup: 'O+',
            rating: 5
        }
    ];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Reviews from Recipients</h5>
                <div className="d-flex align-items-center gap-1 text-warning">
                    <Star size={20} fill="#ffc107" />
                    <span className="fw-bold text-dark">5.0</span>
                    <small className="text-muted">(3 reviews)</small>
                </div>
            </div>

            <div className="d-flex flex-column gap-3">
                {reviews.map(review => (
                    <Card key={review.id} className="border-0 shadow-sm rounded-4">
                        <Card.Body className="p-4">
                            <div className="d-flex gap-3">
                                <div className="bg-danger bg-opacity-10 p-3 rounded-circle" style={{ width: 'fit-content', height: 'fit-content' }}>
                                    <Heart className="text-danger" size={20} />
                                </div>
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h6 className="fw-bold mb-0">{review.name}</h6>
                                            <small className="text-muted">{review.hospital}</small>
                                        </div>
                                        <div className="text-end">
                                            <div className="d-flex gap-1 text-warning mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} fill={i < review.rating ? "#ffc107" : "none"} />
                                                ))}
                                            </div>
                                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>{review.date}</small>
                                        </div>
                                    </div>

                                    <p className="text-secondary small my-3">
                                        "{review.text}"
                                    </p>

                                    <div className="d-flex align-items-center gap-1 small text-muted">
                                        <Droplet size={14} className="text-danger" />
                                        Blood Group: {review.bloodGroup}
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
}
