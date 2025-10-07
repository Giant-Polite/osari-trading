import { TypeAnimation } from "react-type-animation";
import { FC } from "react"; // Add this import


// Define the props interface
interface TypewriterTextProps {
  speed: number;
}

const TypewriterText: FC<TypewriterTextProps> = ({ speed }) =>{
  return (
    <TypeAnimation
      sequence={[
        "Grains", 2000,  // wait 2s after typing
        "Pasta", 2000,
        "Spices", 2000,
        "Snacks", 2000,
        "Tea", 2000,
        "Coffee", 2000,
        "Beverages", 2000,
        "Dates", 2000,
        "Sauces & Dips", 2000,
      ]}
      wrapper="span"
      repeat={Infinity}
      cursor={true}
      className="text-3xl md:text-4xl font-extrabold text-[#8B4513]"
    />
  );
};

export default TypewriterText;
