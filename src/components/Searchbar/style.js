import { makeStyles } from "@material-ui/styles";
export default makeStyles(theme => ({

    ulDiv: {
        backgroundColor: '#D3F1E8',
        width: '40%',
        display: 'inline-table',
        height: '4rem',
        textAlign: 'start',
        borderBottomLeftRadius: '1rem',
        borderBottomRightRadius: '1rem'
    },
    ulData: {
        listStyleType: 'none',
        fontSize: '1.3rem',
        overflow: 'auto',
        height: '20rem',
    },
    divider: {
        width: '90%',
        textAlign: 'center'
    },
    lis: {
        "&:hover": {
            cursor: "pointer",
            width: "100%"
        },
    },
    ayyehText: {
        fontFamily: "QuranTaha !important",
        fontSize: "1.8rem",
        marginBottom: "1.5rem",
        marginLeft: "1rem",
        lineHeight: "4rem"
    },
    ayyatranslate: {
        fontFamily: 'Shabnam !important'
    },
    suraAya: {
        fontFamily: 'Shabnam !important',
        color: 'green',
        fontSize: '1rem',
        fontWeight: 'bold',
        "&:hover": {
            cursor: 'pointer'
        }
    },
    resultdiv: {
        width: '90%',
        display: 'inline-table',
        height: "100%",
        textAlign: 'center',
        borderBottomLeftRadius: '1rem',
        borderBottomRightRadius: '1rem',
        backgroundColor: 'red'
    },
    inputClass: {
        borderRadius: '2rem',
        padding: '1rem',
        border: '1px solid #46d8c7',
        outline: 'none',
        width: '43%',
        height: '3rem',

    },
    res: {
        listStyleType: 'none',
        fontSize: '1.3rem',
        overflow: 'auto',
        height: '20rem',
        backgroundColor: '#D3F1E8',
        borderBottomRightRadius: '2rem',
        padding: '10px',
        width: '40%',
        margin:'auto',
        textAlign:'center'
    }
}));
