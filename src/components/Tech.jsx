import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  return (
    <div className='tech-grid flex flex-row flex-wrap justify-center gap-5'>
      {technologies.map((technology) => (
        <div className='tech-item w-28 h-32 flex flex-col items-center justify-center gap-2' key={technology.name}>
          <img
            src={technology.icon}
            alt={technology.name}
            className='w-full h-full object-contain'
          />
          <span className='text-secondary text-[12px] text-center'>{technology.name}</span>
        </div>
      ))}
    </div>
  );
};

export default SectionWrapper(Tech, "");
