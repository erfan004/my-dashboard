import React, { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js";
import Grid from "@mui/material/Grid";
import { Pie } from "react-chartjs-2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const Salary = () => {
  ChartJs.register(ArcElement, Tooltip, Legend);

  /* start of states */

  const [mountOfSalary, setmountOfSalary] = useState(0);

  // const [curTimeStamp , setCurTimeStamp] = useState(0)

  const [salaryHelperText, setSalaryHelperText] = useState("");

  const [salaryError, setSalaryError] = useState(false);

  const [timeStamp, setTimeStamp] = useState(0);

  const [costsError, setCostsError] = useState(false);

  const [payment, setPayment] = useState(0);

  const [costs , setCosts] = useState(0)

  const [arrayCosts , setArrayCosts] = useState([])

  const [finalCosts  , setFinalCosts] = useState(0)


  /* end of states */

  const queryClient = useQueryClient();

  const data = {
    labels: ["remain", "costs"],
    datasets: [
      {
        label: "$",
        data: [payment - finalCosts, finalCosts],
        backgroundColor: ["#0289d1de", "black"],
        borderColor: ["#0289d1de", "black"],
      },
    ],
  };

  /* start of mutations */

  const salaryMutation = useMutation(
    (salary) =>
      axios.post(
        "https://dashboard-e6a2f-default-rtdb.firebaseio.com/salary.json",
        salary
      ),
    {
      onSuccess: (res) => {
        console.log(res);
        queryClient.invalidateQueries(["salary"]);
      },
    }
  );

  const timeStampMutation = useMutation(
    () =>
      axios.post(
        "https://dashboard-e6a2f-default-rtdb.firebaseio.com/timeStamp.json",
        Math.trunc(Date.now() / 1000)
      ),
    {
      onSuccess: (res) => {
        console.log(res);
      },
    }
  );


  const costsMutation = useMutation(
    ()=> 
    axios.post('https://dashboard-e6a2f-default-rtdb.firebaseio.com/costs.json' , costs) , 
    {
      onSuccess : (res)=> {
        console.log(res)
        queryClient.invalidateQueries(['arrayCosts'])
      }
    }
  )

 const deleteSalary = useMutation(
  ()=> 
  axios.delete('https://dashboard-e6a2f-default-rtdb.firebaseio.com/salary.json') , 
  {
    onSuccess : (res)=>{
      console.log(res);
      queryClient.invalidateQueries(['salary'])
    }
  }
 ) 
 
 const deleteTimeStamp = useMutation(
  ()=> 
  axios.delete('https://dashboard-e6a2f-default-rtdb.firebaseio.com/timeStamp.json') , 
  {
    onSuccess : (res)=>{
      console.log(res);
      queryClient.invalidateQueries(['timeStamp'])
    } 
  }
 ) 

 const deleteCosts = useMutation(
  ()=>
  axios.delete('https://dashboard-e6a2f-default-rtdb.firebaseio.com/costs.json') 
  ,
  {
    onSuccess: (res)=>{
      console.log(res);
      queryClient.invalidateQueries(['arrayCosts'])
    }
  }
 )
  /* end of mutations */

  const fetchSalary = async () => {
    try {
      const res = await axios.get(
        "https://dashboard-e6a2f-default-rtdb.firebaseio.com/salary.json"
      );
      const salary = res.data;
      if (salary) {
        const salaryMount = Object.values(salary);
        setPayment(salaryMount[0]);
        return salaryMount;
      } else {
        setPayment(0);
        return [];
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  const fetchTimeStamp = async () => {
    try {
      const res = await axios.get(
        "https://dashboard-e6a2f-default-rtdb.firebaseio.com/timeStamp.json"
      );
      const timeStamp = res.data;
      if (timeStamp) {
        const time = Object.values(timeStamp);
        setTimeStamp(time[0]);
        return time;
      } else {
        setTimeStamp(0);
        return [];
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCosts = async ()=>{
    try{
     const res = await axios.get('https://dashboard-e6a2f-default-rtdb.firebaseio.com/costs.json')
     const resData = res.data
     if(resData){
      const costs = Object.values(resData)
      setArrayCosts(costs)
      return costs
     }
     else{
      setArrayCosts([])
      return[]
     }
    }
    catch(err){
      console.log(err);
    }
  }

  const salaryQuery = useQuery({
    queryKey: ["salary"],
    queryFn: () => fetchSalary(),
  });

  const timeStampQuery = useQuery({
    queryKey: ["timeStamp"],
    queryFn: () => fetchTimeStamp(),
    
  });

  const arrayCostsQuery = useQuery({
    queryKey : ['arrayCosts'] , 
    queryFn : ()=> fetchCosts()
  }) 





  const addSalaryHandler = (e) => {
    e.preventDefault();
    if (mountOfSalary == 0 || mountOfSalary.trim() == "") {
      setSalaryError(true);
      setSalaryHelperText("it should be number and more than 0 !");
    } else {
      setSalaryError(false);
      setSalaryHelperText("");
      salaryMutation.mutate(mountOfSalary);
      timeStampMutation.mutate();
    }
  };
  const addCosts = (e) => {
    e.preventDefault()
    if(costs == 0 || costs.trim() == '' || costs > payment - finalCosts){
      setCostsError(true)
    }
    else { 
      setCostsError(false)
      costsMutation.mutate()
    }
  };
  
useEffect(()=>{
  const curTimeStamp = Math.trunc(Date.now() / 1000)
  if(timeStamp > 0 && timeStamp + 2629743 <= curTimeStamp){
    deleteTimeStamp.mutate()
    deleteSalary.mutate()
    deleteCosts.mutate()
  }
} , [])

  useEffect(()=>{
    if(arrayCostsQuery.isSuccess){
      const initialVal = 0
      const sumVal = arrayCosts.reduce((acc , cur)=> acc + cur , initialVal)
      setFinalCosts(sumVal)
    }
  } , [arrayCostsQuery.isFetching , costsMutation.isSuccess ])


  
  let salaryEl;
  
  if (salaryQuery.isFetching) {
    salaryEl = <Typography variant="h2">data is loading ...</Typography>;
  } 
  
  else if (payment > 0) {
    salaryEl = (
      <Grid   display={'flex'} container direction={'column'} spacing={3} justifyContent={'center'} alignItems={'center'}>
        <Grid item>
          <Pie data={data} />
        </Grid>
        <Grid item>
          <form onSubmit={addCosts}>
            <TextField
              label={"add costs"}
              type="number"
              variant="filled"
              error={costsError}
              margin="normal"
              fullWidth
              sx={{ backgroundColor: "#494949" }}
              value={costs}
              onChange={(e)=> setCosts(e.target.value)}
            />
            <Button disabled={costsMutation.isLoading} type="submit" color="info" variant="outlined" >
              add costs
            </Button>
          </form>
        </Grid>
      </Grid>
    );
  } 
  else if (salaryQuery.isError) {
    salaryEl = <Typography>fetching data has been failed</Typography>;
  } 
  
  else if(payment ==0) {
    salaryEl = (
      <form onSubmit={addSalaryHandler}>
        <TextField
          label="add salary"
          variant="filled"
          error={salaryError}
          helperText={salaryHelperText}
          fullWidth
          sx={{ backgroundColor: "#494949" }}
          color="info"
          margin="normal"
          value={mountOfSalary}
          type="number"
          onChange={(e) => setmountOfSalary(e.target.value)}
        />
        <Button type="submit" variant="outlined" fullWidth>
          add salary
        </Button>
      </form>
    );
  }
  return <div>{salaryEl}</div>;
};
