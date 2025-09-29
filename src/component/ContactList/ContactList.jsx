import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./ContactList.css";

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const ContactList = () => {
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('contacts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (values, { resetForm }) => {
    const newContact = { ...values, id: Date.now() };
    setContacts([...contacts, newContact]);
    resetForm();
  };

  const deleteContact = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <div className="contact-container">
      <h2>Contact List</h2>

      <Formik
        initialValues={{ name: "", phone: "", email: "" }}
        validationSchema={validationSchema}
        onSubmit={addContact}
      >
        {({ errors, touched }) => (
          <Form className="contact-form">
            <div className="field-group">
              <Field
                type="text"
                name="name"
                placeholder="Name"
                className={errors.name && touched.name ? "error" : ""}
              />
              <ErrorMessage
                name="name"
                component="div"
                className="error-message"
              />
            </div>

            <div className="field-group">
              <Field
                type="tel"
                name="phone"
                placeholder="Phone (10 digits)"
                className={errors.phone && touched.phone ? "error" : ""}
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="error-message"
              />
            </div>

            <div className="field-group">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className={errors.email && touched.email ? "error" : ""}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="error-message"
              />
            </div>

            <button type="submit">Add Contact</button>
          </Form>
        )}
      </Formik>

      <div className="contacts-list">
        {contacts.length === 0 ? (
          <p>No contacts yet. Add your first contact!</p>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="contact-card">
              <h3>{contact.name}</h3>
              <p>📞 {contact.phone}</p>
              <p>📧 {contact.email}</p>
              <button onClick={() => deleteContact(contact.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactList;
