const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generateCertificatePDF(cert, student, company) {
  return new Promise((resolve, reject) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const filename = `cert-${cert._id}-${Date.now()}.pdf`;
    const filepath = path.join(uploadsDir, filename);
    const doc = new PDFDocument({ size: 'A4', margin: 60 });

    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // Background color
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#F8F9FB');

    // Border
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .lineWidth(3)
      .stroke('#185FA5');

    doc.rect(38, 38, doc.page.width - 76, doc.page.height - 76)
      .lineWidth(1)
      .stroke('#1D9E75');

    // Title
    doc.fillColor('#185FA5')
      .font('Helvetica-Bold')
      .fontSize(28)
      .text('CERTIFICATE OF INTERNSHIP', 0, 100, { align: 'center' });

    doc.fillColor('#6B7280')
      .font('Helvetica')
      .fontSize(13)
      .text('This is to certify that', 0, 155, { align: 'center' });

    // Student name
    doc.fillColor('#1A1A2E')
      .font('Helvetica-Bold')
      .fontSize(24)
      .text(student?.name || 'Student Name', 0, 185, { align: 'center' });

    // Divider
    doc.moveTo(150, 225).lineTo(doc.page.width - 150, 225).stroke('#185FA5');

    doc.fillColor('#6B7280')
      .font('Helvetica')
      .fontSize(13)
      .text('has successfully completed an internship as', 0, 240, { align: 'center' });

    doc.fillColor('#534AB7')
      .font('Helvetica-Bold')
      .fontSize(18)
      .text(cert.role || 'Intern', 0, 265, { align: 'center' });

    doc.fillColor('#6B7280')
      .font('Helvetica')
      .fontSize(13)
      .text('at', 0, 300, { align: 'center' });

    doc.fillColor('#1D9E75')
      .font('Helvetica-Bold')
      .fontSize(20)
      .text(company?.name || 'Company Name', 0, 320, { align: 'center' });

    // Period
    if (cert.internshipPeriod?.from && cert.internshipPeriod?.to) {
      const from = new Date(cert.internshipPeriod.from).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      const to = new Date(cert.internshipPeriod.to).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      doc.fillColor('#6B7280')
        .font('Helvetica')
        .fontSize(13)
        .text(`Duration: ${from} – ${to}`, 0, 360, { align: 'center' });
    }

    // Branch and verification
    doc.fillColor('#6B7280')
      .font('Helvetica')
      .fontSize(11)
      .text(`Branch: ${student?.branch || 'N/A'}`, 60, 430);

    doc.fillColor('#6B7280')
      .font('Helvetica')
      .fontSize(11)
      .text(`Issued on: ${new Date(cert.issuedAt).toLocaleDateString('en-IN')}`, 60, 450);

    doc.fillColor('#6B7280')
      .font('Helvetica')
      .fontSize(11)
      .text(`Verification Code: ${cert.verificationCode}`, 60, 470);

    // Signature line
    doc.moveTo(doc.page.width - 220, 480).lineTo(doc.page.width - 70, 480).stroke('#1A1A2E');
    doc.fillColor('#1A1A2E')
      .font('Helvetica')
      .fontSize(10)
      .text('Authorized Signature', doc.page.width - 230, 490, { width: 180, align: 'center' });

    // Footer
    doc.fillColor('#185FA5')
      .font('Helvetica-Bold')
      .fontSize(10)
      .text('CampusConnect — Campus Placement Portal', 0, doc.page.height - 60, { align: 'center' });

    doc.end();

    stream.on('finish', () => resolve(`/uploads/${filename}`));
    stream.on('error', reject);
  });
}

module.exports = { generateCertificatePDF };
