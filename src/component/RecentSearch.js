import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import { useSelector} from "react-redux";

const RecentSearch = () => {
    const state = useSelector((state) => state.mapData);
    console.log("store", state);
    return (
        <Container>
            <Typography variant="h3">Recent Searches</Typography>

        <div>
        {state.map(function(d, idx){
           return (<li key={idx}>{d.description}</li>)
         })}
        </div>
        </Container>
    );
};

export default RecentSearch;