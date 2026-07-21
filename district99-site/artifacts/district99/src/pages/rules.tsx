import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const rules = [
  {
    title: "قوانين الحياة الجديدة - NLR",
    content: [
      "عند الموت والرجوع (Respawn)، يُعتبر شخصيتك قد بدأت حياة جديدة تماماً.",
      "لا يحق لك تذكّر من قتلك، أو سبب موتك، أو أي حدث وقع قبل موتك.",
      "ممنوع العودة إلى مكان موتك لمدة 15 دقيقة على الأقل.",
      "ممنوع الانتقام من شخص قتلك في نفس السيناريو بعد الـ Respawn.",
    ],
  },
  {
    title: "باور جيمنج - PowerGaming",
    content: [
      "ممنوع إجبار لاعب آخر على فعل شيء بدون إعطائه فرصة للرد أو التصرف.",
      "ممنوع استخدام قدرات أو مهارات غير واقعية لشخصيتك (مثل: رفع سيارة بيديك).",
      "يجب احترام حدود الواقعية في جميع التفاعلات مع اللاعبين الآخرين.",
      "ممنوع استغلال ميكانيكيات اللعبة بشكل غير واقعي لكسب أفضلية.",
    ],
  },
  {
    title: "الخوف على الحياة - NVL",
    content: [
      "يجب على شخصيتك الخوف من الموت والتصرف بشكل واقعي عند تعرضها للخطر.",
      "إذا كان سلاح موجه نحوك من مسافة قريبة، يجب عليك الامتثال للأوامر.",
      "ممنوع مواجهة شخص مسلح وأنت أعزل أو في وضع أضعف بشكل غير واقعي.",
      "تصرف دائماً كأن حياة شخصيتك لها قيمة حقيقية.",
    ],
  },
  {
    title: "الميتا جيمنج - Metagaming",
    content: [
      "ممنوع استخدام معلومات حصلت عليها خارج اللعبة (ستريم، ديسكورد، إلخ) داخل اللعبة.",
      "ممنوع التواصل عبر برامج خارجية (Discord Call) للتنسيق خلال الأحداث داخل اللعبة.",
      "ممنوع استخدام اسم لاعب آخر الذي تراه فوق رأسه إذا لم تكن تعرفه في الـ RP.",
      "كل المعلومات يجب أن تُكتسب بشكل طبيعي داخل السيرفر.",
    ],
  },
  {
    title: "القتل العشوائي - RDM",
    content: [
      "RDM (Random Deathmatch): ممنوع قتل أي لاعب بدون سبب أو سيناريو مسبق.",
      "VDM (Vehicle Deathmatch): ممنوع استخدام المركبات كسلاح لدهس اللاعبين بدون مبرر.",
      "يجب وجود تفاعل RP واضح قبل اللجوء إلى العنف.",
      "الإنذارات اللفظية مطلوبة قبل إطلاق النار في معظم الحالات.",
    ],
  },
  {
    title: "قانون تقدير الحياة - NWL",
    content: [
      "يجب على شخصيتك تقدير حياتها وعدم التهور في المواقف الخطيرة.",
      "ممنوع تحدي شخص يمسك بك رهينة أو يهدد حياتك مباشرة.",
      "تصرف بشكل واقعي عند تعرضك للإصابات أو التهديدات المسلحة.",
      "الاستسلام عند الضرورة جزء أساسي من تجربة الـ RP الواقعية.",
    ],
  },
  {
    title: "القوانين العامة",
    content: [
      "يُمنع الشتم، العنصرية، أو التمييز بأي شكل خارج الشخصية.",
      "يجب البقاء داخل الشخصية (In Character) طوال الوقت داخل السيرفر.",
      "ممنوع استغلال الثغرات (Bugs/Exploits) ويجب التبليغ عنها فوراً.",
      "المناطق الآمنة (Safe Zones) مثل المستشفيات ومراكز الشرطة محمية من أي أحداث.",
      "احترام جميع اللاعبين والإدارة إلزامي في جميع الأوقات.",
    ],
  },
  {
    title: "نظام الوورنتات",
    content: [
      "يتم احتساب الوورنتات (الإنذارات) بناءً على حجم المخالفة.",
      "3 وورنتات تؤدي إلى بان (حظر) مؤقت.",
      "5 وورنتات تؤدي إلى بان (حظر) دائم.",
      "يحق للإدارة إعطاء بان مباشر بدون وورنتات في حالات الغش أو التخريب المتعمد.",
    ],
  },
  {
    title: "قوانين الغش والبانات",
    content: [
      "يُمنع منعاً باتاً استخدام أي برامج غش (Cheats/Hacks) أو مودات غير مصرح بها.",
      "استخدام الغش يؤدي إلى بان دائم فوري بدون تحذير.",
      "ممنوع مشاركة أي برامج غش أو مساعدة لاعبين آخرين على الغش.",
      "محاولة تجاوز الحظر بحسابات مختلفة تؤدي إلى حظر IP دائم.",
    ],
  },
  {
    title: "قوانين العصابات",
    content: [
      "يجب تسجيل العصابة رسمياً عبر الإدارة للحصول على الاعتراف الكامل.",
      "لا يمكن اختطاف شرطي إلا إذا كان هناك 3 أفراد شرطة آخرين متواجدين كحد أدنى.",
      "الحروب بين العصابات يجب أن يكون لها مبرر RP واضح قبل بدئها.",
      "الاعتداء على مقرات الشرطة أو المستشفيات (Safe Zones) ممنوع قطعياً.",
      "يُمنع ترهيب اللاعبين الجدد أو إجبارهم على الانضمام بالقوة.",
    ],
  },
];

export default function Rules() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            قوانين السيرفر
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            اقرأ جميع القوانين بعناية. مخالفتها تؤدي إلى عقوبات صارمة.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-2">
          {rules.map((rule, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className={`rounded-lg border transition-colors duration-200 ${
                  isOpen
                    ? "border-white/10 bg-white/5"
                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-right"
                >
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                  <span className="text-white font-bold text-lg">
                    {rule.title}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 pt-1">
                    <ul className="space-y-3 border-t border-white/5 pt-4">
                      {rule.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-right">
                          <span className="text-muted-foreground leading-relaxed flex-1">
                            {item}
                          </span>
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-14 text-center"
        >
          <p className="text-muted-foreground mb-4">
            قرأت القوانين وأنا مستعد؟
          </p>
          <Link
            href="/activation"
            className="inline-block px-10 py-3 bg-primary text-primary-foreground font-bold rounded-lg
                       shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)]
                       transition-all duration-300 hover:scale-105"
          >
            تقديم طلب التفعيل
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
