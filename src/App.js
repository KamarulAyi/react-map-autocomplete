import './App.css';
import store from "./store";
import { Provider } from "react-redux";
import AutoCompleteBox from './component/AutoComplete';
import RecentSearch from './component/RecentSearch';
import { Box, Container, Grid } from '@mui/material';
import React from 'react';

function App() {
  return (
    <Provider store={store}>
      <Box
        sx={{
          height: 55,
          backgroundColor: '#ffc83d',
          '&:hover': {
            backgroundColor: '#ffc83d'
          },
        }}
      /> 
      <Container maxWidth='100%' > 
           
      <Grid maxWidth='90%' paddingTop={5}
        container
        >

        <Grid md={7}>
          <AutoCompleteBox/>
        </Grid>
        <Grid md={5}>
          <RecentSearch/>
        </Grid>

      </Grid>
      </Container>
    </Provider>
  );
}

export default App;
