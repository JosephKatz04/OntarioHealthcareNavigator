import type { SupportedLanguage } from "./languages.ts";

export type GuardrailConfidence = "emergency" | "low";

export type GuardrailResult = {
  triggered: boolean;
  state:
    | "emergency"
    | "medical_advice_refusal"
    | "navigation_allowed";
  answer?: string;
  confidence?: GuardrailConfidence;
};

const emergencyPatterns = [
  /\b911\b/i,
  /\bemergency\b/i,
  /\bunconscious\b/i,
  /\b(can'?t|cannot|trouble|difficulty|hard time)\s+(breathe|breathing)\b/i,
  /\b(shortness of breath|not breathing)\b/i,
  /\bchest pain\b/i,
  /\bsevere bleeding\b/i,
  /\bstroke\b/i,
  /\bheart attack\b/i,
  /\bseizure\b/i,
  /\bsuicidal\b/i,
  /\bkill myself\b/i
];

const diagnosisPatterns = [
  /\bdiagnos(e|is|ing)\b/i,
  /\bwhat do i have\b/i,
  /\bwhat is wrong with me\b/i,
  /\bis this (cancer|a stroke|a heart attack|serious)\b/i
];

const medicationPatterns = [
  /\bhow much\b.*\b(medication|medicine|pill|dose|dosage|ibuprofen|acetaminophen|antibiotic)\b/i,
  /\b(medication|medicine|pill|dose|dosage)\b.*\bshould i take\b/i,
  /\bcan i take\b.*\b(medication|medicine|pill|ibuprofen|acetaminophen|antibiotic)\b/i
];

const treatmentPatterns = [
  /\btreatment plan\b/i,
  /\bhow should i treat\b/i,
  /\bwhat treatment\b/i,
  /\bwhat should i do for my symptoms\b/i,
  /\bshould i take\b.*\bfor\b/i
];

const severeSymptomPatterns = [
  /\bsevere\b.*\b(pain|symptom|headache|vomiting|bleeding)\b/i,
  /\bworst headache\b/i,
  /\bcan'?t move\b/i,
  /\bnumbness\b/i,
  /\bfaint(ed|ing)?\b/i
];

const emergencyAnswers: Record<SupportedLanguage, string> = {
  English:
    "If this may be a medical emergency, call 911 or go to the nearest emergency department now. This chat cannot assess symptoms or decide whether it is safe to wait.",
  French:
    "S'il peut s'agir d'une urgence médicale, appelez le 911 ou allez au service d'urgence le plus proche maintenant. Ce clavardage ne peut pas évaluer les symptômes ni décider s'il est sécuritaire d'attendre.",
  "Mandarin Chinese":
    "如果这可能是医疗紧急情况，请立即拨打 911 或前往最近的急诊部门。本聊天无法评估症状，也无法判断等待是否安全。",
  Punjabi:
    "ਜੇ ਇਹ ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ ਹੋ ਸਕਦੀ ਹੈ, ਤਾਂ ਹੁਣੇ 911 ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ ਸਭ ਤੋਂ ਨੇੜਲੇ ਐਮਰਜੈਂਸੀ ਵਿਭਾਗ ਵਿੱਚ ਜਾਓ। ਇਹ ਚੈਟ ਲੱਛਣਾਂ ਦਾ ਮੁਲਾਂਕਣ ਨਹੀਂ ਕਰ ਸਕਦੀ ਜਾਂ ਇਹ ਫੈਸਲਾ ਨਹੀਂ ਕਰ ਸਕਦੀ ਕਿ ਉਡੀਕ ਕਰਨੀ ਸੁਰੱਖਿਅਤ ਹੈ।",
  Arabic:
    "إذا كان هذا قد يكون طارئاً طبياً، فاتصل بالرقم 911 أو اذهب إلى أقرب قسم طوارئ الآن. لا يمكن لهذه المحادثة تقييم الأعراض أو تحديد ما إذا كان الانتظار آمناً.",
  Hindi:
    "यदि यह मेडिकल इमरजेंसी हो सकती है, तो अभी 911 पर कॉल करें या नज़दीकी इमरजेंसी विभाग में जाएं। यह चैट लक्षणों का आकलन नहीं कर सकती या यह तय नहीं कर सकती कि इंतज़ार करना सुरक्षित है या नहीं।",
  Urdu:
    "اگر یہ طبی ایمرجنسی ہو سکتی ہے تو فوراً 911 پر کال کریں یا قریبی ایمرجنسی ڈیپارٹمنٹ جائیں۔ یہ چیٹ علامات کا اندازہ نہیں لگا سکتی یا یہ فیصلہ نہیں کر سکتی کہ انتظار کرنا محفوظ ہے یا نہیں۔",
  Spanish:
    "Si esto puede ser una emergencia médica, llame al 911 o vaya al departamento de emergencias más cercano ahora. Este chat no puede evaluar síntomas ni decidir si es seguro esperar.",
  Tagalog:
    "Kung maaaring medical emergency ito, tumawag sa 911 o pumunta ngayon sa pinakamalapit na emergency department. Hindi kayang suriin ng chat na ito ang mga sintomas o magpasya kung ligtas maghintay."
};

const medicalAdviceAnswers: Record<SupportedLanguage, string> = {
  English:
    "I cannot diagnose medical conditions. I cannot give medication dosage instructions, provide treatment plans, or interpret severe symptoms. For non-emergency health advice, contact Health811 or a healthcare professional. If symptoms feel severe or urgent, call 911 or go to the nearest emergency department.",
  French:
    "Je ne peux pas fournir de diagnostic, de posologie de médicaments, de plan de traitement ni interpréter des symptômes graves. Pour des conseils de santé non urgents, contactez Health811 ou un professionnel de la santé. Si les symptômes semblent graves ou urgents, appelez le 911 ou allez au service d'urgence le plus proche.",
  "Mandarin Chinese":
    "我不能提供诊断、药物剂量、治疗计划，也不能解释严重症状。对于非紧急健康建议，请联系 Health811 或医疗专业人员。如果症状严重或紧急，请拨打 911 或前往最近的急诊部门。",
  Punjabi:
    "ਮੈਂ ਨਿਦਾਨ, ਦਵਾਈ ਦੀ ਖੁਰਾਕ, ਇਲਾਜ ਯੋਜਨਾ ਜਾਂ ਗੰਭੀਰ ਲੱਛਣਾਂ ਦੀ ਵਿਆਖਿਆ ਨਹੀਂ ਦੇ ਸਕਦਾ। ਗੈਰ-ਐਮਰਜੈਂਸੀ ਸਿਹਤ ਸਲਾਹ ਲਈ Health811 ਜਾਂ ਕਿਸੇ ਸਿਹਤ ਪੇਸ਼ੇਵਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ। ਜੇ ਲੱਛਣ ਗੰਭੀਰ ਜਾਂ ਤੁਰੰਤ ਲੱਗਦੇ ਹਨ, ਤਾਂ 911 ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ ਸਭ ਤੋਂ ਨੇੜਲੇ ਐਮਰਜੈਂਸੀ ਵਿਭਾਗ ਵਿੱਚ ਜਾਓ।",
  Arabic:
    "لا يمكنني تقديم تشخيص أو جرعات أدوية أو خطط علاج أو تفسير أعراض شديدة. للحصول على نصيحة صحية غير طارئة، اتصل بـ Health811 أو بمختص رعاية صحية. إذا بدت الأعراض شديدة أو عاجلة، فاتصل بالرقم 911 أو اذهب إلى أقرب قسم طوارئ.",
  Hindi:
    "मैं निदान, दवा की खुराक, उपचार योजना या गंभीर लक्षणों की व्याख्या नहीं दे सकता। गैर-आपातकालीन स्वास्थ्य सलाह के लिए Health811 या किसी स्वास्थ्य पेशेवर से संपर्क करें। यदि लक्षण गंभीर या तत्काल लगते हैं, तो 911 पर कॉल करें या नज़दीकी इमरजेंसी विभाग में जाएं।",
  Urdu:
    "میں تشخیص، دوا کی خوراک، علاج کا منصوبہ یا شدید علامات کی تشریح نہیں دے سکتا۔ غیر ہنگامی صحت مشورے کے لیے Health811 یا کسی ہیلتھ کیئر پروفیشنل سے رابطہ کریں۔ اگر علامات شدید یا فوری محسوس ہوں تو 911 پر کال کریں یا قریبی ایمرجنسی ڈیپارٹمنٹ جائیں۔",
  Spanish:
    "No puedo proporcionar diagnósticos, dosis de medicamentos, planes de tratamiento ni interpretar síntomas graves. Para consejos de salud que no sean de emergencia, comuníquese con Health811 o con un profesional de la salud. Si los síntomas parecen graves o urgentes, llame al 911 o vaya al departamento de emergencias más cercano.",
  Tagalog:
    "Hindi ako maaaring magbigay ng diagnosis, dosis ng gamot, plano ng paggamot, o interpretasyon ng malubhang sintomas. Para sa hindi emergency na payong pangkalusugan, makipag-ugnayan sa Health811 o sa isang healthcare professional. Kung malubha o urgent ang mga sintomas, tumawag sa 911 o pumunta sa pinakamalapit na emergency department."
};

export function evaluateChatGuardrails(
  message: string,
  language: SupportedLanguage = "English"
): GuardrailResult {
  const trimmed = message.trim();

  if (emergencyPatterns.some((pattern) => pattern.test(trimmed))) {
    return {
      triggered: true,
      state: "emergency",
      confidence: "emergency",
      answer: emergencyAnswers[language]
    };
  }

  if (diagnosisPatterns.some((pattern) => pattern.test(trimmed))) {
    return {
      triggered: true,
      state: "medical_advice_refusal",
      confidence: "low",
      answer: medicalAdviceAnswers[language]
    };
  }

  if (medicationPatterns.some((pattern) => pattern.test(trimmed))) {
    return {
      triggered: true,
      state: "medical_advice_refusal",
      confidence: "low",
      answer: medicalAdviceAnswers[language]
    };
  }

  if (
    treatmentPatterns.some((pattern) => pattern.test(trimmed)) ||
    severeSymptomPatterns.some((pattern) => pattern.test(trimmed))
  ) {
    return {
      triggered: true,
      state: "medical_advice_refusal",
      confidence: "low",
      answer: medicalAdviceAnswers[language]
    };
  }

  return {
    triggered: false,
    state: "navigation_allowed"
  };
}
