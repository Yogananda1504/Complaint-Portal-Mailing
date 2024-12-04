/**
 * @module ComplaintPortalMailing
 * @description This module handles the scheduling and sending of reminder emails for unresolved complaints.
 */

import AcademicComplaint from './models/AcademicComplaint.js';
import AdministrationComplaint from './models/AdministrationComplaint.js';
import HostelComplaint from './models/HostelComplaint.js';
import InfrastructureComplaint from './models/InfrastructureComplaint.js';
import MedicalComplaint from './models/MedicalComplaint.js';
import RaggingComplaint from './models/RaggingComplaint.js';
import cron from "node-cron";
import { getAuthority } from './getAuthority.js';
import transporter from "./transporter.js";
import express from "express";
import helmet from "helmet";
import Queue from "bull";
import connectToDB from "./config/connectDB.js";
import dotenv from "dotenv";
import logger from './utils/logger.js';

dotenv.config();
const app = express();
app.use(helmet());

connectToDB();

const complaintCollections = [
    { model: AcademicComplaint, name: "Academic Complaint" },
    { model: AdministrationComplaint, name: "Administration Complaint" },
    { model: HostelComplaint, name: "Hostel Complaint" },
    { model: InfrastructureComplaint, name: "Infrastructure Complaint" },
    { model: MedicalComplaint, name: "Medical Complaint" },
    { model: RaggingComplaint, name: "Ragging Complaint" },
];

// Create the email queue using Redis
const emailQueue = new Queue("emailQueue", {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    },
});

/**
 * Email processor function
 * @param {Object} job - The job object containing email data.
 * @param {string} job.data.email - The recipient's email address.
 * @param {string} job.data.subject - The email subject.
 * @param {string} job.data.html - The HTML content of the email.
 * @param {string} job.data.text - The plain text content of the email.
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 */
const processor = async (job) => {
    const { email, subject, html, text } = job.data;
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            html,
            text,
        });
        logger.info(`Email sent to ${email}`);
    } catch (err) {
        logger.error("Error sending email:", err);
        throw new Error("Email sending failed"); // Retry on failure
    }
};

// Register the processor
emailQueue.process(processor);

// Retry on failure with exponential backoff
emailQueue.on("failed", (job, err) => {
    logger.error(`Job failed for ${job.data.email}. Error: ${err.message}`);
});

/**
 * Checks for unresolved complaints older than fifteen days and queues reminder emails.
 * 
 * This function iterates over each complaint collection, finds unresolved complaints
 * that were created more than fifteen days ago, and queues reminder emails to the 
 * respective authorities. Each email job is added to the email queue with retry settings.
 * 
 * @async
 * @function checkComplaintsAndQueueEmails
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const checkComplaintsAndQueueEmails = async () => {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 1);

    for (const { model, name } of complaintCollections) {
        const unresolvedComplaints = await model.find({
            status: "Pending",
            createdAt: { $lte: fifteenDaysAgo },
        });

        unresolvedComplaints.forEach((complaint) => {
            const emailData = {
                email: getAuthority(name),
                subject: `Reminder: Unresolved ${name}`,
                text: `
                    Dear Authority,

                    This is a reminder about the unresolved complaint:

                    - Student Name: ${complaint.studentName}
                    - Scholar Number: ${complaint.scholarNumber}
                    - Category: ${name}, ${complaint.complainType}
                    - Description: ${complaint.complainDescription}
                    - Filed On: ${complaint.createdAt}
                    

                    Please address this complaint at the earliest.Orelse higher authorities will be informed about the same.
                `,
                html: `
                    <p>Dear Authority,</p>
                    <p>This is a reminder about the unresolved complaint:</p>
                    <ul>
                        <li><strong>Student Name:</strong> ${complaint.studentName}</li>
                        <li><strong>Scholar Number:</strong> ${complaint.scholarNumber}</li>
                        <li><strong>Category:</strong> ${name}, ${complaint.complainType}</li>
                        <li><strong>Description:</strong> ${complaint.complainDescription}</li>
                        <li><strong>Filed On:</strong> ${complaint.createdAt}</li>
                        <li><strong>Complaint Id:</strong> ${complaint._id}</li>
                    </ul>
                    <p>Please address this complaint at the earliest.Orelse higher authorities will be informed about the same.</p>
                `,
            };

            // Add job to the queue with retry settings
            emailQueue.add(emailData, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 5000 },
            });
        });

        logger.info(`${unresolvedComplaints.length} ${name}s added to the email queue.`);
    }
};

// Schedule the cron job
cron.schedule("* * * * *", checkComplaintsAndQueueEmails);
