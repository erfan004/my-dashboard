import React, { useState } from "react";
import ToDoCard from "./ToDoCard";
import Grid from "@mui/material/Grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Paper, Typography } from "@mui/material";


export const ShowToDo = () => {
  const [todos, setTodos] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://dashboard-e6a2f-default-rtdb.firebaseio.com/todos.json"
      );
      const todosData = response.data;
      if (todosData) {
        const todosArray = Object.keys(todosData).map((key) => ({
          id: key,
          ...todosData[key],
        }));
        setTodos(todosArray);
        return todosArray;
      } else {
        setTodos([]);
        return [];
      }
    } catch (err) {
      console.log(err);
    }
  };

  const todosQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchData(),
  });

  const queryClinet = useQueryClient()
  const removeMutationHandler = useMutation((id) =>
    axios.delete(
      `https://dashboard-e6a2f-default-rtdb.firebaseio.com/todos/${id}.json`
    ) ,{
      onSuccess : ()=> queryClinet.invalidateQueries(['posts'])
    }
  );

  const removeHandler = (id) => {
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    removeMutationHandler.mutate(id);
  };

  let todosElement;
  if (todosQuery.isFetching) {
    todosElement = (
      <Typography variant="h2" sx={{ color: "#0289d1de" }}>
        data is loading ...
      </Typography>
    );
  } else if (todosQuery.isError) {
    todosElement = (
      <Typography variant="h2" sx={{ color: "#0289d1de" }}>
        fetching data has been failed
      </Typography>
    );
  } else if (todos.length === 0) {
    todosElement = (
      <Typography variant="h2" sx={{ color: "#0289d1de" }}>
        no todos to show ...
      </Typography>
    );
  } else {
    todosElement = (
      <Grid container spacing={1} >
        {todos.map((item) => (
          <Grid item key={item.id} md={6} sm={12} xs={12}>
            <Paper sx={{ bgcolor: "black", borderRadius: "10px" }}>
              <ToDoCard click={() => removeHandler(item.id)} item={item} arrayLength={todos.length}/>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }
  return <div>{todosElement}</div>;
};
