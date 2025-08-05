import type { Dispatch, SetStateAction } from "react";
import type React from "react";
import { HexColorPicker } from "react-colorful";


type Props = {
    color: string,
    setColor: Dispatch<SetStateAction<string>>,
}

const ColorPicker: React.FC<Props> = ({color, setColor }) => {

    return (
        <HexColorPicker 
        className="absolute"
        color={color} 
        onChange={setColor} />
    )
}

export default ColorPicker;