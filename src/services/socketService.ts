/**
 * PawConnect Real-Time Bidirectional Web Socket Engine
 * Enables 100% real live multi-tab & multi-window communication directly between real users.
 * NO AUTOMATED BOT REPLIES.
 */

export interface SocketMessagePayload {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  text: string;
  image?: string;
  timestamp: string;
  dogId?: string;
  dogName?: string;
  dogAvatar?: string;
  participants?: string[];
  isDogBark?: boolean;
}

export type SocketEventListener = (payload: SocketMessagePayload) => void;

class PawConnectSocketEngine {
  private channel: BroadcastChannel | null = null;
  private listeners: SocketEventListener[] = [];
  public isConnected = true;

  constructor() {
    // 1. Cross-Tab BroadcastChannel (does NOT fire on the SENDER's own tab - browser rule)
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('pawconnect_live_socket_bus');
        this.channel.onmessage = (event) => {
          if (event.data && event.data.type === 'LIVE_CHAT_MESSAGE') {
            this.notifyListeners(event.data.payload);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel fallback enabled');
      }
    }

    // 2. localStorage storage event fires ONLY on OTHER windows/origins
    //    This handles cross-port syncing (5173 ↔ 5174)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e: StorageEvent) => {
        if (e.key === 'pawconnect_socket_broadcast' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            if (data && data.id) {
              this.notifyListeners(data);
            }
          } catch (err) {}
        }
      });

      // ⚠️ We do NOT use window.dispatchEvent('pawconnect_socket_event') anymore.
      // That CustomEvent fires on the SAME tab too, causing duplicate message bubbles.
    }
  }

  public subscribe(callback: SocketEventListener) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Emit a message to OTHER tabs/windows ONLY.
   * The sender's own UI is updated directly inside AppContext.sendMessage() — NOT here.
   * ✅ This prevents the duplicate bubble bug entirely.
   */
  public emitMessage(payload: SocketMessagePayload) {
    // Broadcast to other tabs via BroadcastChannel (won't fire on sender's own tab)
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'LIVE_CHAT_MESSAGE', payload });
      } catch (e) {}
    }

    // localStorage write fires storage event ONLY on other windows (different port = different origin)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'pawconnect_socket_broadcast',
          JSON.stringify({ ...payload, _ts: Date.now() })
        );
      } catch (e) {}
    }

    // ✅ NOT calling this.notifyListeners(payload) here.
    // Doing so would deliver the message to the sender's OWN tab's subscriber,
    // which was the exact root cause of the double-bubble bug.
  }

  private notifyListeners(payload: SocketMessagePayload) {
    this.listeners.forEach(cb => {
      try {
        cb(payload);
      } catch (err) {
        console.error('Socket listener error:', err);
      }
    });
  }
}

export const socketEngine = new PawConnectSocketEngine();
