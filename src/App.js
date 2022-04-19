import axios from "axios";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  CircularProgress,
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core";
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import SelectButton from "./components/SelectButton";
import { chartDays } from "./config/data";
import { Volume } from "./config/api";

function App () {
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(7);
  const [flag,setflag] = useState(false);
  const [huobi, setHuobi] = useState();
  const [binance, setBinance] = useState();
  const [ftx, setFtx] = useState([]);
  const [okex, setOkex] = useState([]);


  const useStyles = makeStyles((theme) => ({
    container: {
      width: "80%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    },
  }));

  const classes = useStyles();

  const fetchHistoricData = async () => {
    const { data } = await axios.get(Volume("deribit", days));
    setflag(true);
    setHistoricData(data);
  };

  const fetchHuobi = async () => {
    const { data } = await axios.get(Volume("huobi", days));
    setflag(true);
    setHuobi(data);
  };

  const fetchBinance = async () => {
    const { data } = await axios.get(Volume("binance", days));
    setflag(true);
    setBinance(data);
  };

  const fetchFtx = async () => {
    const { data } = await axios.get(Volume("ftx", days));
    setflag(true);
    setFtx(data);
  };

  const fetchOkex = async () => {
    const { data } = await axios.get(Volume("okex", days));
    setflag(true);
    setOkex(data);
  };

  


  //console.log(historicData);
  //console.log(huobi);
  //console.log(binance);
  //console.log(ftx);
  //console.log(okex);
  //console.log(okex.length);
  

  useEffect(() => {
    fetchHistoricData();
    fetchHuobi();
    fetchBinance();
    fetchFtx();
    fetchOkex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);


  var test = [];
  var r = []; //result
  var i, l = okex?.length
  r.length = l;
  test.length =l;
  
  for(i = 0; i < l; i = i +1) {
    r[i] = [okex?.[i][0], parseFloat(ftx?.[i]?.[1])+parseFloat(historicData?.[i]?.[1]) 
    +parseFloat(huobi?.[i]?.[1])
    +parseFloat(binance?.[i]?.[1])
    +parseFloat(okex?.[i]?.[1])];
    test[i] = [okex?.[i][0], parseFloat(historicData?.[i]?.[1])/r?.[i]?.[1]*100];
  }
  console.log(r);
  console.log(test);
  console.log(ftx?.length)
  console.log(binance?.length)
  console.log(huobi?.length)
  console.log(historicData?.length)

  //parseFloat(okex?.[i][1])+parseFloat(ftx?.[i][1])+parseFloat(huobi?.[i][1])+parseFloat(binance?.[i][1])
  //parseFloat(historicData?.[i][1])/r?.[i][1]*100
  
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!historicData | flag===false ? (
          <CircularProgress
            style={{ color: "#2DAE9A" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicData.map((exchange) => {
                  let date = new Date(exchange[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: test.map((exchange) => exchange[1]),
                    label: `Market Share ( Past ${days} Days ) in %`,
                    borderColor: "#2DAE9A",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {setDays(day.value);
                    setflag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
