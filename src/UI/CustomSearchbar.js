import React, { useState } from 'react'
// import { useHistory } from 'react-router-dom'

import { Divider, Grid, Typography } from '@material-ui/core'
import { makeStyles } from "@material-ui/styles"

import { getRecommendedSearch, getResultSearch } from '../api/api_search'
import "./../common.css"


const useStyle = makeStyles(theme => ({
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
    margin: 'auto',
    textAlign: 'center'
  }
}))

export const CustomSearchbar = ({ onAyaSelect }) => {
  // var history = useHistory()
  // const [index, setIndex] = useState(null)
  const [value, setValue] = useState("")
  // const [lines, setLines] = useState([])
  const [results, setResults] = useState([])
  const [recommends, setRecommends] = useState([])
  const [isRecomVisible, setIsRecomVisible] = useState(false)
  const [isResultVisible, setIsResultVisible] = useState(false)
  const classes = useStyle()


  const HoverSearchHandler = () => {
    let element = document.getElementById("searchbar1")
    element.style.border = "2px solid #46d8c7"
    element.style.transition = "border 1s"
  }

  const LeaveSearchHandler = () => {
    let element = document.getElementById("searchbar1")
    element.style.border = "1px solid #46d8c7"
    element.style.transition = "border 1s"
  }

  const getCustomSearchObj = (rootObj, wordObj, likeObj) => {

    const data = {
      "roots": rootObj,
      "words": wordObj,
      "likes": likeObj,
      "type": "OR",
      "domain": 0,
      "extraAyat": [],
      "options": [
        {
          "translators": [
            "ansarian"
          ]
        }
      ]
    }

    return data
  }

  const RecommendClickHandler = (result) => {
    var likeobj = []
    var wordobj = []
    var rootobj = []

    if (result.type === "like") {
      likeobj = [{
        "like": result.like,
        "words": []
      }]
    }

    if (result.type === "root") {
      rootobj = [{
        "root": result.root,
        "words": []
      }]
    }

    if (result.type === "word") {
      wordobj = [{
        "word": result.word,
        "words": []
      }]
    }

    setIsRecomVisible(false)
    setIsResultVisible(true)
    var obj = getCustomSearchObj(rootobj, wordobj, likeobj)
    console.log(obj)
    getResultSearch(obj).then((data) => {
      setResults(data.ayat)
      console.log(data)
    }).catch(err => {
      // console.log(err.message);
    })
  }

  const relateWithServer = (text) => {
    if (text !== "") {
      getRecommendedSearch(text, Math.floor(Math.random() * 1616227051964) + 1).then((data) => {
        setRecommends(data)
        console.log(data)
      }).catch(err => {
        console.log(err.message)
      })
    }

  }

  const renderWords = (text, target) => {
    console.log(text)
    console.log(target)
    return { __html: text.replace(target, "<a style='color:red'>$&</a>") }
  }
  const clickHandler = (text, sura, ayaNo) => {
    let desc = "(سوره مبارکه " + (sura) + " آیه" + (ayaNo) + ")"
    onAyaSelect(text + "        " + desc)
    setIsResultVisible(false)
    setValue("")
  }


  const Result = ({ results }) => {
    if (isResultVisible && value.length > 1) {
      return (

        <div className={classes.res}>
          {
            results.map((result) => (
              <div className={"container"}
              >
                <Grid className={"uni_flex_column"} style={{ flex: 1 }}>
                  <Typography className={classes.suraAya}
                    onClick={() => clickHandler(result.Arabic, result.SuraName, result.AyaNo)}>
                    {"سوره مبارکه " + (result.SuraName) + " آیه" + (result.AyaNo)}
                  </Typography>
                  <Typography className={classes.ayyehText} component={"p"}
                    dangerouslySetInnerHTML={renderWords(result.Arabic, result.Hits)} />
                  <Typography className={classes.ayyatranslate}>{result.translations[0].Text}</Typography>
                  <Divider className={classes.divider} />
                </Grid>
              </div>
            ))
          }

        </div>
      )
    } else {
      return <span></span>
    }

  }

  const Recommend = ({ recom }) => {
    if (recom.length && value.length > 1 && isRecomVisible) {
      return (
        <div className={classes.ulDiv}>
          { <ul className={classes.ulData} >
            {
              recom.map((result, i) => (
                <div className={classes.lis} onClick={() => RecommendClickHandler(result)}>
                  <li key={i} id={i} >{result.text}</li>
                  <Divider className={classes.divider} />
                </div>
              ))
            }
          </ul>}
        </div>
      )
    }

    return <span></span>
  }


  return (
    <div className="app-container fixed-top w-100 disable-pe-not-children"
      style={{ textAlign: 'center' }}>
      <div className="p-2 disable-pe-not-children">
        <input id="searchbar1" type="text" value={value}
          onChange={e => {

            setValue(e.target.value)
            // console.log(value)
            setIsResultVisible(false)
            if ((e.target.value).length > 1) {
              setIsRecomVisible(true)
              relateWithServer((e.target.value))
            }
          }}
          placeholder={"جست و جوی سریع.."}
          className={classes.inputClass}
          onMouseOver={HoverSearchHandler}
          onMouseLeave={LeaveSearchHandler}
        />
      </div>
      <div className="recommed-container">
        <Recommend recom={recommends} />
      </div>
      <div className="result-container">
        <Result results={results} />
      </div>
    </div>
  )
}
