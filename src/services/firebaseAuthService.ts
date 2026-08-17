import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  Auth,
} from 'firebase/auth';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const FIREBASE_CONFIG_KEY = 'pawconnect_firebase_config';

class FirebaseAuthService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private confirmationResult: ConfirmationResult | null = null;

  constructor() {
    this.initFromSavedConfig();
  }

  public getSavedConfig(): FirebaseClientConfig | null {
    try {
      const saved = localStorage.getItem(FIREBASE_CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not parse saved Firebase config', e);
    }

    // Fallback to Vite env variables if present
    const env = (import.meta as any).env || {};
    const envApiKey = env.VITE_FIREBASE_API_KEY;
    const envAuthDomain = env.VITE_FIREBASE_AUTH_DOMAIN;
    const envProjectId = env.VITE_FIREBASE_PROJECT_ID;

    if (envApiKey && envAuthDomain && envProjectId) {
      return {
        apiKey: envApiKey,
        authDomain: envAuthDomain,
        projectId: envProjectId,
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: env.VITE_FIREBASE_APP_ID || '',
      };
    }

    return null;
  }

  public saveConfig(config: FirebaseClientConfig) {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
    this.initApp(config);
  }

  private initFromSavedConfig() {
    const config = this.getSavedConfig();
    if (config && config.apiKey) {
      this.initApp(config);
    }
  }

  public initApp(config: FirebaseClientConfig) {
    try {
      if (getApps().length > 0) {
        this.app = getApp();
      } else {
        this.app = initializeApp(config);
      }
      this.auth = getAuth(this.app);
    } catch (e) {
      console.error('Firebase initialization error:', e);
    }
  }

  public isConfigured(): boolean {
    const cfg = this.getSavedConfig();
    return Boolean(cfg && cfg.apiKey && cfg.projectId);
  }

  /**
   * Initializes reCAPTCHA on the given container ID (invisible)
   */
  public setupRecaptcha(containerId: string): RecaptchaVerifier | null {
    if (!this.auth) {
      const cfg = this.getSavedConfig();
      if (cfg) this.initApp(cfg);
    }

    if (!this.auth) return null;

    try {
      if (this.recaptchaVerifier) {
        try {
          this.recaptchaVerifier.clear();
        } catch (e) {
          // ignore
        }
      }

      this.recaptchaVerifier = new RecaptchaVerifier(this.auth, containerId, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          console.warn('reCAPTCHA expired, please try again.');
        },
      });

      return this.recaptchaVerifier;
    } catch (err) {
      console.error('Failed to setup Firebase RecaptchaVerifier:', err);
      return null;
    }
  }

  /**
   * Sends real physical SMS OTP to Indian mobile (+91) via Google Firebase Telecom Gateway (10,000 Free/Month)
   */
  public async sendPhoneOtp(
    phone10Digits: string,
    recaptchaContainerId = 'recaptcha-container'
  ): Promise<{ success: boolean; message: string }> {
    const cleanNumber = phone10Digits.replace(/\D/g, '').slice(-10);
    const fullPhoneNumber = `+91${cleanNumber}`;

    if (!this.auth) {
      const cfg = this.getSavedConfig();
      if (!cfg) {
        return {
          success: false,
          message: 'Firebase is not configured yet. Please enter your Firebase Project Keys in Gateway Settings.',
        };
      }
      this.initApp(cfg);
    }

    if (!this.auth) {
      return {
        success: false,
        message: 'Could not initialize Firebase Auth. Check your API Key & Project ID.',
      };
    }

    try {
      const verifier = this.setupRecaptcha(recaptchaContainerId);
      if (!verifier) {
        return {
          success: false,
          message: 'reCAPTCHA verification container could not be initialized.',
        };
      }

      const confirmation = await signInWithPhoneNumber(this.auth, fullPhoneNumber, verifier);
      this.confirmationResult = confirmation;

      return {
        success: true,
        message: `Real Google Firebase SMS dispatched to +91 ${cleanNumber}!`,
      };
    } catch (err: any) {
      console.error('Firebase signInWithPhoneNumber failed:', err);
      return {
        success: false,
        message: err.message || 'Firebase Phone Auth dispatch failed. Check console for details.',
      };
    }
  }

  /**
   * Verifies the 6-digit OTP entered by user against Google Firebase Telecom confirmation
   */
  public async verifyOtp(
    otpCode: string
  ): Promise<{ success: boolean; message: string; uid?: string }> {
    if (!this.confirmationResult) {
      return {
        success: false,
        message: 'No active Firebase SMS session found. Please request a new OTP.',
      };
    }

    try {
      const userCredential = await this.confirmationResult.confirm(otpCode);
      return {
        success: true,
        message: 'Phone number verified successfully with Google Firebase!',
        uid: userCredential.user.uid,
      };
    } catch (err: any) {
      console.error('Firebase OTP verification failed:', err);
      return {
        success: false,
        message: err.message || 'Invalid or expired Firebase OTP. Please check the code.',
      };
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();
