import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "wouter";
import { useCreateActivationRequest } from "@workspace/api-client-react";

import { Check, ChevronLeft, ChevronRight, User, Gamepad2, FileText, ShieldAlert } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const RpExperience = {
  none: 'none',
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
} as const;

const formSchema = z.object({
  fullName: z.string().min(2, "الاسم الكامل يجب أن يكون أكثر من حرفين"),
  discordId: z.string().min(2, "معرف الديسكورد مطلوب"),
  age: z.coerce.number().min(14, "يجب أن يكون عمرك 14 سنة أو أكثر").max(99, "العمر غير صالح"),
  country: z.string().min(2, "الدولة/المحافظة مطلوبة"),
  rpExperience: z.nativeEnum(RpExperience, { required_error: "اختر مستوى خبرتك" }),
  whyJoin: z.string().min(20, "يجب كتابة 20 حرفاً على الأقل في سبب الانضمام"),
  hasReadRules: z.literal(true, {
    errorMap: () => ({ message: "يجب الموافقة على القوانين" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Activation() {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const createRequest = useCreateActivationRequest();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      discordId: "",
      age: "" as unknown as number,
      country: "",
      whyJoin: "",
    },
    mode: "onChange",
  });

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger(["fullName", "discordId", "age", "country"]);
    } else if (step === 2) {
      isValid = await form.trigger(["rpExperience", "whyJoin"]);
    }

    if (isValid) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await createRequest.mutateAsync({ data });
      setIsSuccess(true);
      setIsError(false);
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card border border-primary/20 rounded-2xl p-10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <div className="text-7xl mb-6 select-none">✅</div>
          <h2 className="text-3xl font-bold text-white mb-4">تم إرسال طلبك بنجاح!</h2>
          <p className="text-muted-foreground mb-8">
            تم استلام طلب التفعيل الخاص بك. ستقوم الإدارة بمراجعته في أقرب وقت ممكن. يرجى متابعة حالة الطلب عبر الديسكورد الخاص بنا.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
          >
            العودة للرئيسية
          </Link>
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card border border-red-500/20 rounded-2xl p-10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
          <div className="text-7xl mb-6 select-none">❌</div>
          <h2 className="text-3xl font-bold text-white mb-4">حدث خطأ!</h2>
          <p className="text-muted-foreground mb-8">
            لم نتمكن من إرسال طلبك. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.
          </p>
          <button
            onClick={() => setIsError(false)}
            className="inline-block px-8 py-3 bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-lg hover:bg-red-500/30 transition-colors"
          >
            حاول مرة أخرى
          </button>
        </motion.div>
      </div>
    );
  }

  const steps = [
    { num: 1, title: "معلومات شخصية", icon: <User className="w-5 h-5" /> },
    { num: 2, title: "تجربة الرول بلاي", icon: <Gamepad2 className="w-5 h-5" /> },
    { num: 3, title: "القوانين والتأكيد", icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-3xl">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-white text-center mb-8">طلب التفعيل</h1>
        
        {/* Stepper */}
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-secondary -z-10" />
          <div className="absolute right-0 top-1/2 h-0.5 bg-primary -z-10 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />
          
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-colors duration-300 bg-background
                  ${step > s.num ? "border-primary bg-primary text-primary-foreground" : 
                    step === s.num ? "border-primary text-primary shadow-[0_0_15px_rgba(0,229,255,0.3)]" : 
                    "border-secondary text-muted-foreground"}`}
              >
                {step > s.num ? <Check className="w-6 h-6" /> : s.icon}
              </div>
              <span className={`text-sm hidden sm:block ${step >= s.num ? "text-white font-medium" : "text-muted-foreground"}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-white/5 p-6 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">البيانات الأساسية</h3>
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">الاسم الكامل</FormLabel>
                        <FormControl>
                          <Input placeholder="الاسم الحقيقي (مثال: أحمد محمد)" className="bg-background border-white/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="discordId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">معرف الديسكورد (Discord ID / Username)</FormLabel>
                        <FormControl>
                          <Input placeholder="username#1234 أو ID" className="bg-background border-white/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">العمر</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="18" className="bg-background border-white/10" {...field} />
                          </FormControl>
                          <FormDescription>الحد الأدنى 14 سنة</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground">الدولة / المحافظة</FormLabel>
                          <FormControl>
                            <Input placeholder="السعودية، الرياض" className="bg-background border-white/10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">خبرتك في اللعب</h3>

                  <FormField
                    control={form.control}
                    name="rpExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">خبرة الرول بلاي</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background border-white/10 h-12">
                              <SelectValue placeholder="اختر مستوى خبرتك" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover border-white/10">
                            <SelectItem value={RpExperience.none}>مبتدئ تماماً (أول مرة)</SelectItem>
                            <SelectItem value={RpExperience.beginner}>مبتدئ (أعرف الأساسيات)</SelectItem>
                            <SelectItem value={RpExperience.intermediate}>متوسط (لعبت في سيرفرات أخرى)</SelectItem>
                            <SelectItem value={RpExperience.advanced}>محترف (خبرة طويلة)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whyJoin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">لماذا تريد الانضمام إلى District 99؟</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="اكتب نبذة عن سبب اختيارك للسيرفر وماذا تتوقع من تجربتك هنا..." 
                            className="bg-background border-white/10 min-h-[150px] resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>يجب ألا يقل عن 20 حرفاً</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">الإقرار والقوانين</h3>

                  <div className="bg-background p-6 rounded-lg border border-white/5 mb-6">
                    <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-primary" />
                      تذكير هام
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      نرجو منك قراءة <Link href="/rules" className="text-primary hover:underline">قوانين السيرفر</Link> بشكل كامل قبل إرسال الطلب. 
                      مخالفتك للقوانين بحجة عدم المعرفة لن يتم قبولها كعذر وقد تعرضك للحظر.
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside px-4">
                      <li>تأكد من أن معرف الديسكورد صحيح تماماً لكي نتمكن من التواصل معك</li>
                      <li>تقديم معلومات خاطئة سيؤدي إلى رفض الطلب</li>
                      <li>القرار النهائي بشأن قبول الطلب يعود للإدارة</li>
                    </ul>
                  </div>

                  <FormField
                    control={form.control}
                    name="hasReadRules"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 rounded-md border border-white/10 p-4 bg-background">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-white font-medium cursor-pointer">
                            لقد قرأت وأوافق على جميع قوانين السيرفر
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            أقر بأن جميع المعلومات المقدمة صحيحة وأتحمل المسؤولية كاملة.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="h-6">
                    {form.formState.errors.hasReadRules && (
                      <p className="text-sm font-medium text-destructive">{form.formState.errors.hasReadRules.message}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2.5 flex items-center gap-2 text-white bg-secondary rounded-md hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                  السابق
                </button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-2.5 flex items-center gap-2 bg-primary text-primary-foreground font-bold rounded-md hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all"
                >
                  التالي
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={createRequest.isPending}
                  className="px-10 py-3 bg-primary text-primary-foreground font-bold rounded-md shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createRequest.isPending ? "جاري الإرسال..." : "إرسال الطلب"}
                </button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
