import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FireIcon from '@mui/icons-material/Whatshot';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './Quiz.css';

const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const SHEET_NAME = 'Sheet1';

const Quiz = () => {
  const handlePreviousCategory = () => {
    const newIndex = (categories.indexOf(category) - 1 + categories.length) % categories.length;
    navigate(`/quiz/${categories[newIndex]}`);
  };

  const handleNextCategory = () => {
    const newIndex = (categories.indexOf(category) + 1) % categories.length;
    navigate(`/quiz/${categories[newIndex]}`);
  };
  const { category } = useParams();
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]); // Track incorrect answers
  const [points, setPoints] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showNextQuestion, setShowNextQuestion] = useState(false);
  const [arabicPopped, setArabicPopped] = useState(false);
  const [shakeText, setShakeText] = useState(false);
  const [questionMarkMode, setQuestionMarkMode] = useState(false); // מצב סימן שאלה
  const [showOptions, setShowOptions] = useState(true); // האם להציג את האפשרויות

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`
        );
        const rows = response.data.values;
        const uniqueCategories = [...new Set(rows.slice(1).map(row => row[2]))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
    const fetchWords = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`
        );
        const rows = response.data.values;
        const categoryWords = rows
          .slice(1)
          .filter(row => row[2] === category)
          .map(row => ({ hebrew: row[0], arabic: row[1] }));

        setWords(categoryWords);
        setNextQuestion(categoryWords);
      } catch (error) {
        console.error('Error fetching words:', error);
      }
    };

    fetchWords();
  }, [category]);

  const setNextQuestion = (categoryWords) => {
    const randomWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    let options = [randomWord.hebrew];
    let numOptions;
    if (points < 200) {
      numOptions = 3;
    } else if (points < 500) {
      numOptions = 4;
    } else if (points < 1000) {
      numOptions = 5;
    } else if (points < 1400) {
      numOptions = 3;
    } else if (points < 1700) {
      numOptions = 4;
    } else {
      numOptions = 5;
    }

    while (options.length < numOptions) {
      const randomIndex = Math.floor(Math.random() * categoryWords.length);
      const randomOption = categoryWords[randomIndex].hebrew;

      if (!options.includes(randomOption)) {
        options.push(randomOption);
      }
    }

    options.sort(() => Math.random() - 0.5);

    const displayWord = points >= 1000 ? randomWord.hebrew : randomWord.arabic;
    setQuestion({ arabic: randomWord.arabic, hebrew: randomWord.hebrew, correct: randomWord.hebrew, options, displayWord });
    setSelectedAnswer(null);
    setIsCorrect(false);
    setIncorrectAnswers([]); // Reset incorrect answers for the new question
    setShowNextQuestion(false);
    setArabicPopped(false);
    setShakeText(false); // Reset shake animation
    setShowOptions(!questionMarkMode); // אם במצב סימן שאלה, לא להציג את האפשרויות מיד
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === question.correct;

    if (correct) {
      const newPoints = 10 + (combo * 5);
      setPoints(points + newPoints);
      setCombo(combo + 1);
      setShowNextQuestion(true);
      setArabicPopped(true);
    } else {
      setIncorrectAnswers(prev => [...prev, answer]); // Add the wrong answer to the state
      setCombo(0);
      setShowNextQuestion(false);
      setArabicPopped(false);
      setShakeText(true); // Trigger shake animation
    }

    setIsCorrect(correct);
  };

  const handleNextQuestion = () => {
    setNextQuestion(words);
  };

  const getComboColor = () => {
    const redIntensity = Math.min(combo * 30, 255);
    return `rgb(${redIntensity}, 0, 0)`;
  };

  return (
    <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ position: 'absolute', top: '16px', right: '16px', left: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 'calc(100% - 32px)' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/*  <Button variant="contained" color="secondary" onClick={() => navigate('/memory')}>משחק הזיכרון</Button>*/}
          <Button variant="contained" color="secondary" onClick={() => navigate(`/Notes/${category}`)}>פתקיות</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>


          <Button onClick={() => handlePreviousCategory()}>
            <ArrowBackIcon style={{ fontSize: '3rem' }} />
          </Button>
          <Typography variant="h4" style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
            {category}
          </Typography>
          <Button onClick={() => handleNextCategory()}>

            <ArrowForwardIcon style={{ fontSize: '3rem' }} />
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button onClick={() => navigate('/')}>
            <HomeIcon style={{ fontSize: '4rem' }} />
          </Button>
          {/*
          <Button onClick={() => handleNextCategory()}>
            <ArrowForwardIcon style={{ fontSize: '3rem' }} />
          </Button>
*/}
        </div>
      </div>


      <Typography
        variant="h4"
        className={shakeText ? 'shake' : ''} // Apply shake animation class when answer is incorrect
        style={{
          margin: '30px 0',
          fontSize: '3rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: getComboColor(),
          animation: isCorrect ? 'bounce 0.3s' : undefined, // Add bounce animation on correct answer
        }}
      >
        Points: {points} <AttachMoneyIcon fontSize="large" /> | Combo: {combo} <FireIcon fontSize="large" style={{ color: getComboColor() }} />
      </Typography>

      <Typography
        variant="h3"
        onClick={() => setQuestionMarkMode(!questionMarkMode)} // Toggle question mark mode
        style={{
          margin: '20px 0',
          fontWeight: 'bold',
          fontSize: arabicPopped ? '6rem' : '5rem',
          animation: arabicPopped ? 'pop 0.3s' : undefined,
          display: 'inline-block',
          transition: 'font-size 0.3s ease',
          cursor: 'pointer', // Show that it's clickable
        }}
      >
        {question ? question.displayWord : "Loading..."}
      </Typography>

      {questionMarkMode && !showOptions ? (
        <Button
          variant="contained"
          onClick={() => setShowOptions(true)}
          style={{ fontSize: '2rem', padding: '20px', marginTop: '20px' }}
        >
          ?
        </Button>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {question && question.options.map((option, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Button
                variant="contained"
                color={selectedAnswer === option ? (isCorrect ? 'success' : 'error') : 'primary'}
                onClick={() => handleAnswerSelect(option)}
                fullWidth
                className={incorrectAnswers.includes(option) ? 'shake' : ''} // Add shake class for incorrect answers
                style={{
                  transition: 'transform 0.3s',
                  transform: isCorrect && selectedAnswer === option ? 'scale(1.1)' : 'scale(1)',
                  backgroundColor: incorrectAnswers.includes(option) ? 'red' : undefined, // Keep red for incorrect answers
                  color: incorrectAnswers.includes(option) ? 'white' : undefined,
                  fontSize: '1.5rem',
                  padding: '16px',
                }}
              >
                {option}
              </Button>
            </Grid>
          ))}
        </Grid>
      )}

      {showNextQuestion && (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleNextQuestion}
          style={{
            marginTop: '30px',
            animation: 'zoomIn 0.3s',
            fontSize: '2rem',
            padding: '12px 24px',
          }}
        >
          Next Question
        </Button>
      )}
    </Container>
  );
};

export default Quiz;
