import React, {useEffect, useState} from 'react';
import Container from "@mui/material/Container";
import s from "./ImageSearchPage.module.css";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import OutlinedInput from "@mui/material/OutlinedInput";
import Button from "@mui/material/Button";
import {ControlledSwitches} from "../ControlledSwitches/ControlledSwitches";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import {ItemsType, PhotosComponent} from "../../PhotosComponent";
import Box from "@mui/material/Box";
import {styled} from "@mui/material/styles";
import {ResponseType, TagModeType} from "../../../App";
import {instance} from "../../../api/api";

type ImageSearchPageType = {
    searchedTags: string[]
    setSearchedTags: (value: string[]) => void
    myStorageAcc: string[]
    setMyStorageAcc: (value: string[]) => void
}

export const ImageSearchPage: React.FC<ImageSearchPageType> = ({
                                                                   searchedTags,
                                                                   setSearchedTags,
                                                                   myStorageAcc,
                                                                   setMyStorageAcc,
                                                               }) => {

    const [items, setItems] = useState<ItemsType[]>([])
    const [inputValue, setInputValue] = useState<string>('')
    const [onError, setOnError] = useState<boolean>(false)
    const [tagMode, setTagMode] = useState<TagModeType>('all')
    // const [screenSize, setScreenSize] = useState(getCurrentDimension());

    const DrawerHeader = styled('div')(({theme}) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    // function getCurrentDimension(){
    //     return {
    //         width: window.innerWidth,
    //         height: window.innerHeight
    //     }
    // }

    const onRefreshHandler = () => {
        setOnError(false)
        instance.get<ResponseType>('')
            .then(res => {
                console.log(res.data)
                setItems(res.data.items)
            })
            .catch(e => {
                console.log('React Error:', e)
            })
    }

    const onTagSearchHandler = (value: string) => {
        if (!value) {
            setOnError(true)
        }

        if (value.length > 0) {

            const arrHelperFunc = (value: string) => {
                console.log((value.split(', ')).map(el => `#${el}`))
                return (value.split(', ')).map(el => `#${el}`)
            }

            const arrValue = arrHelperFunc(value)
            arrValue && setSearchedTags(arrValue)

            setMyStorageAcc(myStorageAcc ? myStorageAcc.concat(arrValue) : arrValue)
            const SearchedTagsSet = JSON.stringify(myStorageAcc.concat(arrValue))
            localStorage.setItem('historyKey', SearchedTagsSet)

            instance.post<ResponseType>('/photo', {data: {params: [value, tagMode]}})
                .then(res => {
                    console.log(res.data)
                    setItems(res.data.items)
                    setInputValue('')
                })
                .catch(e => {
                    console.log('React Error:', e)
                })
        }
    }

    const onChangeInputHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputValue(e.currentTarget.value)
        setOnError(false)
    }

    const onBlurInputHandler = (e: React.FocusEvent<HTMLElement>) => {
        if (!e.currentTarget) {
            setOnError(true)
        }
    }

    // useEffect(() => {
    //     const updateDimension = () => {
    //         setScreenSize(getCurrentDimension())
    //     }
    //
    //     window.addEventListener('resize', updateDimension);
    //
    //     return(() => {
    //         window.removeEventListener('resize', updateDimension);
    //     })
    // }, [screenSize])

    return <div>
        <Box component="main" sx={{flexGrow: 1, p: 0}}>
            <DrawerHeader/>
            <Container >
                <h2>Photo feeder</h2>

                <Grid container spacing={1}>
                    <Stack direction="row" spacing={1} pb={1} pt={1} pl={1}>
                        <OutlinedInput
                            error={onError}
                            className={s.input_search}
                            value={inputValue}
                            onChange={onChangeInputHandler}
                            onBlur={onBlurInputHandler}
                            placeholder={"Enter a tag name"}
                        />
                    </Stack>
                    <Stack direction="row" spacing={1} pb={1} pt={1} pl={1}>
                        <Button
                            variant="outlined"
                            onClick={() => onTagSearchHandler(inputValue)}
                        >Search
                        </Button>

                        <Button
                            variant="contained"
                            onClick={onRefreshHandler}
                        >Refresh All Photos
                        </Button>
                    </Stack>
                </Grid>

                <Grid>
                    <div>
                        <Stack direction="row" spacing={0} mt={-1} style={{alignItems: "center"}}>
                            <span>search by any tags</span>
                            <ControlledSwitches
                                setTagsMode={setTagMode}
                            />
                            <span>search by all tags</span>
                        </Stack>

                        <Divider/>

                        <Typography component={'div'}>
                            <div className={s.image_tags}>
                                <div className={s.image_tags}>
                                    {searchedTags && `Searching has been made by tags: ${searchedTags.toString()}`}
                                </div>
                            </div>
                        </Typography>
                    </div>
                </Grid>

                <Grid container spacing={2}>
                    <PhotosComponent items={items}/>
                </Grid>
            </Container>
        </Box>
    </div>
}
