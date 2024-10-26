/*
import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './Memory.css';

const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const SHEET_NAME = 'Sheet1';

const MemoryGame = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const { category } = useParams();
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [turn, setTurn] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`
        );
        const rows = response.data.values;
        console.log('Categories rows:', rows);
        const uniqueCategories = [...new Set(rows.slice(1).map((row) => row[2]))];
        setCategories(uniqueCategories);
        setCurrentCategoryIndex(uniqueCategories.indexOf(category));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchWords = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`
        );
        const rows = response.data.values;
        console.log('Words rows:', rows);
        const categoryWords = rows
          .slice(1)
          .filter((row) => row[2] === category)
          .map((row) => ({ hebrew: row[0], arabic: row[1] }));

        console.log('Category words:', categoryWords);

        setWords(categoryWords);

        // יצירת קלפים נפרדים לעברית ולערבית עם מזהה התאמה משותף
        const cards = categoryWords.flatMap((word, idx) => [
          { id: `${idx}-hebrew`, text: word.hebrew, matchId: idx },
          { id: `${idx}-arabic`, text: word.arabic, matchId: idx },
        ]);

        console.log('Shuffled cards before shuffle:', cards);
        setShuffledCards(shuffleCards(cards));
        // איפוס מצבים
        setFlippedCards([]);
        setMatchedCards([]);
        setScores({ 1: 0, 2: 0 });
        setTurn(1);
      } catch (error) {
        console.error('Error fetching words:', error);
      }
    };

    console.log('Current category:', category);

    fetchCategories();
    fetchWords();
  }, [category]);

  const shuffleCards = (cards) => {
    const shuffled = cards.sort(() => Math.random() - 0.5);
    console.log('Shuffled cards:', shuffled);
    return shuffled;
  };

  const handleCardClick = (index) => {
    if (flippedCards.length < 2 && !flippedCards.includes(index) && !matchedCards.includes(index)) {
      setFlippedCards([...flippedCards, index]);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [index1, index2] = flippedCards;
      const card1 = shuffledCards[index1];
      const card2 = shuffledCards[index2];

      console.log('Flipped cards:', card1, card2);

      if (card1.matchId === card2.matchId && card1.id !== card2.id) {
        // התאמה נכונה
        setMatchedCards([...matchedCards, index1, index2]);
        setFlippedCards([]);
        // עדכון ניקוד
        setScores((prevScores) => ({
          ...prevScores,
          [turn]: prevScores[turn] + 1,
        }));
        // השחקן מקבל תור נוסף
        console.log(`Player ${turn} scored!`);
      } else {
        // אין התאמה
        setTimeout(() => {
          setFlippedCards([]);
          // מעבר תור
          setTurn(turn === 1 ? 2 : 1);
          console.log(`No match. Turn goes to player ${turn}`);
        }, 1000);
      }
    }
  }, [flippedCards]);

  const handlePreviousCategory = () => {
    if (categories.length > 0) {
      const newIndex = (currentCategoryIndex - 1 + categories.length) % categories.length;
      setCurrentCategoryIndex(newIndex);
      navigate(`/memory/${categories[newIndex]}`);
    }
  };

  const handleNextCategory = () => {
    if (categories.length > 0) {
      const newIndex = (currentCategoryIndex + 1) % categories.length;
      setCurrentCategoryIndex(newIndex);
      navigate(`/memory/${categories[newIndex]}`);
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
        minHeight: '100vh',
      }}
    >
    </Container>
  );
};

export default MemoryGame;
*/