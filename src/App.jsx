import React from 'react'
import MyDrawer from './components/MyDrawer/MyDrawer'
import { Route, BrowserRouter as Router , Routes } from 'react-router-dom'
import {AddToDo} from './components/ToDoList/AddToDo/AddToDo'
import {NotFound} from './components/NotFound/NotFound'
import {ShowToDo} from './components/ToDoList/ShowToDo/ShowToDo'
import { Salary } from './components/salary/Salary'
 const App = () => {
  return (
    <div>
      <Router>
        <MyDrawer>
        <Routes>
          <Route path='/' element={<AddToDo />}/>
          <Route path='/show-todos' element={<ShowToDo />}/>
          <Route path='/salary' element={<Salary />}/>
          <Route path='*' element={<NotFound />}/>
        </Routes>
        </MyDrawer>
      </Router>
    </div>
  )
}
export default App