import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { styles } from "../styles";
import { ComputersCanvas } from "./canvas";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleResize = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <section className='hero-section relative w-full min-h-screen mx-auto overflow-hidden'>
      <div
        className={`hero-copy absolute inset-0 top-[145px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className='max-w-[760px] relative z-10'>
          <div className='eyebrow'><span /> Applied ML · Computer Vision · AI Systems</div>
          <h1 className={`${styles.heroHeadText} text-white mt-6`}>
            I build intelligent systems that <span className='hero-accent'>see, reason, and ship.</span>
          </h1>
          <p className={`${styles.heroSubText} mt-6 text-white-100 max-w-2xl`}>
            I'm Sri Akash Kadali — a machine learning engineer turning research ideas into reliable, real-world products.
          </p>
          <div className='hero-actions mt-9 flex flex-wrap gap-4'>
            <a className='button button-primary' href='#projects'>Explore my work <span>↗</span></a>
            <a className='button button-ghost' href='#contact'>Start a conversation</a>
          </div>
          <div className='hero-proof mt-12 flex flex-wrap gap-8'>
            <div><strong>04</strong><span>research & industry roles</span></div>
            <div><strong>10+</strong><span>applied AI projects</span></div>
            <div><strong>UMD</strong><span>MS Applied ML</span></div>
          </div>
        </div>
      </div>

      {/* ✅ Only render 3D canvas if NOT on mobile */}
      {!isMobile && <ComputersCanvas />}

      <div className='scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center items-center'>
        <a href='#about'>
          <div className='w-[30px] h-[48px] rounded-3xl border border-white/30 flex justify-center items-start p-2'>
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              className='w-1.5 h-1.5 rounded-full bg-white mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
