import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'; 

const BASE_URL = 'https://leetviewer-backend.vercel.app/rate_profile/'; 

function App() {
  const [username, setUsername] = useState('joyjit_7');
  const [review, setReview] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}${username}`);
      setReview(response.data.profile_review); 
      setProfileData(response.data.profile_data); 
    } catch (error) {
      console.error('Error fetching data from the server:', error);
      setError('Error fetching data from the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const getProblemCountByDifficulty = () => {
    if (!profileData) return [];
    return profileData.submitStats.acSubmissionNum
      .filter(item => item.difficulty !== "All") 
      .map(item => ({ name: item.difficulty, value: item.count }));
  };

  const getTagCounts = (level) => {
    if (!profileData) return [];
    const tagCounts = profileData.tagProblemCounts[level].map(item => ({ 
      name: item.tagName, 
      value: item.problemsSolved 
    }));
    return tagCounts;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label} : ${payload[0].value}`}</p> 
        </div>
      );
    }

    return null;
  };

  return (
    <div className="App">
      <h1>LeetCode Profile Reviewer</h1>
      {isLoading && (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      )}
      {error && <div className="error">{error}</div>}

      <div className="input-container"> 
        <label htmlFor="username">Enter LeetCode Username:</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <button onClick={fetchData}>Get Review</button>
      </div>

      {profileData && (
        <>
          <div className="summary-container">
            <h2>Profile Summary</h2>
            <p>Username: {profileData.username}</p>
            <p>Total Problems Solved: {profileData.submitStats.acSubmissionNum[0].count}</p>
            <p>Easy Problems Solved: {profileData.submitStats.acSubmissionNum.find(item => item.difficulty === 'Easy').count}</p>
            <p>Medium Problems Solved: {profileData.submitStats.acSubmissionNum.find(item => item.difficulty === 'Medium').count}</p>
            <p>Hard Problems Solved: {profileData.submitStats.acSubmissionNum.find(item => item.difficulty === 'Hard').count}</p>
          </div>

          <div className="chart-container">
            <h3>Problem Difficulty Distribution</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={getProblemCountByDifficulty()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              >
                {getProblemCountByDifficulty().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#3498db'][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          <div className="chart-container">
            <h3>Advanced Tag Distribution</h3>
            <ResponsiveContainer width="100%" height={300}> 
              <BarChart
                data={getTagCounts('advanced')}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickAngle={45} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} /> 
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Intermediate Tag Distribution</h3>
            <ResponsiveContainer width="100%" height={300}> 
              <BarChart
                data={getTagCounts('intermediate')}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickAngle={45} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} /> 
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Fundamental Tag Distribution</h3>
            <ResponsiveContainer width="100%" height={300}> 
              <BarChart
                data={getTagCounts('fundamental')}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickAngle={45} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} /> 
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="review-section">
            <h2>Review</h2>
            <div className="review-content"> 
              <div dangerouslySetInnerHTML={{ __html: review }} /> 
            </div> 
          </div>
        </>
      )}

    </div>
  );
}

export default App;