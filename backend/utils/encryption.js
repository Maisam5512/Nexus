// const crypto = require('crypto');

// // Use a fixed encryption key from environment variable or generate one
// const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');

// function encryptMessage(text) {
//   try {
//     // Handle case where text might not be a string
//     if (typeof text !== 'string') {
//       text = String(text);
//     }
    
//     const iv = crypto.randomBytes(16);
//     const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
//     let encrypted = cipher.update(text, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     const authTag = cipher.getAuthTag().toString('hex');
    
//     // Return a string representation of the encrypted data
//     return JSON.stringify({
//       iv: iv.toString('hex'),
//       content: encrypted,
//       authTag: authTag
//     });
//   } catch (error) {
//     console.error('Encryption error:', error);
//     throw new Error('Failed to encrypt message');
//   }
// }

// function decryptMessage(encryptedDataString) {
//   try {
//     // Parse the string back to an object
//     const encryptedData = JSON.parse(encryptedDataString);
    
//     const iv = Buffer.from(encryptedData.iv, 'hex');
//     const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
//     decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
//     let decrypted = decipher.update(encryptedData.content, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     return decrypted;
//   } catch (error) {
//     console.error('Decryption error:', error);
//     // Return the original string if decryption fails (for backward compatibility)
//     return encryptedDataString;
//   }
// }

// module.exports = { encryptMessage, decryptMessage };










const crypto = require("crypto")

const ENCRYPTION_KEY_HEX = process.env.ENCRYPTION_KEY
if (!ENCRYPTION_KEY_HEX || !/^[0-9a-fA-F]{64}$/.test(ENCRYPTION_KEY_HEX)) {
  throw new Error(
    "ENCRYPTION_KEY must be a 64-character hex string (32 bytes) for aes-256-gcm. " +
      "Set a consistent key in your environment to avoid decryption failures.",
  )
}
const KEY_BUFFER = Buffer.from(ENCRYPTION_KEY_HEX, "hex")

function encryptMessage(text) {
  try {
    if (typeof text !== "string") {
      text = String(text)
    }

    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv("aes-256-gcm", KEY_BUFFER, iv)
    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")
    const authTag = cipher.getAuthTag().toString("hex")

    return JSON.stringify({
      iv: iv.toString("hex"),
      content: encrypted,
      authTag,
    })
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt message")
  }
}

function decryptMessage(encryptedDataString) {
  try {
    // Quickly return if it's not JSON; this handles legacy/plaintext gracefully
    if (typeof encryptedDataString !== "string" || encryptedDataString[0] !== "{") {
      return encryptedDataString
    }

    const parsed = JSON.parse(encryptedDataString)
    // Only attempt decryption if the expected fields exist
    if (!parsed || !parsed.iv || !parsed.content || !parsed.authTag) {
      return encryptedDataString
    }

    const iv = Buffer.from(parsed.iv, "hex")
    const decipher = crypto.createDecipheriv("aes-256-gcm", KEY_BUFFER, iv)
    decipher.setAuthTag(Buffer.from(parsed.authTag, "hex"))
    let decrypted = decipher.update(parsed.content, "hex", "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
  } catch (_error) {
    return encryptedDataString
  }
}

module.exports = { encryptMessage, decryptMessage }
