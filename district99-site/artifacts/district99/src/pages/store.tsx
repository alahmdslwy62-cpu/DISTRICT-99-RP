import { useListStoreItems } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Package, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Store() {
  const { data: items, isLoading } = useListStoreItems();

  const categories = ["الكل", "VIP", "سيارات", "أموال داخل اللعبة", "أسلحة"];

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ShoppingCart className="w-16 h-16 text-primary mx-auto mb-6 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">متجر السيرفر</h1>
          <p className="text-lg text-muted-foreground">
            ادعم السيرفر واحصل على ميزات حصرية تساعدك في مسيرتك داخل District 99
          </p>
        </motion.div>
      </div>

      {/* Categories (Static for design purposes) */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              i === 0
                ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(0,229,255,0.3)]"
                : "bg-secondary text-secondary-foreground hover:bg-white/10 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border border-white/5 rounded-2xl overflow-hidden">
              <Skeleton className="w-full h-48 rounded-none" />
              <div className="p-6">
                <Skeleton className="w-2/3 h-6 mb-4" />
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-full h-4 mb-6" />
                <Skeleton className="w-1/3 h-8 mb-6" />
                <Skeleton className="w-full h-12" />
              </div>
            </div>
          ))}
        </div>
      ) : items?.length === 0 ? (
        <div className="text-center py-24 bg-card border border-white/5 rounded-2xl">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">لا توجد باقات حالياً</h3>
          <p className="text-muted-foreground">الرجاء العودة لاحقاً لتفقد الباقات الجديدة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items?.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-card border border-card-border rounded-2xl overflow-hidden flex flex-col group hover:border-primary/40 transition-colors relative"
            >
              {/* Special glowing border effect for available items */}
              {item.available && (
                <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-primary/20 rounded-2xl transition-colors" />
              )}
              
              <div className="h-48 bg-secondary/50 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent z-10" />
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover z-0" />
                ) : (
                  <Package className="w-24 h-24 text-muted-foreground/30 z-0 group-hover:scale-110 transition-transform duration-500" />
                )}
                
                {item.category.toLowerCase().includes("vip") && (
                  <div className="absolute top-4 right-4 z-20 bg-amber-500/20 text-amber-500 border border-amber-500/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    <Star className="w-3 h-3" /> VIP
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1 z-20 relative bg-card">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="w-4 h-4" />
                  <span>باقة دائمة</span>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                  {item.description}
                </p>

                <div className="mt-auto">
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-black text-white font-mono">{item.price}</span>
                    <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider ml-1">USD</span>
                  </div>

                  <button 
                    disabled={!item.available}
                    className={`w-full py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      item.available 
                        ? "bg-primary/10 text-primary border border-primary/50 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                        : "bg-secondary text-muted-foreground cursor-not-allowed border border-white/5"
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {item.available ? "شراء الباقة" : "غير متوفر حالياً"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
