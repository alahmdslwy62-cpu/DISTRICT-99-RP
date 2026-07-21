import { motion } from "framer-motion";
import { Link } from "wouter";
import logoUrl from "@assets/image_1784548542182-B_34P9Wg_1784561566274.png";
import introVideoUrl from "@assets/GTA_V_FiveM_Intro_1784550831508-B3M73fUO_1784561566274.mp4";
import { useGetServerStats } from "@workspace/api-client-react";
import { Users, Server, Shield, Activity } from "lucide-react";

export default function Home() {
  const { data: stats } = useGetServerStats();

  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "مجتمع متفاعل",
      description: "آلاف اللاعبين بانتظارك في بيئة لعب نظيفة وممتعة"
    },
    {
      icon: <Server className="w-8 h-8 text-primary" />,
      title: "سيرفر مستقر",
      description: "بنية تحتية قوية تضمن تجربة لعب سلسة بدون لاق"
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "حماية متقدمة",
      description: "نظام حماية ضد الغش لضمان عدالة اللعب للجميع"
    },
    {
      icon: <Activity className="w-8 h-8 text-primary" />,
      title: "تحديثات مستمرة",
      description: "إضافات حصرية، سيارات، ومهمات جديدة باستمرار"
    }
  ];

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-background/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30 z-10 pointer-events-none mix-blend-overlay" />
          
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={introVideoUrl} type="video/mp4" />
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-4 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <img 
              src={logoUrl} 
              alt="District 99 Logo" 
              className="w-48 md:w-64 lg:w-80 h-auto mx-auto drop-shadow-[0_0_30px_rgba(0,229,255,0.6)]" 
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-tight"
          >
            سيرفر الرول بلاي الأول <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00b3ff] to-white drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]">
              في الوطن العربي
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            عش حياة واقعية متكاملة، ابنِ مسيرتك، وكوّن عصابتك أو التحق بالقوات الأمنية في مدينة لا تنام.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/activation"
              className="w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-sm 
                       shadow-[0_0_20px_rgba(0,229,255,0.5)] transition-all duration-300 
                       hover:scale-105 hover:shadow-[0_0_30px_rgba(0,229,255,0.8)]"
            >
              انضم الآن
            </Link>
            <Link
              href="/rules"
              className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 text-white font-bold text-lg rounded-sm 
                       backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            >
              قوانين السيرفر
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 relative z-20 bg-background/80 backdrop-blur-xl shadow-2xl">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <span className="text-3xl md:text-4xl font-black text-white mb-2 font-mono">
                {stats ? stats.approvedRequests : "99+"}
              </span>
              <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest">مواطن معتمد</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-3xl md:text-4xl font-black text-white mb-2 font-mono">
                {stats ? stats.totalStoreItems : "24"}
              </span>
              <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest">باقات المتجر</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-3xl md:text-4xl font-black text-primary mb-2 font-mono drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
                24/7
              </span>
              <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest">تغطية أمنية</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-3xl md:text-4xl font-black text-white mb-2 font-mono">
                100%
              </span>
              <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest">واقعية</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">لماذا District 99؟</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نقدم لك التجربة الأفضل والأكثر واقعية في عالم الرول بلاي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-card border border-card-border p-8 rounded-xl hover:border-primary/50 transition-colors duration-300 group"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
