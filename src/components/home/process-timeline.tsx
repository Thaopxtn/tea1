"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

const teaProcessSteps = [
  {
    title: "Thu hái",
    detail:
      "Chọn một tôm hai lá vào sáng sớm, tránh búp dập nát để giữ hương xanh non.",
    craft: "Búp non",
    image: "/images/catalog-tra-bup.webp",
    alt: "Búp trà Thái Nguyên xanh non vừa được thu hái",
  },
  {
    title: "Làm héo",
    detail:
      "Trải mỏng trên nong tre để lá dịu xuống, bay bớt ẩm nhưng vẫn còn độ mềm.",
    craft: "Hong dịu",
    image: "/images/nghe-nhan.png",
    alt: "Đôi tay nghệ nhân tuyển và làm héo búp chè trên nia tre",
  },
  {
    title: "Diệt men",
    detail:
      "Dùng nhiệt cao đúng lúc để khóa màu nước xanh và hạn chế oxy hóa quá đà.",
    craft: "Khóa hương",
    image: "/images/tra-bup-thai-nguyen.png",
    alt: "Búp trà xanh sau công đoạn diệt men",
  },
  {
    title: "Vò trà",
    detail:
      "Vò đều tay để cánh săn lại, giải phóng dịch trà và tạo dáng cong tự nhiên.",
    craft: "Tạo cánh",
    image: "/images/tra-moc-cau-thai-nguyen.png",
    alt: "Cánh trà móc câu Thái Nguyên sau khi vò tạo dáng",
  },
  {
    title: "Sao khô",
    detail:
      "Sao nhiều lượt với lửa nhỏ dần để hạ ẩm, cố định hương cốm và hậu ngọt.",
    craft: "Giữ hậu",
    image: "/images/catalog-tra-moc-cau.webp",
    alt: "Cánh trà khô xanh sẫm sau khi sao",
  },
  {
    title: "Phân loại",
    detail:
      "Sàng bỏ cám, cánh vụn và chọn lại theo độ đều để mẻ trà sạch, đẹp mắt.",
    craft: "Sàng tuyển",
    image: "/images/tra-still-life.png",
    alt: "Trà khô được bày cùng chén gốm để kiểm tra thành phẩm",
  },
  {
    title: "Đóng gói",
    detail:
      "Đóng kín, hạn chế oxy và hơi ẩm để hương trà ổn định khi đến tay người uống.",
    craft: "Khóa tươi",
    image: "/images/catalog-hop-qua.webp",
    alt: "Hộp quà trà được đóng gói chỉn chu",
  },
];

export function ProcessTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="relative py-12 md:py-16 w-full max-w-6xl mx-auto px-0 md:px-6">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16">
        
        {/* Left Column: Tabs */}
        <div className="flex-none w-full md:w-[320px] lg:w-[360px] flex flex-row md:flex-col gap-3 md:gap-2 overflow-x-auto snap-x snap-mandatory px-6 md:px-0 pb-4 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {teaProcessSteps.map((step, index) => {
            const isActive = index === activeStep;
            return (
              <button
                key={step.title}
                onClick={() => setActiveStep(index)}
                className={`snap-start relative flex-shrink-0 flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left border w-[260px] md:w-full ${
                  isActive 
                    ? "bg-[var(--cream-50)] border-[var(--border)] shadow-[0_2px_12px_rgb(16_45_37_/_4%)]" 
                    : "border-transparent hover:bg-[rgb(0_0_0_/_0.03)] opacity-50 hover:opacity-100"
                }`}
              >
                <span className="font-serif text-3xl md:text-4xl font-semibold text-[var(--tea-800)] w-10 md:w-12 opacity-80">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <span className="block text-[0.65rem] font-bold tracking-widest uppercase text-[var(--tea-800)] mb-1 opacity-70">
                    {step.craft}
                  </span>
                  <strong className="font-serif text-lg md:text-xl font-semibold text-[var(--tea-950)]">
                    {step.title}
                  </strong>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 border-[1.5px] border-[var(--tea-800)] rounded-xl pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column: Content area */}
        <div className="flex-1 px-6 md:px-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col gap-6"
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-[var(--border)] bg-[var(--cream-100)]">
                <Image
                  src={teaProcessSteps[activeStep].image}
                  alt={teaProcessSteps[activeStep].alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  priority={activeStep === 0}
                />
              </div>

              {/* Text detail */}
              <div className="bg-transparent md:bg-[var(--cream-50)] md:p-8 md:rounded-2xl md:border md:border-[var(--border)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none hidden md:block">
                   <span className="font-serif text-[12rem] font-bold leading-none -mt-12 -mr-4">
                     {String(activeStep + 1).padStart(2, "0")}
                   </span>
                </div>
                <div className="relative z-10">
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[var(--tea-950)] mb-3">
                    {teaProcessSteps[activeStep].title}
                  </h3>
                  <p className="text-[var(--ink-600)] text-base md:text-lg leading-relaxed max-w-[48ch]">
                    {teaProcessSteps[activeStep].detail}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
