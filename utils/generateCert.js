const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateCertificate = async (studentName, companyName, certificateId, verificationCode) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `certificate_${certificateId}_${Date.now()}.pdf`;
      const filePath = path.join(__dirname, '../uploads', fileName);

      const doc = new PDFDocument({
        size: [850, 600],
        margin: 50,
      });

      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Certificate border
      doc.rect(30, 30, 790, 540).stroke();
      doc.rect(35, 35, 780, 530).stroke();

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('Certificate of Completion', {
        align: 'center',
        y: 100,
      });

      // Body text
      doc.fontSize(12).font('Helvetica').text('This is to certify that', {
        align: 'center',
        y: 160,
      });

      doc.fontSize(18).font('Helvetica-Bold').text(studentName, {
        align: 'center',
        y: 200,
      });

      doc.fontSize(12).font('Helvetica').text('has successfully completed an internship with', {
        align: 'center',
        y: 260,
      });

      doc.fontSize(18).font('Helvetica-Bold').text(companyName, {
        align: 'center',
        y: 300,
      });

      // Signature area
      doc.fontSize(10).font('Helvetica').text('_______________________', {
        align: 'center',
        y: 400,
      });

      doc.fontSize(10).font('Helvetica').text('Authorized Signature', {
        align: 'center',
        y: 415,
      });

      // Verification code
      doc.fontSize(8).font('Helvetica').text(`Verification Code: ${verificationCode}`, {
        align: 'center',
        y: 500,
      });

      doc.fontSize(8).font('Helvetica').text(`Certificate ID: ${certificateId}`, {
        align: 'center',
        y: 515,
      });

      // Date
      doc.fontSize(8).font('Helvetica').text(`Issued on: ${new Date().toLocaleDateString()}`, {
        align: 'center',
        y: 530,
      });

      doc.end();

      stream.on('finish', () => {
        resolve(`/uploads/${fileName}`);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateCertificate,
};
