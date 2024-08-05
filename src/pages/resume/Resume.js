import PageHeader from "../../components/PageHeader";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const Resume = ({ brand }) => {
  return (
    <section className="resume container">
      <PageHeader title="Resume" description="Uncover my expertise" />
            <a target="_blank" href="https://docs.google.com/document/d/1wP6wDUTpeZZLWV2prCfHgrvzzPgsOJwS/edit?usp=sharing&ouid=110563412392633040581&rtpof=true&sd=true">
                <motion.button
                className="btn"
                // Apply scale animation on hover
                whileHover={{ scale: 1.05 }}
                // Apply scale animation on tap
                whileTap={{ scale: 0.99 }}
                style={{ backgroundColor: "sky-blue"}}
                >
                {/* Display the button name */}
                Resume
                <div>
                    {/* Display the arrow icon */}
                    <FiArrowUpRight className="arrow-icon" />
                </div>
                </motion.button>
            </a>
    </section>
  );
};

export default Resume;
