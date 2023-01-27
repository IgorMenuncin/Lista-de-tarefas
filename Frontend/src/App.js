import React from 'react';
import './App.css';
import {AiOutlineEdit, AiOutlineDelete} from 'react-icons/ai';
import axios from 'axios';

function App() {
  const Todos = ({todos}) => {  
    return (
      <div className="todos">
        {todos.map(todo => {
          return (
            <div key={todo.id} className="todo">
              <button 
                onClick={() => modifyStatusTodo(todo)}
                className="checkbox" 
                style={{backgroundColor: todo.status ? "#A879E6" : "white"}}>
              </button>
              <p>{todo.name}</p>
              <button onClick={() => handleWithEditButtonClick(todo)}>
                <AiOutlineEdit size={20} color={"#64697b"}>
                </AiOutlineEdit>
              </button>
              <button onClick={ () => deleteTodo(todo)}>
                <AiOutlineDelete size={20} color={"#64697b"}></AiOutlineDelete>
              </button>
            </div>
          )
        })}
      </div>
    )
  }

  const [todos, setTodos] = React.useState([]); // Criação do estado todos que vai armazenar as todos que virão do backend

  const [inputValue, setInputValue] = React.useState(""); // Criação do estado inputValue que irá armazenar o valor do input da nova tarefa, ou seja, seu titulo

  const [inputVisibility, setInputVisibility] = React.useState(false); // Criação do estado inputVisibility que irá determinar se a caixa de titulo da nova tarefa irá aparecer ou não

  const [selectedTodo, setSelectedTodo] = React.useState();

  async function handleWithNewButton() {
    setInputVisibility(!inputVisibility); //Essa função altera o estado inputVisibility para o oposto do valor atual, ou seja, caso seja true, ela altera para false
  }

  async function getTodos() {
    const response = await axios.get("http://localhost:3333/todos"); // Fazendo a requisição para o localhost:3333 que é a porta onde o server (backend) esta rodando
    setTodos(response.data); // Atribui para o estado todos o valor de response.data. Sendo response a resposta da requisição ao backend
  }

  async function createTodo() {
    const response = await axios.post("http://localhost:3333/todos", {name: inputValue});
    setInputValue("");
    getTodos();
    setInputVisibility(!inputVisibility);
  }

  async function deleteTodo(todo) {
    console.log("Deletada")
    await axios.delete(`http://localhost:3333/todos/${todo.id}`);
    getTodos();
  }

  async function modifyStatusTodo(todo) {
    console.log("Alterada")
    await axios.put("http://localhost:3333/todos", {
      id: todo.id,
      status: !todo.status,
    })
    getTodos();
  }

  async function handleWithEditButtonClick(todo) {
    setSelectedTodo(todo);
    setInputVisibility(true);
  }

  async function editTodo() {
    await axios.put("http://localhost:3333/todos", {
      id: selectedTodo.id,
      name: inputValue
    });
    setSelectedTodo();
    setInputValue("");
    setInputVisibility(false);
    getTodos();
  }

  React.useEffect(() => {
    getTodos(); // Função que recebe a lista de todos
  }, []);

  return (
    <div className="App">
      <header className="container">
        <div className="header">
          <h1>Dont be lazzy</h1>
        </div>
        <Todos todos={todos}/>
        <input 
          value={inputValue} 
          style={{display: inputVisibility ? "block" : "none"}} //Se o estado inputVisibility for true, o display é block, ou seja, ira aparecer, caso seja false, nao ira aparecer
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
          className="inputName"></input>
        <button 
          onClick={inputVisibility ? selectedTodo ? editTodo : createTodo : handleWithNewButton} // Se tiver algum selectedTodo ele ira chamar a função editTodo, caso nao tenha, a função createTodo sera criada
          className="newTaskButton"
        >
          {inputVisibility ? "Confirm" : "+ New task"} {/*Se o inputVisibility*/}
        </button> {/*Ao clicar chama a função handleWithNewButton*/}
      </header>
    </div>
  );
}

export default App;

