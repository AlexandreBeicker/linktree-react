import { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { getAuth } from 'firebase/auth';
import { Input } from "../../components/Input";

interface TodoItem {
  id: string;
  text: string;
}

export function ToDoList() {
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
    const [newTodo, setNewTodo] = useState('');
  
    useEffect(() => {
      const fetchTodos = async () => {
        const user = getAuth().currentUser;
        if (user) {
          const todosRef = collection(db, 'todos');
          const userTodosQuery = query(todosRef, where('userId', '==', user.uid));
          const snapshot = await getDocs(userTodosQuery);
          const todos: TodoItem[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            text: doc.data().text,
          }));
          setTodoItems(todos);
        }
      };
  
      fetchTodos();
    }, []);
  
    const addTodo = async () => {
      if (newTodo.trim() !== '') {
        const user = getAuth().currentUser;
        if (user) {
          const todosRef = collection(db, 'todos');
          const newTodoDocRef = await addDoc(todosRef, {
            text: newTodo,
            userId: user.uid,
          });
          setTodoItems([...todoItems, { id: newTodoDocRef.id, text: newTodo }]);
          setNewTodo('');
        }
      }
    };
  
    const removeTodo = async (id: string) => {
      await deleteDoc(doc(db, 'todos', id));
      setTodoItems(todoItems.filter((item) => item.id !== id));
    };
  
    return (
      <div className="flex items-center flex-col min-h-screen pb-7 px-2">
      <Header/>

      <div className="flex flex-col mt-8 mb-3 w-full max-w-xl">
        <label className="text-white font-medium mt-2 mb-2 flex justify-center items-center">Nova Tarefa</label>
        <Input
          type="text"
          placeholder="Digite a nova tarefas..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />

        <button
          className="mb-7 h-9 rounded-md text-white font-medium gap-4 flex justify-center items-center"
          style={{backgroundColor: '#43418e'}}
          onClick={addTodo}
        >
          Adicionar Tarefa
        </button>
      </div>

      <h2 className="font-bold text-white mb-4 text-2xl">Lista de Tarefas</h2>

      {todoItems.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between w-11/12 max-w-xl rounded py-3 px-2 mb-2 select-none text-white"
          style={{backgroundColor: '#43418e'}}
        >
          
          <p>{todo.text}</p>
          <button
            className="border border-dashed p-1 rounded text-white"
            style={{backgroundColor: '#43418e'}}
            onClick={() => removeTodo(todo.id)}
          >
            Remover
          </button>
        </div>
      ))}
    </div>
  );
}
