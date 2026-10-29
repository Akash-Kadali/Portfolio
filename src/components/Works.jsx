import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "motion/react";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  website_link
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='project-card p-4 rounded-[24px] sm:w-[360px] w-full'
      >
        <div className='project-image relative w-full h-[230px] overflow-hidden rounded-[18px]'>
          <img
            src={image}
            
            alt='project_image'
            className='w-full h-full object-cover'
          />

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className='project-link w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
            >
              <img
                src={github}
                alt='source code'
                className='w-1/2 h-1/2 object-contain'
              />
            </div>
          </div>
        </div>

        <div className='mt-5'>
          <div className='flex items-start justify-between gap-3'>
            <h3 className='text-white font-semibold text-[22px]'>{name}</h3>
            <a target="_blank" rel="noreferrer" className="project-arrow" href={website_link} aria-label={`Open ${name}`}>↗</a>
          </div>
          <p className='mt-2 text-secondary text-[14px] leading-6'>{description}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} `}>04 / Selected work</p>
        <h2 className={`${styles.sectionHeadText}`}>Ideas, trained.<br/>Systems, shipped.</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          A selection of applied machine learning work across medical imaging,
          conversational AI, graph learning, and intelligent interfaces. Each
          project started with a real problem—not a model looking for one.
        </motion.p>
      </div>

      <div className='mt-14 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6'>
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
