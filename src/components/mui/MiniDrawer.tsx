import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Container from "@mui/material/Container";
import s from "../../App.module.css";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {ItemsType, PhotosComponent} from "../PhotosComponent";
import {ChangeEvent, useEffect, useState} from "react";
import { instance } from '../../api/api';
import {ControlledSwitches} from "./ControlledSwitches";
import m from './MiniDrawer.module.css'
import {v4} from "uuid";
import {Link, useParams} from "react-router-dom";

export type ResponseType = {
    description: string
    generator: string
    link: string
    modified: string
    title: string
    items: []
}

export type TagModeType = 'all' | 'any'

const drawerWidth = 240;
const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export const MiniDrawer = () => {
    const theme = useTheme();
    const [open, setOpen] = React.useState<boolean>(false);

    const[items, setItems] = useState<ItemsType[]>([])
    const[inputValue, setInputValue] = useState<string>('')
    const[onError, setOnError] = useState<boolean>(false)
    const[searchedTags, setSearchedTags] = useState<string>('')
    const[tagMode, setTagMode] = React.useState<TagModeType>('all');

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const onRefreshHandler = () => {
        instance.get<ResponseType>('')
            .then(res => {
                console.log(res.data)
                setItems(res.data.items)
            })
            .catch(e => {
                console.log('React Error:', e)
            })
    }

    const onTagSearchHandler = (value:string) => {

        if(!value){
            setOnError(true)
        }
            const arrHelperFunc = (value:string) => {
                if (value.length > 0) {
                    return value.split(' ').join(' #')
                }
            }
            const arrValue = arrHelperFunc(value)
            arrValue && setSearchedTags(arrValue)

            instance.post<ResponseType>(`/photo`, {data: {params: [value, tagMode]}})
                .then(res => {
                    console.log(res.data)
                    setItems(res.data.items)
                    setInputValue('')

                })
                .catch(e => {
                    console.log('React Error:', e)
                })
    }

    const onChangeInputHandler = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputValue(e.currentTarget.value)
        setOnError(false)
    }

    const onBlurInputHandler = (e:React.FocusEvent<HTMLElement>) => {
        if (!e.currentTarget) {
            setOnError(true)
        }
    }

    // const {queries, tagFilter} = useParams()

    return <>
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Flick Feeder
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
                <DrawerHeader />
                    <Container className={s.container}>
                        <Grid container spacing={0} className={s.container}>
                            <OutlinedInput
                                error={onError}
                                className={s.input_search}
                                value={inputValue}
                                onChange={onChangeInputHandler}
                                onBlur={onBlurInputHandler}
                                placeholder={"Enter a tag name"}
                            />
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="outlined"
                                    onClick={() => onTagSearchHandler(inputValue)}
                                >Search</Button>

                                <Button
                                    variant="contained"
                                    onClick={onRefreshHandler}
                                >Refresh All Photos</Button>
                            </Stack>
                        </Grid>

                        <Grid className={m.switcher}>
                            <div>
                                <Stack direction="row" spacing={0} style={{alignItems: "center"}}>
                                    <span>search by any tags</span>
                                    <ControlledSwitches
                                        setTagsMode={setTagMode}
                                    />
                                    <span>search by all tags</span>
                                </Stack>

                                <Divider />

                                <Typography component={'div'} style={{justifyContent:"right"}}>
                                    <span>{searchedTags && `Searched's been made by tags: #${searchedTags}`}</span>
                                </Typography>
                            </div>
                        </Grid>

                        <Grid container spacing={2}>
                            {/*<Link to={`photo/${queries}/${tagFilter}`}>*/}
                                <PhotosComponent items={items}/>
                            {/*</Link>*/}
                        </Grid>
                </Container>
            </Box>
        </Box>
    </>
}