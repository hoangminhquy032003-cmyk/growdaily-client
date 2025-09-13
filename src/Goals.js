import React, { useState } from 'react';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [goalText, setGoalText] = useState('');

  const handleAddGoal = () => {
    if (goalText.trim() === '') return;
    setGoals([...goals, { text: goalText, done: false }]);
    setGoalText('');
  };

  const toggleGoal = (index) => {
    const updated = [...goals];
    updated[index].done = !updated[index].done;
    setGoals(updated);
  };

  return (
    <div className="container mt-4">
      <h2>🎯 Mục tiêu của bạn</h2>
      <input
        className="form-control mb-2"
        value={goalText}
        onChange={(e) => setGoalText(e.target.value)}
        placeholder="Nhập mục tiêu..."
      />
      <button className="btn btn-success mb-3" onClick={handleAddGoal}>
        Thêm mục tiêu
      </button>
      <ul className="list-group">
        {goals.map((goal, index) => (
          <li
            key={index}
            className={`list-group-item ${goal.done ? 'list-group-item-success' : ''}`}
            onClick={() => toggleGoal(index)}
            style={{ cursor: 'pointer' }}
          >
            {goal.done ? '✅' : '🔘'} {goal.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Goals;