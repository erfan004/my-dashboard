import { Container } from "@mui/system";
import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const AddToDo = () => {

  const navigate = useNavigate()

  const [title , setTitle] = useState('')
  const [description , setDescription] = useState('')
  const [titleError , setTitleError] = useState(false)
  const [descriptionError , setDescriptionError] = useState(false)

  const queryClinet = useQueryClient()
  const todosMutation = useMutation((data)=>axios.post('https://dashboard-e6a2f-default-rtdb.firebaseio.com/todos.json' , data), {
    onSuccess : (res)=>{
      console.log(res);
      navigate('/show-todos')
      queryClinet.invalidateQueries(['posts'])
    },
    onError : (err)=>{
      console.log(err);
    }
  })
  const sendData = (e) => {
    setTitleError(false)
    setDescriptionError(false)
    e.preventDefault();
    if(title.trim() === ''){
      setTitleError(true)
    }
    else if(description.trim() ===''){
      setDescriptionError(true)
    }
    else{
      setDescriptionError(false)
      setTitleError(false)
      todosMutation.mutate({
        title : title , 
        description : description
      })
    }
  };

  return (
    <Container>
      <Typography variant="h6" component={'p'} sx={{color : '#929292'}}>here you can add todos by filling the subjet and description fields</Typography>
      <form onSubmit={sendData}>
        <TextField
          fullWidth
          sx={{  backgroundColor : '#494949'}}
          label="Title"
          variant="filled"
          color="info"
          value={title}
          error={titleError}
          onChange={(e)=>setTitle(e.target.value)}
          margin="normal"
          disabled={todosMutation.isLoading}
          />

        <TextField
          multiline
          sx={{backgroundColor : '#494949'}}
          rows={5}
          variant="filled"
          color="info"
          fullWidth
          value={description}
          error={descriptionError}
          onChange={(e)=>setDescription(e.target.value)}
          margin="normal"
          label="Description"
          disabled={todosMutation.isLoading}
          />
        <Button variant="outlined" color="info" type="submit" startIcon={<AddIcon />}>
          click to create
        </Button>
      </form>
    </Container>
  );
};
