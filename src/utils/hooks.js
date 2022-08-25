import {useState} from "react";
import {ThemeFactory} from "./factories/themes/theme-factory";

export const useSearchbarItems = ({addCustomShape , addCustomImage}) => {
    const [selectedConcept , setSelectedConcept] = useState(1);
    const [selectedTheme , setSelectedTheme] = useState(1);
    const [selectedNewTheme , setSelectedNewTheme] = useState(1);

    const handleChangeTheme = (e) => {
        setSelectedTheme(e.target.value)
    }

    const handleChangeNewTheme = (e) => {
        const themeFactory = new ThemeFactory(e.target.value)
        addCustomImage(themeFactory.handle());
        setSelectedNewTheme(e.target.value)
    }

    const handleChangeConcept = (e) => {
        setSelectedConcept(e.target.value)
    }

    return {
        selectedConcept ,
        selectedTheme,
        selectedNewTheme,
        handleChangeTheme,
        handleChangeConcept,
        handleChangeNewTheme
    }
}