import React, { useState } from 'react';
import './HealthAdvice.css';

interface HealthTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const SimpleHealthAdvice: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
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
    }
  ];
  
  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
  };
  
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
            <p>Coming soon! Our team is working on adding detailed FAQs for this topic.</p>
          </div>
          
          <div className="ask-question-prompt">
            <h3>Have a specific question?</h3>
            <p>Our team of qualified pharmacists is ready to help with your health concerns.</p>
            <button className="primary-button">
              Ask a Pharmacist
            </button>
          </div>
        </div>
      )}
      
      <div className="health-advice-footer">
        <div className="disclaimer">
          <h4>Important Health Disclaimer</h4>
          <p>The information provided is for educational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment.</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleHealthAdvice;
