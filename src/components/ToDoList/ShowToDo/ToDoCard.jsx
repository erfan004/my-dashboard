import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DoneIcon from '@mui/icons-material/Done';
import { Button, CardActions } from '@mui/material';

export default function ToDoCard({item , click , arrayLength}) {
  return (
    <Card  sx={{mt:'15px', minWidth: arrayLength<=1 ? '250px' : '' , maxWidth:'400px'  ,backgroundColor:'#000' , color:'#0289d1de' , borderRadius:'10px' , overflow : 'auto'}}>
        <CardContent> 
          <Typography variant="h5" component="div">
            {item.title}
          </Typography>
          <Typography  variant="body2" color={'#929292'} sx={{wordWrap: 'break-word'}}>
            {item.description}
          </Typography>
        </CardContent>
        <CardActions>
            <Button onClick={click} color='success' variant='outlined' startIcon={<DoneIcon />}>Done</Button>
        </CardActions>
    </Card>
  );
}
