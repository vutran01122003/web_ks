import React, { useState } from 'react'

const Testcrpage = () => {
    const [tasks, setTasks] = useState([{ taskName: '', taskDescription: '' }]);

    const addTask = () => {
        setTasks([...tasks, { taskName: '', taskDescription: '' }]);
    };

    const updateTask = (index, key, value) => {
        const updatedTasks = [...tasks];
        updatedTasks[index][key] = value;
        setTasks(updatedTasks);
    };

    const deleteTask = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks.splice(index, 1);
        setTasks(updatedTasks);
    };
    return (
        <div>
            <h2>Todo List</h2>
            {tasks.map((task, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Task Name"
                        value={task.taskName}
                        onChange={(e) => updateTask(index, 'taskName', e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Task Description"
                        value={task.taskDescription}
                        onChange={(e) => updateTask(index, 'taskDescription', e.target.value)}
                    />
                    <button onClick={() => deleteTask(index)}>Delete</button>
                </div>
            ))}
            <button onClick={addTask}>Add Task</button>
        </div>
    )
}

export default Testcrpage