import React, { useEffect, useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

// Card component
const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  website_link,
  isMobile,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.3, 0.75)}>
      <Tilt
        tiltEnable={!isMobile}
        tiltMaxAngleX={isMobile ? 0 : 20}
        tiltMaxAngleY={isMobile ? 0 : 20}
        className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div className='relative w-full h-[230px]'>
          <img
            src={image}
            alt={name}
            onError={(e) => {
              e.target.style.display = "none";
              console.error(`Image failed to load: ${image}`);
            }}
            className='w-full h-full object-cover rounded-2xl'
          />

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover gap-1'>
            {source_code_link && (
              <div
                onClick={() => window.open(source_code_link, "_blank")}
                className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
              >
                <img
                  src={github}
                  alt='source code'
                  className='w-1/2 h-1/2 object-contain'
                />
              </div>
            )}
            {website_link && (
              <div
                onClick={() => window.open(website_link, "_blank")}
                className='blue-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
              >
                <span className='text-white text-sm font-bold'>↗</span>
              </div>
            )}
          </div>
        </div>

        <div className='mt-5'>
          <h3 className='text-white font-bold text-[20px]'>{name}</h3>
          <p className='mt-2 text-secondary text-[14px]'>{description}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {Array.isArray(tags) &&
            tags.map((tag, idx) => (
              <p
                key={`${name}-${tag.name || idx}`}
                className={`text-[14px] ${tag.color || ""}`}
              >
                #{tag.name || tag}
              </p>
            ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

// Main section
const Works = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleResize = (event) => setIsMobile(event.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleResize);
    } else {
      mediaQuery.addListener(handleResize); // Fallback for older browsers
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleResize);
      } else {
        mediaQuery.removeListener(handleResize);
      }
    };
  }, []);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>My Portfolio</p>
        <h2 className={styles.sectionHeadText}>Projects.</h2>
      </motion.div>

      <div className='w-full flex'>
        <p className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'>
          Here are a few of the machine learning, computer vision, and AI projects I've built or contributed to. Click on the GitHub icon to see code, or ↗ to open a live demo.
        </p>
      </div>

      <div className='mt-20 w-full flex flex-wrap gap-7 justify-center overflow-visible'>
        {projects.map((project, index) => (
          <ProjectCard
            key={`project-${index}`}
            index={index}
            isMobile={isMobile}
            {...project}
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "");
