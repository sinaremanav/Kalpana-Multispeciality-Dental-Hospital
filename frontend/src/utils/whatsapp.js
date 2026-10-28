/**
 * WhatsApp Link & Deep-Link Utility for Kalpana Dental Clinic
 * Ensures clean phone formatting (digits only) and seamless app/web launching.
 */

export const sanitizeWhatsAppNumber = (phone) => {
  if (!phone) return '917447226136';
  const digits = String(phone).replace(/[^0-9]/g, '');
  if (!digits) return '917447226136';
  // If user entered a 10-digit Indian number without 91 country code, add 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
};

/**
 * Standard Universal WhatsApp Web / App link
 * Uses official api.whatsapp.com which prompts "Open WhatsApp" desktop app or continues to chat
 */
export const getWhatsAppUrl = (phone, text = '') => {
  const cleanNumber = sanitizeWhatsAppNumber(phone);
  const textParam = text ? `&text=${encodeURIComponent(text)}` : '';
  return `https://api.whatsapp.com/send/?phone=${cleanNumber}${textParam}`;
};

/**
 * Direct WhatsApp Desktop App Protocol (whatsapp://)
 * Opens the native Windows/Mac WhatsApp Desktop app directly without browser login prompts
 */
export const getWhatsAppAppUrl = (phone, text = '') => {
  const cleanNumber = sanitizeWhatsAppNumber(phone);
  const textParam = text ? `&text=${encodeURIComponent(text)}` : '';
  return `whatsapp://send?phone=${cleanNumber}${textParam}`;
};

/**
 * Direct WhatsApp Web URL (bypasses landing page for logged-in browser sessions)
 */
export const getWhatsAppWebUrl = (phone, text = '') => {
  const cleanNumber = sanitizeWhatsAppNumber(phone);
  const textParam = text ? `&text=${encodeURIComponent(text)}` : '';
  return `https://web.whatsapp.com/send?phone=${cleanNumber}${textParam}`;
};

/**
 * Intelligent WhatsApp click handler:
 * Attempts to launch the native desktop application first.
 * If not responded to or running in browser, smoothly falls back to WhatsApp Web/API.
 */
export const openWhatsAppChat = (phone, text = '') => {
  if (typeof window === 'undefined') return;

  const cleanNumber = sanitizeWhatsAppNumber(phone);
  const appUrl = getWhatsAppAppUrl(cleanNumber, text);
  const webUrl = getWhatsAppWebUrl(cleanNumber, text);
  const apiUrl = getWhatsAppUrl(cleanNumber, text);

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    window.location.href = apiUrl;
    return;
  }

  // Desktop workflow:
  // Try invoking native WhatsApp Desktop protocol
  try {
    const clickAnchor = document.createElement('a');
    clickAnchor.href = appUrl;
    clickAnchor.click();

    // Fallback: If desktop app is not installed or user wants web after delay
    setTimeout(() => {
      // If window still has focus and user wasn't redirected to app, open Web
      if (document.hasFocus()) {
        window.open(webUrl, '_blank', 'noopener,noreferrer');
      }
    }, 1200);
  } catch {
    window.open(apiUrl, '_blank', 'noopener,noreferrer');
  }
};
