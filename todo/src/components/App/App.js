import React, { Component } from 'react';

import AppHeader from '../AppHeader'
import TodoList from '../TodoList';
import SearchPanel from '../SearchPanel';
import ItemStatusFilter from '../ItemStatusFilter';
import ItemAddForm from '../ItemAddForm';

import './App.css';

export default class App extends Component {
    
    // maxId = 1;
    constructor() {
        super();
        this.state = {
            todoData: [
                this.createTodoItem('Выпить кофе'),
                this.createTodoItem('Cделать классное приложение'),
                this.createTodoItem('Пообедать'),
            ],
            term: '',
            filter: 'all',
        };
        
    }

    // создание элемента
    createTodoItem = (label) => {
        return {
            label,
            important: false,
            done: false,
            id: this.randomID(), // добавил рандомный id
            // id: this.maxId++
        }
    }

    // удаление элемента
    deleteItem = (id) => {
        this.setState( ( { todoData } ) => {
            const idx = todoData.findIndex( (el) => el.id === id );

            const newArray = [
                ...todoData.slice(0, idx), 
                ...todoData.slice(idx + 1)
            ];
            return {
                todoData: newArray
            }
        } )
    };

    // добавление элемента
    addItem = (text) => {
        const newItem = this.createTodoItem(text);

        this.setState(({ todoData }) => {
            const newArr = [...todoData, newItem];

            return {
                todoData: newArr
            };
        });
    }

    // добавление свойства
    toggleProperty = (arr, id, propName) => {
        const idx = arr.findIndex( (el) => el.id === id );
        // 1. update object
        const oldItem = arr[idx];
        const newItem = {...oldItem, [propName]: !oldItem[propName] };
        // 2. construct new array
        return [
            ...arr.slice(0, idx), 
            newItem,
            ...arr.slice(idx + 1),
        ];
    }

    // добавление свойства important
    onToggleImportant = (id) => {
        this.setState(({ todoData }) => {
            return {todoData: this.toggleProperty(todoData, id, 'important')}
        })
    }

    // добавление свойства done
    onToggleDone = (id) => {
        this.setState(({ todoData }) => {
            return {todoData: this.toggleProperty(todoData, id, 'done')}
        });
    };

    // вывод отфильтрованных значений
    onSearchChange = (term) => {
        this.setState( { term } );
    };
    // все, активные или выполненные
    onFilterChange = (filter) => {
        this.setState( { filter } );
    };

    // поиск фильтрация вводимых значений
    search = (items, term) => {

        if(term.length === 0) return items;

        return items.filter((item) => {
            // return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
            return item.label.toLowerCase().trim().indexOf(term.toLowerCase().trim()) > -1;
        });
    };

    // выбранный фильтр
    filter = (items, filter) => {

        switch (filter) {
            case 'all':
                return items;
            case 'active':
                return items.filter((item) => !item.done);
            case 'done':
                return items.filter((item) => item.done);
            default:
                return items;
        }

    }

    // то что я добавил
    // случайное id
    randomID = () => {
        const min = 0;
        const max = 1000000; // ну чтоб точно не повторилось
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }

    // запись в LS
    saveToLocalStorage = () => {
        localStorage.setItem('todoData', JSON.stringify(this.state.todoData));
    }
    
    // проверкаа LS
    checkFunk = () => {
        if (JSON.parse(localStorage.getItem('todoData')) !== null) this.setState({ todoData: JSON.parse(localStorage.getItem('todoData'))})
    }

    // проверкаа LS
    componentDidMount() {
        this.checkFunk();
    }

    // запись в LS
    componentDidUpdate() {
        this.saveToLocalStorage();
    }
    // все!

    render() {

        const { todoData, term, filter } = this.state;

        // поиск
        const visibleItems = this.filter(this.search(todoData, term), filter);
        // выполненные задачи
        const doneCount = todoData.filter((element) => element.done).length;

        // не выполненные задачи
        const todoCount = todoData.length - doneCount;

        return (
            <div className="todo-app container">
                <AppHeader toDo={todoCount} done={doneCount} />
                <div className="top-panel">
                    <SearchPanel onSearchChange={this.onSearchChange} />
                    <ItemStatusFilter filter={filter}
                                        onFilterChange={this.onFilterChange} />
                </div>
    
                {/* todoData передается как props классу TodoList */}
                <TodoList 
                    todos={visibleItems}
                    // todos={todoData}
                    onDeleted={ this.deleteItem }
                    onToggleImportant={this.onToggleImportant}
                    onToggleDone={this.onToggleDone}/>
                <ItemAddForm onItemAdded={this.addItem} />
                {/* <ItemAddForm onItemAdded={this.addItem} saveToLocalStorage={this.saveToLocalStorage} /> */}
            </div>
        );
    }
};