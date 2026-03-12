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
            doc.fontSize(16).fillColor('#111827').text('Student Performance Overview', { underline: true });
            doc.moveDown();

            // Table Header
            const startX = 50;
            let currentY = doc.y;
            doc.fontSize(10).fillColor('#374151').font('Helvetica-Bold');
            doc.text('#', startX, currentY);
            doc.text('Student', startX + 30, currentY);
            doc.text('Batch', startX + 180, currentY);
            doc.text('Avg Perf.', startX + 300, currentY);
            doc.text('Quizzes', startX + 380, currentY);
            
            doc.moveTo(startX, currentY + 15).lineTo(550, currentY + 15).strokeColor('#e5e7eb').stroke();
            currentY += 25;
            doc.font('Helvetica');

            let count = 1;
            for (let student of students) {
                const attempts = await QuizAttempt.find({ studentId: student._id });
                const avgScore = attempts.length > 0
                    ? (attempts.reduce((acc, curr) => {
                        const ratio = curr.totalQuestions > 0 ? (curr.score / curr.totalQuestions) : 0;
                        return acc + Math.min(1, ratio);
                    }, 0) / attempts.length * 100).toFixed(1)
                    : 'N/A';

                doc.fontSize(9).fillColor('#4b5563');
                doc.text(`${count}.`, startX, currentY);
                doc.fillColor('#111827').text(student.name, startX + 30, currentY);
                doc.fillColor('#6b7280').fontSize(8).text(student.email, startX + 30, currentY + 10);
                
                doc.fontSize(9).fillColor('#4b5563');
                doc.text(student.batchYear || 'N/A', startX + 180, currentY);
                doc.text(`${avgScore}%`, startX + 300, currentY);
                doc.text(attempts.length.toString(), startX + 380, currentY);

                doc.moveTo(startX, currentY + 25).lineTo(550, currentY + 25).strokeColor('#f3f4f6').stroke();
                currentY += 35;
                count++;

                if (currentY > 700) {
                    doc.addPage();
                    currentY = 50;
                }
            }
        }
        else if (type === 'quiz-analytics') {
            const topicStats = await QuizAttempt.aggregate([
                {
                    $group: {
                        _id: "$topic",
                        count: { $sum: 1 },
                        avgScore: { 
                            $avg: { 
                                $min: [
                                    1,
                                    { $divide: ["$score", { $cond: [{ $eq: ["$totalQuestions", 0] }, 1, "$totalQuestions"] }] }
                                ]
                            }
                        }
                    }
                },
                { $sort: { avgScore: -1 } }
            ]);

            doc.fontSize(16).fillColor('#111827').text('Quiz Analytics Summary', { underline: true });
            doc.moveDown();

            const startX = 50;
            let currentY = doc.y;
            doc.fontSize(10).fillColor('#374151').font('Helvetica-Bold');
            doc.text('#', startX, currentY);
            doc.text('Topic', startX + 30, currentY);
            doc.text('Attempts', startX + 250, currentY);
            doc.text('Avg Proficiency', startX + 350, currentY);
            
            doc.moveTo(startX, currentY + 15).lineTo(550, currentY + 15).strokeColor('#e5e7eb').stroke();
            currentY += 25;
            doc.font('Helvetica');

            topicStats.forEach((stat, index) => {
                doc.fontSize(9).fillColor('#4b5563');
                doc.text(`${index + 1}.`, startX, currentY);
                doc.fillColor('#111827').text(stat._id || 'General', startX + 30, currentY);
                doc.text(stat.count.toString(), startX + 250, currentY);
                doc.text(`${(stat.avgScore * 100).toFixed(1)}%`, startX + 350, currentY);

                doc.moveTo(startX, currentY + 20).lineTo(550, currentY + 20).strokeColor('#f3f4f6').stroke();
                currentY += 25;
            });
        }
        else if (type === 'placement-jobs') {
            const jobs = await require('../models/Job').find({}).sort({ createdAt: -1 });
            doc.fontSize(16).fillColor('#111827').text('Placement & Jobs Activity Report', { underline: true });
            doc.moveDown();

            const startX = 50;
            let currentY = doc.y;
            doc.fontSize(10).fillColor('#374151').font('Helvetica-Bold');
            doc.text('#', startX, currentY);
            doc.text('Position & Company', startX + 30, currentY);
            doc.text('Location', startX + 280, currentY);
            doc.text('Salary', startX + 420, currentY);
            
            doc.moveTo(startX, currentY + 15).lineTo(550, currentY + 15).strokeColor('#e5e7eb').stroke();
            currentY += 25;
            doc.font('Helvetica');

            jobs.forEach((job, index) => {
                doc.fontSize(9).fillColor('#4b5563').text(`${index + 1}.`, startX, currentY);
                doc.fillColor('#111827').text(job.title, startX + 30, currentY);
                doc.fillColor('#6b7280').fontSize(8).text(job.company, startX + 30, currentY + 10);
                
                doc.fontSize(9).fillColor('#4b5563');
                doc.text(job.location || 'Remote', startX + 280, currentY);
                doc.text(job.salaryRange || 'N/A', startX + 420, currentY);

                doc.moveTo(startX, currentY + 25).lineTo(550, currentY + 25).strokeColor('#f3f4f6').stroke();
                currentY += 35;
            });
        }
        else if (type === 'community-engagement') {
            const posts = await require('../models/Post').find({}).populate('author', 'name').sort({ createdAt: -1 });
            doc.fontSize(16).fillColor('#111827').text('Community Engagement Analysis', { underline: true });
            doc.moveDown();

            const startX = 50;
            let currentY = doc.y;
            doc.fontSize(10).fillColor('#374151').font('Helvetica-Bold');
            doc.text('#', startX, currentY);
            doc.text('Author & Excerpt', startX + 30, currentY);
            doc.text('Likes', startX + 350, currentY);
            doc.text('Comments', startX + 430, currentY);
            
            doc.moveTo(startX, currentY + 15).lineTo(550, currentY + 15).strokeColor('#e5e7eb').stroke();
            currentY += 25;
            doc.font('Helvetica');

            posts.slice(0, 30).forEach((post, index) => {
                doc.fontSize(9).fillColor('#4b5563').text(`${index + 1}.`, startX, currentY);
                doc.fillColor('#111827').text(post.author?.name || 'Anonymous', startX + 30, currentY);
                const excerpt = post.content.substring(0, 60).replace(/\n/g, ' ') + '...';
                doc.fillColor('#6b7280').fontSize(8).text(excerpt, startX + 30, currentY + 10);
                
                doc.fontSize(9).fillColor('#4b5563');
                doc.text((post.likes?.length || 0).toString(), startX + 350, currentY);
                doc.text((post.comments?.length || 0).toString(), startX + 430, currentY);

                doc.moveTo(startX, currentY + 25).lineTo(550, currentY + 25).strokeColor('#f3f4f6').stroke();
                currentY += 35;
            });
        }
        else {
            doc.text('Data aggregation for this report type is currently under maintenance.');
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
