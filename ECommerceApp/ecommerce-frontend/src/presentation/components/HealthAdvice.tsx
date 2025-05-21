import React, { useState } from 'react';
import './HealthAdvice.css';

interface HealthTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface HealthAdviceQuestion {
  id: string;
  question: string;
  answer: string;
  topicId: string;
}

const HealthAdvice: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  // Sample health topics
  const healthTopics: HealthTopic[] = [
    {
      id: 'medications',
      title: 'Medication Advice',
      description: 'Get expert advice on medication usage, side effects, and interactions.',
      icon: '💊'
    },
    {
      id: 'wellness',
      title: 'Wellness & Prevention',
      description: 'Tips for maintaining good health and preventing common illnesses.',
      icon: '🌿'
    },
    {
      id: 'nutrition',
      title: 'Nutrition & Diet',
      description: 'Guidance on healthy eating, supplements, and special dietary needs.',
      icon: '🥗'
    },
    {
      id: 'chronic',
      title: 'Chronic Conditions',
      description: 'Support for managing long-term health conditions and treatments.',
      icon: '❤️'
    },
    {
      id: 'firstaid',
      title: 'First Aid & Emergencies',
      description: 'Quick guidance for minor injuries and emergency situations.',
      icon: '🩹'
    },
    {
      id: 'children',
      title: 'Children\'s Health',
      description: 'Advice for common childhood illnesses and pediatric medications.',
      icon: '👶'
    }
  ];
  
  // Sample FAQs for each topic
  const faqs: HealthAdviceQuestion[] = [
    {
      id: '1',
      topicId: 'medications',
      question: 'Can I take ibuprofen and paracetamol together?',
      answer: "Yes, ibuprofen and paracetamol work in different ways, so it's safe to take them together. Take them as directed on the packaging or by your healthcare provider. Always follow recommended dosages and timing."
    },
    {
      id: '2',
      topicId: 'medications',
      question: "What's the difference between generic and brand-name medications?",
      answer: 'Generic medications contain the same active ingredients as brand-name versions but typically cost less. They must meet the same quality and safety standards. The main differences are in inactive ingredients, appearance, and price.'
    },
    {
      id: '3',
      topicId: 'wellness',
      question: 'How can I boost my immune system naturally?',
      answer: 'To strengthen your immune system: eat a balanced diet rich in fruits and vegetables, exercise regularly, get adequate sleep (7-9 hours), manage stress, stay hydrated, and consider vitamin D and zinc supplements if deficient.'
    },
    {
      id: '4',
      topicId: 'nutrition',
      question: 'Do I need to take vitamin supplements if I eat a balanced diet?',
      answer: "Most people who eat a varied, balanced diet don't need supplements. However, certain groups may benefit: pregnant women, older adults, people with restricted diets, or those with specific health conditions. Consult a healthcare provider before starting supplements."
    },
    {
      id: '5',
      topicId: 'chronic',
      question: 'What lifestyle changes help manage high blood pressure?',
      answer: 'Effective lifestyle changes include: reducing sodium intake, regular physical activity, maintaining healthy weight, limiting alcohol, quitting smoking, managing stress, and following the DASH diet (rich in fruits, vegetables, and low-fat dairy).'
    },
    {
      id: '6',
      topicId: 'firstaid',
      question: 'How should I treat a minor burn at home?',
      answer: "For minor burns: cool the burn with cool (not cold) running water for 10-15 minutes, don't use ice, apply aloe vera gel or petroleum jelly, cover loosely with sterile gauze, and take over-the-counter pain relievers if needed. Seek medical attention for larger or deeper burns."
    }
  ];
  
  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setShowQuestionForm(false);
    setSubmitted(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the question to a backend
    console.log('Question submitted:', { name, email, question, topicId: selectedTopic });
    setSubmitted(true);
    setQuestion('');
    setEmail('');
    setName('');
  };
  
  const filteredFaqs = selectedTopic 
    ? faqs.filter(faq => faq.topicId === selectedTopic)
    : [];
  
  const selectedTopicData = selectedTopic 
    ? healthTopics.find(topic => topic.id === selectedTopic)
    : null;
  
  return (
    <div className="health-advice-container">
      <div className="health-advice-header">
        <h1>Health Advice Center</h1>
        <p>Get expert advice from our qualified pharmacists on a wide range of health topics</p>
      </div>
      
      {!selectedTopic ? (
        <div className="health-topics-grid">
          {healthTopics.map(topic => (
            <div 
              key={topic.id} 
              className="health-topic-card"
              onClick={() => handleTopicSelect(topic.id)}
            >
              <div className="topic-icon">{topic.icon}</div>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="health-topic-detail">
          <button 
            className="back-button"
            onClick={() => setSelectedTopic(null)}
          >
            ← Back to Topics
          </button>
          
          <div className="topic-header">
            <div className="topic-icon large">{selectedTopicData?.icon}</div>
            <h2>{selectedTopicData?.title}</h2>
          </div>
          
          <div className="topic-description">
            <p>{selectedTopicData?.description}</p>
          </div>
          
          <div className="faq-section">
            <h3>Frequently Asked Questions</h3>
            {filteredFaqs.length > 0 ? (
              <div className="faq-list">
                {filteredFaqs.map(faq => (
                  <div key={faq.id} className="faq-item">
                    <h4>{faq.question}</h4>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No FAQs available for this topic yet.</p>
            )}
          </div>
          
          {submitted ? (
            <div className="confirmation-message">
              <h3>Thank you for your question!</h3>
              <p>Our pharmacists will review your question and respond to your email within 24-48 hours.</p>
              <button 
                className="primary-button"
                onClick={() => setSubmitted(false)}
              >
                Ask Another Question
              </button>
            </div>
          ) : (
            <>
              {showQuestionForm ? (
                <div className="question-form-container">
                  <h3>Ask Our Pharmacists</h3>
                  <form onSubmit={handleSubmit} className="question-form">
                    <div className="form-group">
                      <label htmlFor="name">Your Name</label>
                      <input 
                        type="text" 
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input 
                        type="email" 
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="question">Your Health Question</label>
                      <textarea 
                        id="question"
                        rows={5}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-footer">
                      <button type="button" className="secondary-button" onClick={() => setShowQuestionForm(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="primary-button">
                        Submit Question
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="ask-question-prompt">
                  <h3>Don't see your question?</h3>
                  <p>Our team of qualified pharmacists is ready to help with your specific health concerns.</p>
                  <button 
                    className="primary-button"
                    onClick={() => setShowQuestionForm(true)}
                  >
                    Ask a Pharmacist
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      <div className="health-advice-footer">
        <div className="disclaimer">
          <h4>Important Health Disclaimer</h4>
          <p>The information provided is for educational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
        </div>
        
        <div className="emergency-notice">
          <h4>In Case of Emergency</h4>
          <p>If you are experiencing a medical emergency, please call your local emergency number immediately.</p>
        </div>
      </div>
    </div>
  );
};

export default HealthAdvice;
