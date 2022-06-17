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
import { Volume, DeribitVol, ethPrice} from "./config/api";


function App () {
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(7);
  const [flag,setflag] = useState(false);
  const [huobi, setHuobi] = useState();
  const [binance, setBinance] = useState();
  const [ftx, setFtx] = useState([]);
  const [okex, setOkex] = useState([]);
  const [bybit, setBybit] = useState([]);
  const [bitmex, setBitmex] = useState([]);
  const [btc, setBtc] = useState([]);
  const [eth, setEth] = useState([]);
  const [ethprice, setEthPrice] = useState([]);
  const [count, setCount] = useState(0);


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

  const fetchBybit = async () => {
    const { data } = await axios.get(Volume("bybit", days));
    setflag(true);
    setBybit(data);
  };

  const fetchBitmex = async () => {
    const { data } = await axios.get(Volume("bitmex", days));
    setflag(true);
    setBitmex(data);
  };

  const fetchBtc = async () => {
    const { data } = await axios.get(DeribitVol("btc"), {
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      }
    });
    setflag(true);
    setBtc(data);
  };

  const fetchEth = async () => {
    const { data } = await axios.get(DeribitVol("eth"), {
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      }
    });
    setflag(true);
    setEth(data);
  };


  const fetchEthPrice = async () => {
    const { data } = await axios.get(ethPrice(count));
    setflag(true);
    setEthPrice(data);
  };

  useEffect(() => {
    fetchHistoricData();
    fetchHuobi();
    fetchBinance();
    fetchFtx();
    fetchOkex();
    fetchBtc();
    fetchEth();
    fetchBybit();
    fetchBitmex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  /*useEffect(() => {

    fetchEthPrice();
  }, [count]);
*/
  var test = [];
  var trying = [];
  var r = []; //result
  var i, l = okex?.length
  r.length = l;
  test.length =l;
  
  console.log(ethprice);
  for (var u=0; u<ethprice?.records_total; u+100){
    setCount(u+100);
    trying = trying + ethprice;
    console.log(ethprice);
  }
  console.log(trying);
  
  for(i = 0; i < l; i = i +1) {
    var x=[];
    var testing = historicData?.[i]?.[0];
    var a = new Date(testing);
    var year = a.getFullYear();
    var month = ('0' + (a.getMonth()+1)).slice(-2);
    var dias = ('0' + a.getDate()).slice(-2);
    var time = year + '-' + month + '-' + dias;
      
    var d,e,f, t=[];

    for(var y = 0; y < btc.data?.length; y = y +1){
      d=btc.data?.[y];
      t[d.volume_date] = d
      }
   
      x=parseFloat(t?.[time]?.options_daily) + parseFloat(t?.[time]?.futures) + parseFloat(t?.[time]?.perpetual)

  
  r[i] = [okex?.[i][0], parseFloat(ftx?.[i]?.[1])
    +parseFloat(historicData?.[i]?.[1]) 
    +parseFloat(huobi?.[i]?.[1])
    +parseFloat(binance?.[i]?.[1])
    +parseFloat(okex?.[i]?.[1])
    +parseFloat(bybit?.[i]?.[1])
    +parseFloat(bitmex?.[i]?.[1])
    +x];
    test[i] = [okex?.[i][0], (parseFloat(historicData?.[i]?.[1])+x)/r?.[i]?.[1]*100];
  }


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
