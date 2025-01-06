import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import validator from "email-validator";
import Button from "./Button";

// Make sure to import the EmailJS package at the top of your file
import emailjs from '@emailjs/browser';

/**
 * Contact Form Component
 * ----------------------
 * This component represents a fully functional contact form.
 * Form Submission API Key: 
 * -------------------------
 * To enable form submissions, obtain your API Key from EmailJS.
 * 
 * Follow these steps to use EmailJS in your app:
 * 1. Get your public key from the EmailJS dashboard.
 * 2. Replace the `YOUR_PUBLIC_KEY` below with your actual public key.
 */

const Form = () => {
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [subjectError, setSubjectError] = useState(false);
  const [messageError, setMessageError] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Initialize EmailJS with your public key
  useEffect(() => {
    emailjs.init(process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY); // Replace with your actual public key from EmailJS
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle input focus to reset error state
  const handleInputFocus = (errorStateSetter) => {
    errorStateSetter(false);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate and set error states
    formData.name === "" ? setNameError(true) : setNameError(false);
    formData.email === "" || !validator.validate(formData.email)
      ? setEmailError(true)
      : setEmailError(false);
    formData.subject === "" ? setSubjectError(true) : setSubjectError(false);
    formData.message === "" ? setMessageError(true) : setMessageError(false);

    // Handle invalid form
    if (
      nameError ||
      emailError ||
      messageError ||
      subjectError ||
      !validator.validate(formData.email) ||
      formData.name === "" ||
      formData.email === "" ||
      formData.subject === "" ||
      formData.message === ""
    ) {
      setFormData({
        ...formData,
        email: "",
      });
      setSending(false);
      setFailed(true);
      return;
    }

    // Form submission in progress
    setSending(true);

    // Create a FormData object to send to EmailJS
    const form = document.querySelector("#contact-form");

    // Ensure EmailJS is properly initialized before calling sendForm
    if (emailjs) {
      emailjs
        .sendForm("contact_service", "contact_form", form) // Replace YOUR_SERVICE_ID with your service ID from EmailJS
        .then(
          () => {
            setSending(false);
            setSuccess(true);
            setFailed(false);
            setFormData({
              ...formData,
              name: "",
              email: "",
              subject: "",
              message: "",
            });
            setTimeout(() => {
              setSuccess(false);
            }, 3000);
          },
          (error) => {
            console.error("Failed to send message:", error);
            setSending(false);
            setFailed(true);
          }
        );
    } else {
      console.error("EmailJS is not properly initialized.");
    }
  };

  // Determine button text based on status
  const handleButtonText = () => {
    if (sending) {
      return "Please wait...";
    } else if (success) {
      return "Message Sent";
    } else if (failed || nameError || messageError || emailError || subjectError) {
      return "Try again";
    } else {
      return "Send Message";
    }
  };

  return (
    <motion.form
      id="contact-form"
      ref={ref}
      className="contactForm"
      initial={{ y: "10vw", opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: "10vw", opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      onSubmit={handleSubmit}
    >
      <h4 className="contentTitle">Send a Message</h4>
      {/* Input fields */}
      <div className="col-12 col-md-6 formGroup" style={{ display: "inline-block" }}>
        <input
          type="text"
          className={`formControl ${nameError ? "formError" : ""}`}
          onFocus={() => {
            handleInputFocus(setNameError);
          }}
          onChange={handleChange}
          value={formData.name}
          id="contactName"
          name="name"
          placeholder={`${nameError ? "Please enter your name" : "Name"}`}
          autoComplete="name"
        />
      </div>
      <div className="col-12 col-md-6 formGroup" style={{ display: "inline-block" }}>
        <input
          type="text"
          className={`formControl ${emailError ? "formError" : ""}`}
          onFocus={() => {
            handleInputFocus(setEmailError);
          }}
          onChange={handleChange}
          value={formData.email}
          id="contactEmail"
          name="email"
          placeholder={`${emailError ? "Please enter a valid email" : "Email"}`}
          autoComplete="email"
        />
      </div>
      <div className="col-12 formGroup">
        <input
          type="text"
          className={`formControl ${subjectError ? "formError" : ""}`}
          onFocus={() => {
            handleInputFocus(setSubjectError);
          }}
          onChange={handleChange}
          value={formData.subject}
          id="contactSubject"
          name="subject"
          placeholder={`${subjectError ? "Please enter a subject" : "Subject"}`}
          autoComplete="off"
        />
      </div>
      <div className="col-12 formGroup">
        <textarea
          className={`formControl ${messageError ? "formError" : ""}`}
          onFocus={() => {
            handleInputFocus(setMessageError);
          }}
          onChange={handleChange}
          value={formData.message}
          name="message"
          id="contactMessage"
          rows="5"
          placeholder={`${messageError ? "Please enter a message" : "Message"}`}
          autoComplete="off"
        ></textarea>
      </div>
      {/* Form submission button */}
      <motion.div className="col-12 formGroup formSubmit">
        <Button
          name={handleButtonText()}
          disabled={nameError || messageError || emailError || subjectError || sending || success}
        />
      </motion.div>
    </motion.form>
  );
};

export default Form;

