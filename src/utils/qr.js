import jsQR from 'jsqr';

// Decode QR from an uploaded image File. Returns string payload or null.
export async function decodeQRFromFile(file) {
  const img = new Image();
  const url = URL.createObjectURL(file);
  try {
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);
    return code ? code.data : null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Try parsing a JSON QR payload to an object with expected schema.
export function parseQRPayload(payload) {
  try {
    const data = JSON.parse(payload);
    // Expecting: { userId, name, pin, expiresAt }
    if (!data || !data.userId || !data.pin || !data.expiresAt) return null;
    return {
      userId: String(data.userId),
      name: data.name || 'Utilisateur',
      pin: String(data.pin),
      expiresAt: data.expiresAt,
    };
  } catch (e) {
    return null;
  }
}
