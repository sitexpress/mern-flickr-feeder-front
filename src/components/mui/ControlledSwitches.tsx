import * as React from 'react';
import Switch from '@mui/material/Switch';
import {useEffect} from "react";
import {TagModeType} from "./MiniDrawer";

type ControlledSwitches = {
    setTagsMode: (value:TagModeType) => void
}

export const ControlledSwitches:React.FC<ControlledSwitches> = ({
                                                                    setTagsMode,
}) => {
    const [checked, setChecked] = React.useState(true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.currentTarget.checked);
        checked ? setTagsMode('all') : setTagsMode('any')
    };


    return <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
        />
}