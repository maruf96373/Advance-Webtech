import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,  // Use environment variable for email
        pass: process.env.MAIL_PASS,  // Use environment variable for app password
      },
    });
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

    const mailOptions = {
      from: '"Event Management" <your-email@gmail.com>',  // Your app's email here
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send reset email to ${email}`, error.stack);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendPasswordResetSuccess(email: string, name: string): Promise<void> {
    const mailOptions = {
      from: '"Event Management" <your-email@gmail.com>',
      to: email,
      subject: 'Password Reset Successful',
      html: `
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your password has been <b>successfully reset</b>.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset success email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send success email to ${email}`, error.stack);
      throw new Error('Failed to send password reset success email');
    }
  }

  async sendRegistrationSuccess(email: string, name: string): Promise<void> {
    const mailOptions = {
      from: '"Event Management" <your-email@gmail.com>',
      to: email,
      subject: 'Registration Successful',
      html: `
        <h3>Hello ${name},</h3>
        <p>Congratulations! Your registration was successful in <strong>Event Management Web Application</strong>.</p>
        <p>You can now log in and explore the features of our platform.</p>
        <br/>
        <p>Thank you,</p>
        <p>Event Management Team</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Registration success email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send registration email to ${email}`, error.stack);
      throw new Error('Failed to send registration success email');
    }
  }
}
