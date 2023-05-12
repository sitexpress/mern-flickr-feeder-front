import React, {useState} from 'react';
import s from "../App.module.css";
import {ItemsType} from "./PhotosComponent";

type TagsComponentType = {
    tags: string | false
    photo:ItemsType
}
export const TagsComponent:React.FC<TagsComponentType> = ({
                                                              tags,
                                                              photo
                                                          }) => {
    const[tagsOpen, setTagsOpen] = useState<boolean>(false)
    return <>
        {
            tagsOpen
                ?
                <span><b>Tags: </b>{photo.tags ? photo.tags.split(' ').map(t => `#${t}`).join(' ') : 'not found'}
                    <span className={s.tags} onClick={() => setTagsOpen(!tagsOpen)}>...</span></span>
                :
                <span><b>Tags: </b>{photo.tags ? tags : 'not found'} <span className={s.tags} onClick={() => setTagsOpen(!tagsOpen)}>...</span></span>
        }
    </>
}

