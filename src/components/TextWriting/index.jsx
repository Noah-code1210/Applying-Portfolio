import { useState, useRef, useEffect } from "react" // Import useEffect
import { motion } from "framer-motion"
import "./style.css"

const TextWriting = ({ text, delay, controls, nocursor = false, noblink = false }) => {
  const [pointer, setPointer] = useState(0)
  const spanRefs = useRef([]) // Initialize with an empty array
  const pointerRef = useRef(null)

  // Clear the ref array on each render to prevent accumulation
  // and ensure correct indexing if the text prop changes.
  // This is a common pattern when using ref callbacks with arrays.
  useEffect(() => {
    spanRefs.current = [];
  }, [text]); // Re-run if text changes

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        delayChildren: delay,
        staggerChildren: 0.15,
      },
    },
  }

  const charVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0,
      },
    },
  }

  const handleCharacterComplete = (index) => {
    // Corrected line: Access the DOM element directly from the array
    if (pointerRef.current && spanRefs.current[index]) {
      const spanWidth = spanRefs.current[index].offsetWidth // Corrected
      pointerRef.current.style.opacity = 1
      pointerRef.current.style.animation = "blink 1s ease infinite"
      setPointer((prev) => prev + spanWidth)
    }
  }

  const handleComplete = () => {
    if (pointerRef.current && noblink) { // Added check for pointerRef.current
      pointerRef.current.style.opacity = 0
      pointerRef.current.style.animation = "none"
    }
  }

  return (
    <div className="textWritingContainer">
      <motion.div
        initial="hidden"
        animate={controls || "visible"} // Use || "visible" as fallback if controls is undefined
        variants={textVariants}
        onAnimationComplete={handleComplete} // Removed arrow function, direct reference is fine
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={charVariants}
            onAnimationComplete={() => handleCharacterComplete(index)}
            // Corrected: Push the element directly into the .current array
            ref={(el) => {
              if (el) spanRefs.current[index] = el; // Ensure element exists
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
      {!nocursor && (
        <div ref={pointerRef} className="textWritingContainer--pointer" style={{ left: `${pointer}px` }}></div>
      )}
    </div>
  )
}

export default TextWriting