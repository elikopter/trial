import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './Quiz.css';

const Notes = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [isHebrew, setIsHebrew] = useState(false);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_SHEET_ID}/values/Sheet1?key=${process.env.REACT_APP_API_KEY}`
        );
        const data = await response.json();
        const rows = data.values;
        const categoryWords = rows
          .slice(1)
          .filter((row) => row[2] === category)
          .map((row) => ({ hebrew: row[0], arabic: row[1], showHebrew: true }));
        if (categoryWords.length === 0) {
          console.warn('No words found for this category.');
        }
        setWords(categoryWords);
      } catch (error) {
        console.error('Error fetching words:', error);
      }
    };
    fetchWords();
  }, [category]);

  const handleToggleWord = (index) => {
    setWords((prevWords) =>
      prevWords.map((word, i) =>
        i === index ? { ...word, showHebrew: !word.showHebrew } : word
      )
    );
  };

  const handleToggleLanguage = () => {
    setIsHebrew((prevIsHebrew) => !prevIsHebrew);
  };

  const getDisplayedWord = (word) => {
    if (word.showHebrew) {
      return isHebrew ? word.hebrew : word.arabic;
    } else {
      return isHebrew ? word.arabic : word.hebrew;
    }
  };

  return (
    <Container
      maxWidth="md"
      style={{
        textAlign: 'center',
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          left: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={() => navigate('/quiz/' + category)}>
            <ArrowBackIcon style={{ fontSize: '3rem' }} />
          </Button>
          <Button onClick={() => navigate('/')}>
            <HomeIcon style={{ fontSize: '3rem' }} />
          </Button>
        </div>
        <Typography
          variant="h4"
          style={{
            fontWeight: 'bold',
            fontSize: '2.5rem',
            flex: 1,
            textAlign: 'center',
          }}
        >
          {category}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleToggleLanguage}>
          שנה שפה
        </Button>
      </div>

      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '60px' }}>
        {words.length === 0 ? (
          <Typography variant="h6" color="textSecondary">
            אין מילים להצגה בקטגוריה זו.
          </Typography>
        ) : (
          words.map((word, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleToggleWord(index)}
                fullWidth
                style={{ fontSize: '1.5rem', padding: '16px' }}
              >
                {getDisplayedWord(word)}
              </Button>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Notes;
