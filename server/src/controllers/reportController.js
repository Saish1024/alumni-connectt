const PDFDocument = require('pdfkit');
const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const Event = require('../models/Event');

exports.downloadReportByType = async (req, res) => {
    try {
        const { type } = req.params;
        const doc = new PDFDocument({ margin: 50 });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${type}_report.pdf`);

        doc.pipe(res);

        // Header
        doc.fillColor('#10b981').fontSize(20).text('Alumni Connect - Faculty Report', { align: 'center' });
        doc.moveDown();
        doc.fillColor('#444444').fontSize(12).text(`Report Type: ${type.replace(/-/g, ' ').toUpperCase()}`, { align: 'center' });
        doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
        doc.moveDown(2);

        if (type === 'student-performance') {
            const students = await User.find({ role: 'student' }).select('name email major batchYear');
            doc.fontSize(16).text('Student Performance Overview', { underline: true });
            doc.moveDown();

            for (let student of students) {
                const attempts = await QuizAttempt.find({ studentId: student._id });
                const avgScore = attempts.length > 0
                    ? (attempts.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0) / attempts.length * 100).toFixed(1)
                    : 'N/A';

                doc.fontSize(12).fillColor('#333').text(`${student.name} (${student.major})`);
                doc.fontSize(10).fillColor('#666').text(`Email: ${student.email} | Batch: ${student.batchYear}`);
                doc.text(`Avg Quiz Performance: ${avgScore}% | Total Quizzes: ${attempts.length}`);
                doc.moveDown(0.5);
            }
        }
        else if (type === 'quiz-analytics') {
            const topicStats = await QuizAttempt.aggregate([
                {
                    $group: {
                        _id: "$topic",
                        count: { $sum: 1 },
                        avgScore: { $avg: { $divide: ["$score", "$totalQuestions"] } }
                    }
                }
            ]);

            doc.fontSize(16).text('Quiz Analytics Summary', { underline: true });
            doc.moveDown();

            topicStats.forEach(stat => {
                doc.fontSize(12).fillColor('#333').text(`Topic: ${stat._id}`);
                doc.fontSize(10).fillColor('#666').text(`Total Attempts: ${stat.count}`);
                doc.text(`Average Proficiency: ${(stat.avgScore * 100).toFixed(1)}%`);
                doc.moveDown(0.5);
            });
        }
        else if (type === 'mentoring-summary') {
            const sessions = await Event.find({ type: 'session' }).populate('organizer', 'name').populate('attendees', 'name');
            doc.fontSize(16).text('Mentoring Sessions Summary', { underline: true });
            doc.moveDown();

            sessions.forEach(session => {
                doc.fontSize(12).fillColor('#333').text(`${session.title}`);
                doc.fontSize(10).fillColor('#666').text(`Mentor: ${session.organizer?.name || 'N/A'} | Attendees: ${session.attendees.length}`);
                doc.text(`Status: ${session.status.toUpperCase()} | Date: ${session.date}`);
                doc.moveDown(0.5);
            });
        }
        else {
            doc.text('Data aggregation for this report type is coming soon.');
        }

        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF report' });
    }
};

exports.generateCustomReport = async (req, res) => {
    // Custom logic can be added here based on req.body filters
    // For now, let's reuse the logic or provide a placeholder
    return exports.downloadReportByType(req, res);
};
