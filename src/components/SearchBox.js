import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, InputBase, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { makeStyles } from '@mui/styles';
import { spacing } from '@mui/system';


const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        // borderRadius: theme.shape.borderRadius,
        borderRadius: 16,
        backgroundColor: "#fff",
        boxShadow: "0 0 3px 1px rgba(0, 0, 0, 0.1)",
        width: "100%",
    },
    input: {
        // marginLeft: theme.spacing(2),
        marginLeft: spacing(2), 
        flex: 1,
        fontSize: "1rem",
    },
    iconButton: {
        // padding: theme.spacing(1),
        padding: spacing(1),
        backgroundColor: "grey",
        color: "#fff",
        "&:hover": {
            backgroundColor: "black",
        },
    },
}));

function SearchBox() {
    const classes = useStyles();
    const [keyword, setKeyword] = useState("");
    let history = useHistory();

    const submitHandler = (e) => {
        e.preventDefault();

        history.push(`/?keyword=${keyword}&page=1`);

    };

    return (
        <Box component="form" onSubmit={submitHandler} className={classes.root}>
            <InputBase
                placeholder="Search for products..."
                className={classes.input}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <IconButton type="submit" className={classes.iconButton} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Box>
    );
}

export default SearchBox;