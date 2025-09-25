const multer = require("multer");
const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");

// Multer setup: store file temporarily on server
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // make sure this folder exists
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Upload to Cloudinary
async function uploadToCloudinary(localFilePath) {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "campus_chatbot_uploads",
      resource_type: "auto", // supports pdf, image, video
    });

    // delete local file after upload
    fs.unlinkSync(localFilePath);

    return result.secure_url;
  } catch (err) {
    console.error("❌ Cloudinary Upload Error:", err);
    throw err;
  }
}

// Main handler for file upload
async function handleDocumentUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Upload file to Cloudinary
    const fileUrl = await uploadToCloudinary(req.file.path);

    // Return a bot response to continue the conversation
    return res.status(200).json({
      response: "Thank you for the document. To proceed, please tell me your Full Name.", // This is now Step 1
      quickReplies: [],
      intent: 'ask_for_name', // Add intent to the response
      fileInfo: {
        url: fileUrl,
        name: req.file.originalname,
      }
    });
  } catch (error) {
    console.error("❌ Error handling file upload:", error);
    return res.status(500).json({ success: false, message: "File upload failed" });
  }
}

module.exports = { upload, handleDocumentUpload };
