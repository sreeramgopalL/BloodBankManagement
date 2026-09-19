import { Award, Download } from 'lucide-react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { showToast } from '../../utils/swal';
import { useAuth } from '../../contexts/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function DonorCertificates() {
    const { user } = useAuth();
    const donorName = user?.name || 'Donor Name';

    const certificates = [
        {
            id: 'BBM2024091501',
            date: '2024-09-15',
            bloodGroup: 'O+',
            units: '450ml',
            location: 'Central Blood Bank'
        },
        {
            id: 'BBM2024061002',
            date: '2024-06-10',
            bloodGroup: 'O+',
            units: '450ml',
            location: 'City Hospital'
        },
        {
            id: 'BBM2024030503',
            date: '2024-03-05',
            bloodGroup: 'O+',
            units: '450ml',
            location: 'Community Camp'
        }
    ];

    const handleDownloadPDF = async (cert) => {
        showToast('Generating Certificate PDF...', 'info');
        const certificateContainer = document.createElement('div');
        
        // CSS for diagonal stripes
        const stripeStyle1 = "position: absolute; background-color: #8A151A; width: 1200px; height: 120px;";
        const stripeStyle2 = "position: absolute; background-color: #D62828; width: 1200px; height: 100px;";
        const stripeStyle3 = "position: absolute; background-color: #610F12; width: 1200px; height: 60px;";

        certificateContainer.innerHTML = `
            <div id="certificate-pdf-content" style="width: 1122px; height: 794px; background-color: #ffffff; position: relative; overflow: hidden; font-family: 'Arial', sans-serif;">
                <!-- Top Left Stripes -->
                <div style="${stripeStyle1} top: -200px; left: -400px; transform: rotate(-45deg);"></div>
                <div style="${stripeStyle2} top: -100px; left: -400px; transform: rotate(-45deg);"></div>
                <div style="${stripeStyle3} top: -250px; left: -400px; transform: rotate(-45deg);"></div>

                <!-- Bottom Right Stripes -->
                <div style="${stripeStyle1} bottom: -200px; right: -400px; transform: rotate(-45deg);"></div>
                <div style="${stripeStyle2} bottom: -100px; right: -400px; transform: rotate(-45deg);"></div>
                <div style="${stripeStyle3} bottom: -250px; right: -400px; transform: rotate(-45deg);"></div>

                <!-- Main Content -->
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; z-index: 10;">
                    <div style="margin-top: -50px;">
                        <h1 style="color: #610F12; font-size: 56px; font-weight: 900; margin: 0; font-family: Impact, sans-serif; letter-spacing: 1px;">BLOOD DONATION</h1>
                        <h2 style="color: #610F12; font-size: 52px; font-weight: 400; margin: 10px 0 50px 0; letter-spacing: 2px;">CERTIFICATE</h2>
                    </div>

                    <p style="font-size: 22px; color: #111; margin: 0 0 30px 0;">This certificate is awarded to</p>

                    <h3 style="color: #610F12; font-size: 72px; font-weight: 900; margin: 0; padding-bottom: 10px; border-bottom: 2px solid #610F12; min-width: 600px; display: inline-block;">
                        ${donorName}
                    </h3>

                    <p style="font-size: 20px; color: #222; margin: 40px 0 40px 0; max-width: 800px; line-height: 1.5;">
                        to honor their selfless act of donating blood, which has helped save lives and bring hope to those in need.
                    </p>

                    <p style="font-size: 24px; color: #610F12; font-weight: bold; margin: 0;">
                        Given on this day, ${new Date(cert.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
                    </p>
                </div>

                <!-- Seal Graphic -->
                <div style="position: absolute; bottom: 80px; left: 100px; width: 160px; height: 160px; z-index: 5;">
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Ribbons -->
                        <path d="M70 140 L50 200 L80 180 L100 200 Z" fill="#610F12"/>
                        <path d="M130 140 L150 200 L120 180 L100 200 Z" fill="#8A151A"/>
                        <!-- Seal Edge -->
                        <path d="M100 20 L115 35 L135 30 L145 50 L165 55 L160 75 L180 90 L165 105 L175 125 L155 135 L150 155 L130 155 L115 170 L100 155 L85 170 L70 155 L50 155 L45 135 L25 125 L35 105 L20 90 L40 75 L35 55 L55 50 L65 30 L85 35 Z" fill="#D62828"/>
                        <!-- Inner Gold -->
                        <circle cx="100" cy="95" r="50" fill="#E3B34C" stroke="#C49A45" stroke-width="4"/>
                        <circle cx="100" cy="95" r="40" fill="transparent" stroke="#B08A3B" stroke-width="1" stroke-dasharray="4 4"/>
                    </svg>
                </div>

                <!-- Signature -->
                <div style="position: absolute; bottom: 90px; right: 150px; text-align: center; color: #610F12; z-index: 5;">
                    <p style="margin: 0; font-size: 20px;">Lyda Fadel</p>
                    <p style="margin: 5px 0; font-size: 18px;">Director, Blood Services</p>
                    <p style="margin: 0; font-size: 18px;">Lifeline Center</p>
                </div>
            </div>
        `;
        
        // Hide container but keep it in document so html2canvas can read it
        certificateContainer.style.position = 'absolute';
        certificateContainer.style.top = '-9999px';
        certificateContainer.style.left = '-9999px';
        document.body.appendChild(certificateContainer);

        try {
            const element = document.getElementById('certificate-pdf-content');
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            
            // A4 size: 297mm x 210mm (landscape)
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Blood_Donation_Certificate_${cert.id}.pdf`);
            showToast('Certificate downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error generating PDF', error);
            showToast('Failed to generate PDF', 'error');
        } finally {
            document.body.removeChild(certificateContainer);
        }
    };

    return (
        <div>
            <h5 className="fw-bold mb-4">Donation Certificates</h5>

            <Row className="g-4">
                {certificates.map(cert => (
                    <Col md={6} key={cert.id}>
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                            <Card.Body className="p-4 position-relative">
                                <div className="position-absolute top-0 end-0 bg-danger bg-opacity-10 rounded-bottom-start-pill" style={{ width: '80px', height: '80px' }}></div>

                                <div className="d-flex justify-content-between align-items-start mb-4 position-relative">
                                    <div className="bg-danger bg-opacity-10 p-2 rounded">
                                        <Award className="text-danger" size={24} />
                                    </div>
                                    <small className="text-muted">#{cert.id}</small>
                                </div>

                                <h6 className="fw-bold mb-3">Blood Donation Certificate</h6>

                                <div className="small text-secondary space-y-2 mb-4">
                                    <div className="d-flex justify-content-between">
                                        <span>Donation Date:</span>
                                        <span className="text-dark fw-medium">{cert.date}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Blood Group:</span>
                                        <span className="text-dark fw-medium">{cert.bloodGroup}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Units:</span>
                                        <span className="text-dark fw-medium">{cert.units}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span>Location:</span>
                                        <span className="text-dark fw-medium">{cert.location}</span>
                                    </div>
                                </div>

                                <Button
                                    variant="danger"
                                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => handleDownloadPDF(cert)}
                                >
                                    <Download size={16} /> Download Certificate
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
