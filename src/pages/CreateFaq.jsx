import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URLS from '../config';
import API from '../api';

const CreateFaq = () => {
  const [page, setPage] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [newFaqs, setNewFaqs] = useState([{ question: '', answer: '' }]);
  const [Dynamic_page, setDynamic_page] = useState([]);
  const BACKEND_BASEURL= BASE_URLS.BACKEND_BASEURL;

  const fetchFaqs = async (pageName) => {
    try {
      const res = await axios.get(`${BACKEND_BASEURL}faq/${pageName}`);
      setFaqs(res.data.faqs || []);
    } catch {
      setFaqs([]);
    }
  };

  useEffect(() => {
    if (page) fetchFaqs(page);
  }, [page]);

  
  useEffect(() => {
    API.get("/pages").then((res) => setDynamic_page(res.data));
  }, []);

  const handleFaqChange = (index, e) => {
    const updated = [...newFaqs];
    updated[index][e.target.name] = e.target.value;
    setNewFaqs(updated);
  };

  const addNewFaq = () => setNewFaqs([...newFaqs, { question: '', answer: '' }]);

  const removeNewFaq = (index) => {
    const updated = [...newFaqs];
    updated.splice(index, 1);
    setNewFaqs(updated);
  };

  const submitNewFaqs = async () => {
    try {
      await axios.post(`${BACKEND_BASEURL}faq`, { page, faqs: newFaqs });
      setNewFaqs([{ question: '', answer: '' }]);
      fetchFaqs(page);
    } catch {
      alert('Error adding FAQs');
    }
  };

  const updateFaq = async (faqId, updatedFaq) => {
    try {
      await axios.put(`${BACKEND_BASEURL}faq/${page}/${faqId}`, updatedFaq);
      fetchFaqs(page);
    } catch {
      alert('Update failed');
    }
  };

  const deleteFaq = async (faqId) => {
    try {
      await axios.delete(`${BACKEND_BASEURL}faq/${page}/${faqId}`);
      fetchFaqs(page);
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div className="form" style={{ padding: 20 }}>
      <h2>FAQ Manager</h2>
      <label>Select Page: </label>
      <select value={page} onChange={(e) => setPage(e.target.value)}>
        <option value="">-- Select Page --</option>
        {
          Dynamic_page.map((p, index)=> {
            return (
              <option value={p._id} key={index}>{p.title}</option>
            )
          })
        }
      </select>

      {page && (
        <>
          <h3>Existing FAQs</h3>
          {faqs.map((faq) => (
            <div key={faq._id} style={{ marginBottom: 10 }}>
              <input
                type="text"
                defaultValue={faq.question}
                onBlur={(e) =>
                  updateFaq(faq._id, { question: e.target.value, answer: faq.answer })
                }
              />
              <textarea
                defaultValue={faq.answer}
                onBlur={(e) =>
                  updateFaq(faq._id, { question: faq.question, answer: e.target.value })
                }
              />
              <button onClick={() => deleteFaq(faq._id)}>Delete</button>
            </div>
          ))}

          <h3>Add New FAQs</h3>
          {newFaqs.map((faq, idx) => (
            <div key={idx}>
              <input
                type="text"
                name="question"
                placeholder="Question"
                value={faq.question}
                onChange={(e) => handleFaqChange(idx, e)}
              />
              <textarea
                name="answer"
                placeholder="Answer"
                value={faq.answer}
                onChange={(e) => handleFaqChange(idx, e)}
              />
              {newFaqs.length > 1 && (
                <button onClick={() => removeNewFaq(idx)}>Remove</button>
              )}
            </div>
          ))}
          <button onClick={addNewFaq}>+ Add Another</button>
          <br />
          <button onClick={submitNewFaqs}>Submit New FAQs</button>
        </>
      )}
    </div>
  );
};

export default CreateFaq;

