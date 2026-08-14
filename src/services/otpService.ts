/**
 * Real-Time OTP & SMS Verification Service
 * Handles cryptographic random OTP generation, session storage, rate-limiting,
 * browser push notification delivery, and real Physical SMS Gateway dispatch.
 */

import { smsGatewayService } from './smsGatewayService';

export interface OtpSessionData {
  phone: string;
  code: string;
  generatedAt: number;
  expiresAt: number;
  attempts: number;
}

const OTP_SESSION_KEY = 'pawconnect_active_otp_session';

class OtpService {
  /**
   * Generates a cryptographically random 4-digit or 6-digit OTP
   */
  public generateOtp(digits: number = 4): string {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const randomNum = min + (array[0] % (max - min + 1));
    return randomNum.toString();
  }

  /**
   * Dispatches OTP to the given Indian mobile number via Real SMS Gateway
   */
  public async sendOtp(phone: string): Promise<{ success: boolean; code: string; message: string; provider?: string }> {
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      throw new Error('Invalid mobile number format. Please provide a 10-digit Indian number.');
    }

    // Generate fresh cryptographically random 4-digit code
    const code = this.generateOtp(4);
    const now = Date.now();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes validity

    const session: OtpSessionData = {
      phone,
      code,
      generatedAt: now,
      expiresAt,
      attempts: 0,
    };

    // Store active session in memory and localStorage
    localStorage.setItem(OTP_SESSION_KEY, JSON.stringify(session));

    // Dispatch via real physical SMS Gateway (Fast2SMS / Twilio / PawConnect Gateway)
    const smsResult = await smsGatewayService.sendPhysicalSms(phone, code);

    // Deliver via Browser Native Notification
    this.deliverBrowserNotification(phone, code);

    // Haptic vibration feedback on mobile
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 100]);
      } catch (e) {
        // ignore
      }
    }

    return {
      success: true,
      code,
      message: smsResult.message,
      provider: smsResult.provider,
    };
  }

  /**
   * Validates the entered OTP code against the active session
   */
  public verifyOtp(phone: string, inputCode: string): { success: boolean; message: string } {
    const saved = localStorage.getItem(OTP_SESSION_KEY);
    if (!saved) {
      return { success: false, message: 'No active OTP session found. Please request a new code.' };
    }

    let session: OtpSessionData;
    try {
      session = JSON.parse(saved);
    } catch (e) {
      return { success: false, message: 'Corrupted OTP session. Please request a new code.' };
    }

    // Check expiration (5 minutes)
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(OTP_SESSION_KEY);
      return { success: false, message: 'OTP has expired (valid for 5 minutes). Please request a new code.' };
    }

    // Check maximum wrong attempts (max 3)
    if (session.attempts >= 3) {
      localStorage.removeItem(OTP_SESSION_KEY);
      return { success: false, message: 'Too many incorrect attempts. Please request a fresh OTP.' };
    }

    // Check phone match
    const cleanSession = session.phone.replace(/\D/g, '').slice(-10);
    const cleanInput = phone.replace(/\D/g, '').slice(-10);

    if (cleanSession !== cleanInput) {
      return { success: false, message: 'Mobile number mismatch. Please request OTP for this number.' };
    }

    // Check code match
    if (session.code.trim() !== inputCode.trim()) {
      session.attempts += 1;
      localStorage.setItem(OTP_SESSION_KEY, JSON.stringify(session));
      const remaining = 3 - session.attempts;
      return {
        success: false,
        message: `Incorrect OTP code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
      };
    }

    // Correct OTP -> clear session & return success
    localStorage.removeItem(OTP_SESSION_KEY);
    return { success: true, message: 'Mobile number verified successfully!' };
  }

  /**
   * Request native browser notification permission & deliver alert
   */
  private async deliverBrowserNotification(phone: string, code: string) {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        if (Notification.permission === 'default') {
          await Notification.requestPermission();
        }
        if (Notification.permission === 'granted') {
          new Notification('PawConnect SMS Verification', {
            body: `Your OTP for ${phone} is ${code}. Do not share this code with anyone. (Valid for 5 mins)`,
            icon: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100',
          });
        }
      } catch (e) {
        // Notification failed or blocked
      }
    }
  }

  /**
   * Get active session info if exists and valid
   */
  public getActiveSession(): OtpSessionData | null {
    const saved = localStorage.getItem(OTP_SESSION_KEY);
    if (!saved) return null;
    try {
      const session: OtpSessionData = JSON.parse(saved);
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(OTP_SESSION_KEY);
        return null;
      }
      return session;
    } catch (e) {
      return null;
    }
  }
}

export const otpService = new OtpService();
