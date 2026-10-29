import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "motion/react";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className='service-item xs:w-[250px] w-full'>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full rounded-[20px]'
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='service-card rounded-[20px] py-8 px-8 min-h-[240px] flex justify-between items-start flex-col'
      >
        <img
          src={icon}
          alt='web-development'
          className='w-14 h-14 object-contain service-icon'
        />

        <h3 className='text-white text-[20px] font-semibold text-left'>
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>01 / About</p>
        <h2 className={styles.sectionHeadText}>Research depth.<br/>Product instinct.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='about-copy mt-7 text-secondary text-[18px] max-w-4xl leading-[32px]'
      >
        I’m a Machine Learning Engineer at Parspec and a 2026 graduate of the University of Maryland’s MS in Applied Machine Learning program. I work across backend engineering, computer vision, NLP, generative AI, LLM integration, data pipelines, model development, and scalable inference. Across Parspec, SnugFit Solutions, Ayar Labs, IIT Indore, and MNIT Jaipur, I’ve focused on turning ambiguous problems into production systems people can actually use.
      </motion.p>

      <div className='mt-16 grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
