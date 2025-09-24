const { NlpManager } = require('node-nlp');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
// const env = require('dotenv').config();

const manager = new NlpManager({ languages: ['en', 'hi'], forceNER: true });

// Confidence threshold for NLP intent matching
const NLP_CONFIDENCE_THRESHOLD = 0.6;

// --- 1. DEFINE INTENTS AND RESPONSES ---
const responses = {
  en: {
    fee_inquiry: {
      response: "The fee submission deadline is October 30, 2025. You can pay online through the student portal.",
      quickReplies: ["How to pay online?", "Late fee policy", "Can I pay in installments?"]
    },
    pay_online: {
      response: "To pay online, please use this link: https://www.tcsion.com/SelfServices/",
      quickReplies: ["Instructions for how to pay", "Fee structure", "Contact accounts"]
    },
    pay_online_instructions: {
      response: `To pay your fees online, please follow these steps:

1. Go to the payment portal: https://www.tcsion.com/SelfServices/
2. Login with your College Email (e.g., ERP@vgu.ac.in) and your Password.
3. Navigate to the 'Fee section'.
4. Select the fee you want to pay (e.g., Development).
5. Click on 'Paynow'.
6. Select the 'ATOMNEW Gateway'.
7. Pay the fee through your preferred option.`,
      quickReplies: ["Fee structure", "Contact accounts"]
    },
    fee_structure: {
      response: `The fee structure includes the following main components:

- Tution Fee
- Semester Exam Fee
- Development Fee
- Registration Fee`,
      quickReplies: ["How to pay online?", "Scholarships", "Contact accounts"]
    },
    contact_accounts: {
      response: "I can ask the accounts team to contact you. How should they get in touch?",
      quickReplies: ["Via SMS", "Via WhatsApp"]
    },
    contact_via_sms: {
      response: "Okay, I'll ask them to contact you via SMS. What is your phone number?",
      quickReplies: []
    },
    contact_via_whatsapp: {
      response: "Okay, I'll ask them to contact you via WhatsApp. What is your phone number?",
      quickReplies: []
    },
    provide_contact_number: {
      response: "Thank you. I've notified the accounts team with your number. They will contact you shortly.",
      quickReplies: ["Fee structure", "How to pay online?"]
    },
    scholarship: {
      response: "You can download the scholarship form from the college website under 'Student Services'.",
      quickReplies: ["Download form", "Eligibility criteria"]
    },
    courses: {
      response: "For information on courses, please visit the college's official page: https://www.vgu.ac.in/",
      quickReplies: ["Fee deadline", "Scholarships", "Campus life"]
    },
    admissions: {
      response: "For admission, please contact the Admission Helpline Number: +919549360555",
      quickReplies: ["Courses", "Fee structure", "Campus life"]
    },
    campus_life: {
      response: "For details about campus life, including events, clubs, and facilities, please visit the official VGU Jaipur website: https://www.vgu.ac.in/",
      quickReplies: ["Admissions", "Courses", "Fee deadline"]
    },
    greeting: {
      response: "Hello! How can I assist you today?",
      quickReplies: ["Fee deadline", "Scholarships", "Campus life"]
    },
    handoff: {
      response: "I'm connecting you to a live agent. Please wait a moment.",
      quickReplies: []
    },
    fallback: {
      response: "Sorry, I could not process that. Please try rephrasing, or ask to speak to a human agent.",
      quickReplies: ["Admissions", "Courses", "Speak to an agent"]
    }
  },
  hi: {
    fee_inquiry: {
      response: "शुल्क जमा करने की अंतिम तिथि 30 अक्टूबर, 2025 है। आप छात्र पोर्टल के माध्यम से ऑनलाइन भुगतान कर सकते हैं।",
      quickReplies: ["ऑनलाइन भुगतान कैसे करें?", "विलंब शुल्क नीति", "क्या मैं किश्तों में भुगतान कर सकता हूँ?"]
    },
    pay_online: {
      response: "ऑनलाइन भुगतान करने के लिए, कृपया इस लिंक का उपयोग करें: https://www.tcsion.com/SelfServices/",
      quickReplies: ["भुगतान कैसे करें के लिए निर्देश", "शुल्क संरचना", "लेखा विभाग से संपर्क करें"]
    },
    pay_online_instructions: {
      response: `अपनी फीस का ऑनलाइन भुगतान करने के लिए, कृपया इन चरणों का पालन करें:

1. भुगतान पोर्टल पर जाएं: https://www.tcsion.com/SelfServices/
2. अपने कॉलेज ईमेल (उदा., ERP@vgu.ac.in) और अपने पासवर्ड से लॉगिन करें।
3. 'शुल्क अनुभाग' पर जाएं।
4. उस शुल्क का चयन करें जिसका आप भुगतान करना चाहते हैं (उदा., विकास)।
5. 'अभी भुगतान करें' पर क्लिक करें।
6. 'ATOMNEW गेटवे' चुनें।
7. अपने पसंदीदा विकल्प के माध्यम से शुल्क का भुगतान करें।`,
      quickReplies: ["शुल्क संरचना", "लेखा विभाग से संपर्क करें"]
    },
    fee_structure: {
      response: `शुल्क संरचना में निम्नलिखित मुख्य घटक शामिल हैं:

- शिक्षण शुल्क
- सेमेस्टर परीक्षा शुल्क
- विकास शुल्क
- पंजीकरण शुल्क`,
      quickReplies: ["ऑनलाइन भुगतान कैसे करें?", "छात्रवृत्तियाँ", "लेखा विभाग से संपर्क करें"]
    },
    contact_accounts: {
      response: "मैं लेखा टीम से आपसे संपर्क करने के लिए कह सकता हूँ। वे आपसे कैसे संपर्क करें?",
      quickReplies: ["एसएमएस द्वारा", "व्हाट्सएप द्वारा"]
    },
    contact_via_sms: {
      response: "ठीक है, मैं उनसे एसएमएस के माध्यम से आपसे संपर्क करने के लिए कहूंगा। आपका फ़ोन नंबर क्या है?",
      quickReplies: []
    },
    contact_via_whatsapp: {
      response: "ठीक है, मैं उनसे व्हाट्सएप के माध्यम से आपसे संपर्क करने के लिए कहूंगा। आपका फ़ोन नंबर क्या है?",
      quickReplies: []
    },
    provide_contact_number: {
      response: "धन्यवाद। मैंने लेखा टीम को आपके नंबर के साथ सूचित कर दिया है। वे जल्द ही आपसे संपर्क करेंगे।",
      quickReplies: ["शुल्क संरचना", "ऑनलाइन भुगतान कैसे करें?"]
    },
    scholarship: {
      response: "आप 'छात्र सेवाएं' के तहत कॉलेज की वेबसाइट से छात्रवृत्ति फॉर्म डाउनलोड कर सकते हैं।",
      quickReplies: ["फॉर्म डाउनलोड करें", "पात्रता मापदंड"]
    },
    courses: {
      response: "पाठ्यक्रमों की जानकारी के लिए, कृपया कॉलेज के आधिकारिक पृष्ठ पर जाएं: https://www.vgu.ac.in/",
      quickReplies: ["शुल्क की अंतिम तिथि", "छात्रवृत्तियाँ", "कैंपस जीवन"]
    },
    admissions: {
      response: "प्रवेश के लिए, कृपया प्रवेश हेल्पलाइन नंबर पर संपर्क करें: +919549360555",
      quickReplies: ["कोर्स", "शुल्क संरचना", "कैंपस जीवन"]
    },
    campus_life: {
      response: "कैंपस जीवन, जिसमें कार्यक्रम, क्लब और सुविधाएं शामिल हैं, के बारे में जानकारी के लिए, कृपया वीजीयू जयपुर की आधिकारिक वेबसाइट पर जाएं: https://www.vgu.ac.in/",
      quickReplies: ["प्रवेश", "कोर्स", "शुल्क की अंतिम तिथि"]
    },
    greeting: {
      response: "नमस्ते! मैं आज आपकी कैसे सहायता कर सकता हूँ?",
      quickReplies: ["शुल्क की अंतिम तिथि", "छात्रवृत्तियाँ", "कैंपस जीवन"]
    },
    handoff: {
      response: "मैं आपको एक लाइव एजेंट से जोड़ रहा हूँ। कृपया एक क्षण प्रतीक्षा करें।",
      quickReplies: []
    },
    fallback: {
      response: "क्षमा करें, मैं इसे संसाधित नहीं कर सका। कृपया फिर से कहने का प्रयास करें, या किसी मानव एजेंट से बात करने के लिए कहें।",
      quickReplies: ["प्रवेश", "कोर्स", "एजेंट से बात करें"]
    }
  }
}

// --- 2. TRAIN THE NLP MODEL ---
async function trainNlp() {
  console.log('Training NLP model...');
  // Add training data for each intent
  // GREETINGS
  manager.addDocument('en', 'hello', 'greeting');
  manager.addDocument('en', 'hi there', 'greeting');
  manager.addDocument('en', 'good morning', 'greeting');
  manager.addDocument('hi', 'नमस्ते', 'greeting');
  manager.addDocument('hi', 'नमस्कार', 'greeting');
  manager.addDocument('hi', 'सुप्रभात', 'greeting');

  // FEE INQUIRY
  manager.addDocument('en', 'what is the fee deadline', 'fee_inquiry');
  manager.addDocument('en', 'when is payment due', 'fee_inquiry');
  manager.addDocument('en', 'tell me about the fees', 'fee_inquiry');
  manager.addDocument('en', 'what is the cost', 'fee_inquiry');
  manager.addDocument('hi', 'फीस की अंतिम तिथि क्या है', 'fee_inquiry');
  manager.addDocument('hi', 'भुगतान कब करना है', 'fee_inquiry');
  manager.addDocument('hi', 'फीस के बारे में बताएं', 'fee_inquiry');
  manager.addDocument('hi', 'कितना खर्चा है', 'fee_inquiry');

  // PAY ONLINE
  manager.addDocument('en', 'how do I pay online', 'pay_online');
  manager.addDocument('en', 'can I pay online', 'pay_online');
  manager.addDocument('en', 'where is the payment portal', 'pay_online');
  manager.addDocument('en', 'online fee payment process', 'pay_online');
  manager.addDocument('en', 'how to pay my fees', 'pay_online');
  manager.addDocument('en', 'online payment', 'pay_online');
  manager.addDocument('en', 'fee payment link', 'pay_online');
  manager.addDocument('hi', 'मैं ऑनलाइन भुगतान कैसे करूं', 'pay_online');
  manager.addDocument('hi', 'क्या मैं ऑनलाइन भुगतान कर सकता हूं', 'pay_online');
  manager.addDocument('hi', 'पेमेंट पोर्टल कहां है', 'pay_online');
  manager.addDocument('hi', 'ऑनलाइन भुगतान', 'pay_online');
  manager.addDocument('hi', 'ऑनलाइन फीस कैसे भरें', 'pay_online');
  manager.addDocument('hi', 'ऑनलाइन भुगतान प्रक्रिया', 'pay_online');

  // PAY ONLINE INSTRUCTIONS
  manager.addDocument('en', 'Instructions for how to pay', 'pay_online_instructions');
  manager.addDocument('en', 'how to pay fee online step by step', 'pay_online_instructions');
  manager.addDocument('en', 'give me detailed fee payment instructions', 'pay_online_instructions');
  manager.addDocument('en', 'steps to pay fees online', 'pay_online_instructions');
  manager.addDocument('en', 'show me the steps for paying online', 'pay_online_instructions');
  manager.addDocument('hi', 'भुगतान कैसे करें के लिए निर्देश', 'pay_online_instructions');
  manager.addDocument('hi', 'ऑनलाइन शुल्क भुगतान कैसे करें', 'pay_online_instructions');
  manager.addDocument('hi', 'ऑनलाइन भुगतान करने के चरण', 'pay_online_instructions');
  manager.addDocument('hi', 'ऑनलाइन फीस भरने के निर्देश दें', 'pay_online_instructions');

  // FEE STRUCTURE
  manager.addDocument('en', 'Fee structure', 'fee_structure');
  manager.addDocument('en', 'what is the fee structure', 'fee_structure');
  manager.addDocument('en', 'tell me about the fee structure', 'fee_structure');
  manager.addDocument('en', 'explain the fees', 'fee_structure');
  manager.addDocument('en', 'what fees do I have to pay', 'fee_structure');
  manager.addDocument('hi', 'शुल्क संरचना', 'fee_structure');
  manager.addDocument('hi', 'शुल्क संरचना क्या है', 'fee_structure');
  manager.addDocument('hi', 'फीस के बारे में बताएं', 'fee_structure');
  manager.addDocument('hi', 'मुझे कौन सी फीस देनी होगी', 'fee_structure');
  manager.addDocument('hi', 'फीस का विवरण दें', 'fee_structure');

  // CONTACT ACCOUNTS
  manager.addDocument('en', 'Contact accounts', 'contact_accounts');
  manager.addDocument('en', 'I need to speak to the accounts department', 'contact_accounts');
  manager.addDocument('en', 'call accounts', 'contact_accounts');
  manager.addDocument('en', 'sms the accounts team', 'contact_accounts');
  manager.addDocument('en', 'whatsapp the account team', 'contact_accounts');
  manager.addDocument('hi', 'लेखा विभाग से संपर्क करें', 'contact_accounts');
  manager.addDocument('hi', 'मुझे लेखा विभाग से बात करनी है', 'contact_accounts');
  manager.addDocument('hi', 'अकाउंट्स को कॉल करें', 'contact_accounts');
  manager.addDocument('hi', 'अकाउंट्स टीम से संपर्क करना है', 'contact_accounts');

  // CONTACT VIA...
  manager.addDocument('en', 'Via SMS', 'contact_via_sms');
  manager.addDocument('en', 'contact me by sms', 'contact_via_sms');
  manager.addDocument('hi', 'एसएमएस द्वारा', 'contact_via_sms');
  manager.addDocument('hi', 'मुझे एसएमएस से संपर्क करें', 'contact_via_sms');
  manager.addDocument('en', 'Via WhatsApp', 'contact_via_whatsapp');
  manager.addDocument('en', 'contact me by whatsapp', 'contact_via_whatsapp');
  manager.addDocument('hi', 'व्हाट्सएप द्वारा', 'contact_via_whatsapp');
  manager.addDocument('hi', 'मुझे व्हाट्सएप से संपर्क करें', 'contact_via_whatsapp');

  // PROVIDE CONTACT NUMBER
  manager.addDocument('en', 'my number is %phonenumber%', 'provide_contact_number');
  manager.addDocument('en', 'it is %phonenumber%', 'provide_contact_number');
  manager.addDocument('en', 'you can reach me at %phonenumber%', 'provide_contact_number');
  manager.addDocument('en', '%phonenumber%', 'provide_contact_number');
  manager.addDocument('en', 'here is my number %phonenumber%', 'provide_contact_number');
  manager.addDocument('hi', 'मेरा नंबर %phonenumber% है', 'provide_contact_number');
  manager.addDocument('hi', 'यह है %phonenumber%', 'provide_contact_number');
  manager.addDocument('hi', '%phonenumber%', 'provide_contact_number');
  manager.addDocument('hi', 'मेरा फोन नंबर %phonenumber% है', 'provide_contact_number');
  manager.addDocument('hi', 'आप मुझे %phonenumber% पर संपर्क कर सकते हैं', 'provide_contact_number');

  // SCHOLARSHIP
  manager.addDocument('en', 'are there any scholarships', 'scholarship');
  manager.addDocument('en', 'tell me about the scholarship form', 'scholarship');
  manager.addDocument('hi', 'क्या कोई छात्रवृत्ति है', 'scholarship');
  manager.addDocument('hi', 'छात्रवृत्ति फॉर्म के बारे में बताएं', 'scholarship');

  // COURSES
  manager.addDocument('en', 'Courses', 'courses');
  manager.addDocument('en', 'tell me about the courses', 'courses');
  manager.addDocument('en', 'what courses are offered', 'courses');
  manager.addDocument('en', 'list of courses', 'courses');
  manager.addDocument('hi', 'कोर्स', 'courses');
  manager.addDocument('hi', 'कोर्स के बारे में बताएं', 'courses');
  manager.addDocument('hi', 'कौन से कोर्स उपलब्ध हैं', 'courses');
  manager.addDocument('hi', 'कोर्स की सूची', 'courses');

  // ADMISSIONS
  manager.addDocument('en', 'Admissions', 'admissions');
  manager.addDocument('en', 'how to get admission', 'admissions');
  manager.addDocument('en', 'admission process', 'admissions');
  manager.addDocument('en', 'I want to take admission', 'admissions');
  manager.addDocument('hi', 'प्रवेश', 'admissions');
  manager.addDocument('hi', 'प्रवेश कैसे लें', 'admissions');
  manager.addDocument('hi', 'प्रवेश प्रक्रिया', 'admissions');
  manager.addDocument('hi', 'मुझे प्रवेश लेना है', 'admissions');

  // CAMPUS LIFE
  manager.addDocument('en', 'Campus Life', 'campus_life');
  manager.addDocument('en', 'tell me about campus life', 'campus_life');
  manager.addDocument('en', 'what is it like on campus', 'campus_life');
  manager.addDocument('en', 'student life', 'campus_life');
  manager.addDocument('hi', 'कैंपस जीवन', 'campus_life');
  manager.addDocument('hi', 'कैंपस जीवन के बारे में बताएं', 'campus_life');
  manager.addDocument('hi', 'कैंपस में कैसा है', 'campus_life');
  manager.addDocument('hi', 'छात्र जीवन', 'campus_life');

  // LIVE AGENT HANDOFF
  manager.addDocument('en', 'I want to talk to a human', 'handoff');
  manager.addDocument('en', 'connect me to an agent', 'handoff');
  manager.addDocument('en', 'speak to representative', 'handoff');
  manager.addDocument('hi', 'मुझे एक इंसान से बात करनी है', 'handoff');
  manager.addDocument('hi', 'मुझे एक एजेंट से कनेक्ट करें', 'handoff');
  manager.addDocument('hi', 'प्रतिनिधि से बात करें', 'handoff');
  manager.addDocument('hi', 'एजेंट से बात करें', 'handoff');

  // Train the model
  await manager.train();
  manager.save(); // Save the trained model
  console.log('NLP model trained successfully!');
}

// Train the model on server startup
trainNlp();

// --- 3. LIVE AGENT HANDOFF SETUP ---
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // For Gmail, use an "App Password"
  },
});

async function notifyLiveAgent(message, history) {
  if (!process.env.EMAIL_USER || !process.env.SUPPORT_EMAIL) {
    console.log('Live agent email notification is not configured. Please set EMAIL_USER and SUPPORT_EMAIL in your .env file. Skipping.');
    return;
  }
  const chatHistory = history.map(m => `${m.sender}: ${m.text}`).join('\n');
  try {
    await transporter.sendMail({
      from: `"CampusBot" <${process.env.EMAIL_USER}>`,
      to: process.env.SUPPORT_EMAIL,
      subject: 'New Live Agent Request',
      text: `A user requested a live agent.\n\nLast message: ${message}\n\nConversation History:\n${history.length > 0 ? chatHistory : 'N/A'}`,
    });
    console.log('Live agent notification email sent.');
  } catch (error) {
    console.error('Error sending agent notification:', error);
  }
}

/**
 * Sends an SMS notification to the accounts team using Twilio
 */
async function sendSmsToAccounts(studentPhoneNumber) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
  const accountsPhone = process.env.ACCOUNTS_TEAM_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioPhone || !accountsPhone) {
    console.log('Twilio SMS notification is not configured. Please set TWILIO variables in your .env file. Skipping.');
    return false; // Indicate failure
  }

  const client = twilio(accountSid, authToken);
  const smsBody = `hey A student whose Number is ${studentPhoneNumber}. Pls contact them and sovle there issue😊😊`;

  try {
    await client.messages.create({
      body: smsBody,
      from: twilioPhone,
      to: accountsPhone
    });
    console.log('Twilio SMS to accounts team sent successfully.');
    return true; // Indicate success
  } catch (error) {
    console.error('Error sending Twilio SMS:', error);
    return false; // Indicate failure
  }
}

/**
 * Sends a WhatsApp notification to the accounts team using Twilio
 */
async function sendWhatsAppToAccounts(studentPhoneNumber) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
  const accountsPhone = process.env.ACCOUNTS_TEAM_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioPhone || !accountsPhone) {
    console.log('Twilio WhatsApp notification is not configured. Please set TWILIO variables in your .env file. Skipping.');
    return false; // Indicate failure
  }

  const client = twilio(accountSid, authToken);
  const messageBody = `hey A student whose Number is ${studentPhoneNumber}. Pls contact them and sovle there issue😊😊`;

  try {
    await client.messages.create({
      body: messageBody,
      from: `whatsapp:${twilioPhone}`,
      to: `whatsapp:${accountsPhone}`
    });
    console.log('Twilio WhatsApp to accounts team sent successfully.');
    return true; // Indicate success
  } catch (error) {
    console.error('Error sending Twilio WhatsApp:', error);
    return false; // Indicate failure
  }
}

/**
 * Get bot response based on user message and language
 */
async function getBotResponse(message, language = "en", history = []) {
  const lang = responses[language] ? language : 'en';
  const langResponses = responses[lang];

  // Process the user's message with the NLP manager
  const nlpResult = await manager.process(lang, message);
  const intent = nlpResult.intent;
  const entities = nlpResult.entities;
  const score = nlpResult.score;

  console.log(`NLP Result: Intent='${intent}', Score=${score}`);

  // Check if the top intent has enough confidence
  if (intent && score > NLP_CONFIDENCE_THRESHOLD && langResponses[intent]) {
    // Handle special intents with custom logic
    switch (intent) {
      case 'provide_contact_number': {
        const phoneEntity = entities.find(e => e.entity === 'phonenumber');
        if (phoneEntity) {
          const studentPhoneNumber = phoneEntity.sourceText;
          const lastBotMessage = history.filter(m => m.sender === 'bot').pop();
          let notificationSent = false;

          if (lastBotMessage && lastBotMessage.text.toLowerCase().includes('whatsapp')) {
            notificationSent = await sendWhatsAppToAccounts(studentPhoneNumber);
          } else {
            notificationSent = await sendSmsToAccounts(studentPhoneNumber);
          }

          if (!notificationSent) {
            return {
              response: "I'm sorry, I couldn't send the notification at the moment. Please try again later or ask to speak to a human agent.",
              quickReplies: ["Speak to an agent", "Fee structure"]
            };
          }

          const matchedIntent = langResponses.provide_contact_number;
          return {
            response: matchedIntent.response,
            quickReplies: matchedIntent.quickReplies || []
          };
        } else {
          return {
            response: "I'm sorry, I couldn't recognize a phone number. Please provide a valid phone number.",
            quickReplies: []
          };
        }
      }
      case 'handoff': {
        notifyLiveAgent(message, history).catch(console.error);
        const matchedIntent = langResponses.handoff;
        return {
          response: matchedIntent.response,
          quickReplies: matchedIntent.quickReplies || []
        };
      }
      // For all other standard intents, return the predefined response
      default: {
        const matchedIntent = langResponses[intent];
        return {
          response: matchedIntent.response,
          quickReplies: matchedIntent.quickReplies || []
        };
      }
    }
  }

  // If no intent reached the confidence threshold, use the fallback
  const matchedIntent = langResponses.fallback;

  return {
    response: matchedIntent.response,
    quickReplies: matchedIntent.quickReplies || []
  }
}

module.exports = { getBotResponse };
