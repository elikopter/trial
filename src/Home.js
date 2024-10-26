import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

  //"homepage": "https://iseemath.co/amitai/arabic-trivia-app/arabic-trivia-app/",


const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const SHEET_NAME = 'Sheet1';

const Home = () => {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`
        );
        const rows = response.data.values;

        const categories = rows.slice(1).reduce((acc, row) => {
          const [hebrew, arabic, category] = row; // original order
          if (!acc[category]) acc[category] = [];
          acc[category].push({ arabic, hebrew });
          return acc;
        }, {});
        
        setData(categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to handle category selection
  const handleCategorySelect = (category) => {
    navigate(`/quiz/${category}`); // Navigate to the quiz screen with selected category
  };

  return (
       
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        אהלן וסאהלן
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        בחרו קטגוריה שתרצו לתרגל
      </Typography>

      <Grid container spacing={2}>
        {Object.keys(data).map(category => (
          <Grid item xs={12} sm={6} md={4} key={category}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => handleCategorySelect(category)}
              fullWidth
              sx={{
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'scale(1.05)',
                },
                borderRadius: 2,
                fontWeight: 'bold',
                padding: '10px 20px',
                transition: 'background-color 0.3s, transform 0.3s',
              }}
            >
              {category} 

            </Button>
          </Grid>
        ))}
      </Grid>
        
    </Container>
  
  );
};

export default Home;
 