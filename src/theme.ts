import {createTheme} from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            contrastText: '#F1F2FF',
            light: '#6F7DFF',
            main: '#5D6CF5',
        },
        success: {
            light: '#6CB685',
            main: '#54A76F',
            contrastText: '#fff',
        },
        grey: {
            '50': '#FAFAFC',
            '100': '#EDEEF3',
            '200': '#D8D8DF',
            '300': '#B7B8C5',
            '400': '#898B9C',
            '500': '#686B7E',
            '600': '#4D5062',
            '700': '#393C4F',
            '800': '#2A2C3A',
            '900': '#1E1F2B',
        }
    },
});