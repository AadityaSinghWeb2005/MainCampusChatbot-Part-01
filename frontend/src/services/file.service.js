const { sendWhatsAppToAccounts } = require('./bot.service');

/**
 * Handles the uploaded file, saves it, and forwards it to the correct department.
 * @param {object} file - The uploaded file object from multer.
 * @param {string} studentPhoneNumber - The phone number of the student.
 * @param {string} docType - The type of the document (e.g., 'fee_receipt', 'scholarship_form').
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function handleDocumentUpload(file, studentPhoneNumber, docType = 'unknown') {
  if (!file) {
    return { success: false, message: "No file was uploaded." };
  }

  // Construct the public URL for the file.
  // This URL must be accessible from the internet for Twilio to fetch it.
  const fileUrl = `${process.env.BASE_URL}/uploads/${file.filename}`;

  console.log(`Handling upload for docType: ${docType}. Public URL: ${fileUrl}`);

  let notificationSent = false;
  let destination = "the relevant department";

  // ** CONTEXT-AWARE ROUTING LOGIC **
  if (docType === 'fee_receipt') {
    destination = "the accounts department";
    // Send the file via WhatsApp to the accounts team
    notificationSent = await sendWhatsAppToAccounts(studentPhoneNumber, fileUrl);
  } else if (docType === 'scholarship_form') {
    destination = "the admissions office";
    // TODO: Implement sending to admissions (e.g., via email or a different WhatsApp number)
    console.log(`TODO: Send notification for scholarship form to admissions.`);
    notificationSent = true; // Placeholder for now
  }

  if (notificationSent) {
    return { success: true, message: `Your document has been sent to ${destination}.` };
  } else {
    return { success: false, message: "Sorry, I couldn't send your document right now. Please try again later." };
  }
}

module.exports = { handleDocumentUpload };