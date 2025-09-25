const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en', 'hi'], forceNER: true });
// Confidence threshold for NLP intent matching
const NLP_CONFIDENCE_THRESHOLD = 0.5;

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
      response: "Please contact the accounts department at +1234567891.",
      quickReplies: ["Fee structure", "How to pay online?", "Scholarships"]
    },
    scholarship: {
      response: "For all scholarship details, please visit the official VGU website: https://www.vgu.ac.in/. For specific questions, we recommend contacting the admissions office directly.",
      quickReplies: ["Admissions", "Courses", "Fee structure"]
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
    campus_events: {
      response: "Here is the schedule for upcoming campus events. Please click the link to download the PDF.",
      fileUrl: "http://localhost:5000/public/files/campus_events.pdf",
      quickReplies: ["Fee deadline", "Scholarships", "Opening hours"]
    },
    greeting: {
      response: "Hello! How can I assist you today?",
      quickReplies: ["Fee deadline", "Scholarships", "Campus events", "Opening hours"]
    },
    fallback: {
      response: "I'm sorry, I'm not sure how to help with that. Please try rephrasing your question, or you can select one of these options:",
      quickReplies: ["Fee deadline", "Admissions", "Courses"]
    },
    opening_hours: {
      response: "The college is open from 9:00 A.M. to 6:00 P.M. on weekdays.",
      quickReplies: ["Fee deadline", "Admissions", "Courses", "Instructions for how to pay"]
    },
    submission_complete: {
      response: "I have sent it to the department successfully.",
      quickReplies: ["Fee deadline", "Scholarships", "Campus life"]
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
      response: "कृपया लेखा विभाग से +1234567891 पर संपर्क करें।",
      quickReplies: ["शुल्क संरचना", "ऑनलाइन भुगतान कैसे करें?", "छात्रवृत्तियाँ"]
    },
    scholarship: {
      response: "सभी छात्रवृत्ति विवरणों के लिए, कृपया आधिकारिक वीजीयू वेबसाइट पर जाएं: https://www.vgu.ac.in/। विशिष्ट प्रश्नों के लिए, हम सीधे प्रवेश कार्यालय से संपर्क करने की सलाह देते हैं।",
      quickReplies: ["प्रवेश", "कोर्स", "शुल्क संरचना"]
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
    campus_events: {
      response: "आगामी कैंपस कार्यक्रमों की सूची यहाँ है। PDF डाउनलोड करने के लिए कृपया लिंक पर क्लिक करें।",
      fileUrl: "http://localhost:5000/public/files/campus_events.pdf",
      quickReplies: ["शुल्क की अंतिम तिथि", "छात्रवृत्तियाँ", "खुलने का समय"]
    },
    greeting: {
      response: "नमस्ते! मैं आज आपकी कैसे सहायता कर सकता हूँ?",
      quickReplies: ["शुल्क की अंतिम तिथि", "छात्रवृत्तियाँ", "कैंपस कार्यक्रम", "खुलने का समय"]
    },
    fallback: {
      response: "मुझे क्षमा करें, मुझे यकीन नहीं है कि इसमें कैसे मदद की जाए। कृपया अपने प्रश्न को फिर से लिखने का प्रयास करें, या आप इनमें से कोई एक विकल्प चुन सकते हैं:",
      quickReplies: ["शुल्क की अंतिम तिथि", "प्रवेश", "कोर्स"]
    },
    opening_hours: {
      response: "कॉलेज सप्ताह के दिनों में सुबह 9:00 बजे से शाम 6:00 बजे तक खुला रहता है।",
      quickReplies: ["शुल्क की अंतिम तिथि", "प्रवेश", "कोर्स", "भुगतान कैसे करें के लिए निर्देश"]
    },
    submission_complete: {
      response: "मैंने इसे विभाग को सफलतापूर्वक भेज दिया है।",
      quickReplies: ["शुल्क की अंतिम तिथि", "छात्रवृत्तियाँ", "कैंपस जीवन"]
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
  manager.addDocument('en', 'whatsapp the account team', 'contact_accounts');
  manager.addDocument('hi', 'लेखा विभाग से संपर्क करें', 'contact_accounts');
  manager.addDocument('hi', 'मुझे लेखा विभाग से बात करनी है', 'contact_accounts');
  manager.addDocument('hi', 'अकाउंट्स को कॉल करें', 'contact_accounts');
  manager.addDocument('hi', 'अकाउंट्स टीम से संपर्क करना है', 'contact_accounts');

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

  // CAMPUS EVENTS
  manager.addDocument('en', 'Campus events', 'campus_events');
  manager.addDocument('en', 'what are the upcoming events', 'campus_events');
  manager.addDocument('en', 'tell me about events', 'campus_events');
  manager.addDocument('hi', 'कैंपस कार्यक्रम', 'campus_events');
  manager.addDocument('hi', 'आगामी कार्यक्रम क्या हैं', 'campus_events');
  manager.addDocument('hi', 'कार्यक्रमों के बारे में बताएं', 'campus_events');

  // OPENING HOURS
  manager.addDocument('en', 'Opening hours', 'opening_hours');
  manager.addDocument('en', 'what are the college timings', 'opening_hours');
  manager.addDocument('en', 'when is the college open', 'opening_hours');
  manager.addDocument('hi', 'खुलने का समय', 'opening_hours');
  manager.addDocument('hi', 'कॉलेज का समय क्या है', 'opening_hours');
  manager.addDocument('hi', 'कॉलेज कब खुलता है', 'opening_hours');

  // Train the model and save it
  await manager.train();
  manager.save();
  console.log('NLP model trained successfully!');
}

// Train the model on server startup
trainNlp();

// --- 4. CORE BOT LOGIC ---

/**
 * Determines the appropriate bot response based on user input and conversation history.
 * @param {string} message - The user's message.
 * @param {string} language - The current language ('en' or 'hi').
 * @param {Array} history - The array of previous messages.
 * @returns {Promise<object>} A response object for the frontend.
 */
async function getBotResponse(message, language = "en", history = []) {
  const lang = responses[language] ? language : 'en';
  const langResponses = responses[lang];

  // --- Priority 2: If not in a special flow, process with NLP ---
  const nlpResult = await manager.process(lang, message);
  const { intent, score, entities } = nlpResult;
  console.log(`NLP Result: Intent='${intent}', Score=${score}`);

  // --- Standard Intent Matching ---
  if (intent && score > NLP_CONFIDENCE_THRESHOLD && langResponses[intent]) {
    const matchedResponse = langResponses[intent];

    // For all other simple intents
    return {
      response: matchedResponse.response,
      quickReplies: matchedResponse.quickReplies || [],
      fileUrl: matchedResponse.fileUrl || null
    };
  }

  // --- Fallback if no intent is matched ---
  return langResponses.fallback;
}

module.exports = { getBotResponse };