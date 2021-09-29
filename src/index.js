const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;


  const  user = users.find( (user) => user.username === username );

 if(!user){
    return response.status(404).json({ error: "User Already Exists!" });

}

request.user = user;
    
return next();

}

app.get('/', (request, response) => {
  // Complete aqui
  
   return response.json({message: "hello!"});
});

app.post('/users', (request, response) => {
  // Complete aqui
 
  const {name,username } = request.body;

  const  userAlreadyExists = users.some(
      (user) => user.username === username
      
  );
  
  if(userAlreadyExists){
      return response.status(400).json({ error: "User Already Exists!" });

  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
    };

    users.push(user);
   
   return response.status(201).send(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
    const {user} = request;

    return response.status(200).send(user.todos);



});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
    const {user} = request;

    const { title, deadline} = request.body;

    const userTodo = {
      id: uuidv4(), // precisa ser um uuid
      title,
      done: false, 
      deadline,
      created_at: new Date()

    }

    user.todos.push(userTodo);

    return response.status(201).json(userTodo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  
  const { title, deadline} = request.body;

  const {id} = request.params;

  const  todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    return response.status(404).json({ error: "todo not exists!" });
  }
    todo.title = title;
    todo.deadline = deadline;

    return response.json(todo);
  });

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  
  
  const {id} = request.params;

  const  todo = user.todos.find(todo => todo.id === id);
  
 
    todo.done = true;
    

    return response.json(todo);
  });



app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
    const {user} = request;
  
  
    const {id} = request.params;

    const  todo = user.todos.find(todo => todo.id === id);

  
    const position = user.todos.indexOf(todo)

    if(position === -1) {
      return response.status(404).json({ error: "todo not found!" });

    }
    
    user.todos.splice(position,1);
    
  
    return response.status(204).send();

});

module.exports = app;

