import React, {useEffect, useState} from 'react';
import Container from "@mui/material/Container";
import s from "../../../App.module.css";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import {styled} from "@mui/material/styles";
import Button from "@mui/material/Button";

type HistorySearchPageType = {
    searchedTags: string[]
}
export const HistorySearchPage: React.FC<HistorySearchPageType> = ({searchedTags}) => {
    const [showTags, setShowTags] = useState([])

    const DrawerHeader = styled('div')(({theme}) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }))

    const date = new Date()

    useEffect(() => {
        const SearchedTagsGet = localStorage.getItem('historyKey')
        if (SearchedTagsGet !== null) setShowTags(JSON.parse(SearchedTagsGet))
    }, [searchedTags])

    const clearHistoryHandler = () => {
        localStorage.removeItem('historyKey')
        setShowTags([])
    }

    return <div>
        <Box component="main" sx={{flexGrow: 1, p: 0}}>
            <DrawerHeader/>
            <Container className={s.container} maxWidth="md">
                <Grid container spacing={1} className={s.container}>
                    <Stack direction="row" spacing={1} pb={1} pt={1} pl={1}>
                        <h2>History</h2>
                    </Stack>
                </Grid>

                <Grid container className={s.container}>
                    <div>
                        <Stack
                            direction="row"
                            spacing={0} mt={-1}
                            style={{
                                alignItems: "flex-start",
                                flexDirection: "column",

                            }}
                        >
                            <b>{showTags.length > 0 && `${date.toDateString()}: `}</b>
                            <Divider/>
                            <span>{showTags}</span>
                        </Stack>
                    </div>
                </Grid>

                <Grid container spacing={0} pt={2}>
                    <Button
                        variant="contained"
                        onClick={clearHistoryHandler}
                    >Clean history
                    </Button>
                </Grid>
            </Container>
        </Box>
    </div>

}
