import React, {useState} from 'react';
import Grid from "@mui/material/Grid";
import {v4} from "uuid";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {TagsComponent} from "./TagsComponent";

export type  MediaType = {
    m: string
}

export type ItemsType = {
    author: string
    author_id: string
    date_taken: string
    description: string
    link: string
    media: MediaType
    published: string
    tags: string
    title: string
}

type TagsComponentType = {
    items:ItemsType[]
}

export const PhotosComponent:React.FC<TagsComponentType> = ({items}) => {

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const mappedItems = items && items.map(photo => {

        const tags = photo.tags.length > 3
            && photo.tags.split(' ').map(t => `#${t}`).slice(0, 3).join(' ')

        return <Grid
            key={v4()}
            item
            xs={8}
            sm={6}
            md={4}
            lg={3}
            gap={1}>
            <Item>
                <img src={photo.media.m} alt="photo"/>
                <div>
                    <b>Title: </b>{photo.title.trim() !== '' ? photo.title : 'not found'}
                </div>
                <div>
                    <TagsComponent
                        tags={tags}
                        photo={photo}
                    />
                </div>
            </Item>
        </Grid>
    })

    return <>
            {mappedItems}
        </>
}

