import {useState} from "react";

export const useSearchbarItems = () => {
    const [selectedConcept , setSelectedConcept] = useState(1);
    const [selectedTheme , setSelectedTheme] = useState(1);

    const handleChangeTheme = (e) => {
        setSelectedTheme(e.target.value)
    }

    const handleChangeConcept = (e) => {
        setSelectedConcept(e.target.value)
    }

    return {
        selectedConcept ,
        selectedTheme,
        handleChangeTheme,
        handleChangeConcept
    }
}