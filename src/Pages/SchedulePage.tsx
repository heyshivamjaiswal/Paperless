import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTasksStore, type Task } from '../store/taskStore';
import { HiPlus, HiX, HiCheck, HiTrash } from 'react-icons/hi';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function SchedulePage() {
  const tasks = useTasksStore((s) => s.tasks);
  const setTasks = useTasksStore((s) => s.setTasks);
  const addTask = useTasksStore((s) => s.addTask);
  const updateTask = useTasksStore((s) => s.updateTask);
  const deleteTask = useTasksStore((s) => s.deleteTask);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTaskList, setShowTaskList] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/tasks', {
          credentials: 'include',
        });
        if (!res.ok) {
          setIsLoading(false);
          return;
        }
        const fetchedTasks = await res.json();
        setTasks(fetchedTasks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [setTasks]);

  // Convert tasks to calendar events
  const events = tasks.map((task) => ({
    id: task._id,
    title: task.title,
    start: new Date(task.date),
    end: new Date(task.date),
    resource: task,
  }));

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start);
    setShowTaskModal(true);
  };

  const handleSelectEvent = (event: any) => {
    setSelectedDate(event.start);
    setShowTaskList(true);
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !selectedDate) return;

    try {
      const res = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          date: selectedDate.toISOString(),
          completed: false,
        }),
      });

      if (!res.ok) return;

      const task = await res.json();
      addTask(task);
      setNewTask({ title: '', description: '' });
      setShowTaskModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const res = await fetch(`http://localhost:3000/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!res.ok) return;

      updateTask(task._id, { completed: !task.completed });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) return;

      deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getTasksForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(
      (task) => format(new Date(task.date), 'yyyy-MM-dd') === dateStr
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          <div className="text-sm text-white/40">Loading schedule...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black overflow-y-auto">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Schedule</h1>
          <p className="text-white/50 text-lg">
            Manage your tasks and appointments
          </p>
        </motion.div>

        {/* Calendar */}
        <motion.div
          className="calendar-container bg-white/[0.04] rounded-2xl border border-white/[0.08] p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            views={['month', 'week', 'day']}
            defaultView="month"
          />
        </motion.div>

        {/* Create Task Modal */}
        <AnimatePresence>
          {showTaskModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowTaskModal(false)}
              />
              <motion.div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         w-full max-w-md bg-[#1c1c1e] rounded-2xl border border-white/[0.08] 
                         shadow-2xl z-50 p-6"
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Add Task for{' '}
                    {selectedDate && format(selectedDate, 'MMM dd, yyyy')}
                  </h2>
                  <button
                    onClick={() => setShowTaskModal(false)}
                    className="p-2 rounded-lg hover:bg-white/[0.08] transition-colors"
                  >
                    <HiX className="text-xl text-white/60" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-2 block">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                      placeholder="Task title..."
                      className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/[0.08]
                               rounded-lg text-white placeholder-white/30
                               focus:outline-none focus:border-white/20 transition-colors"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white/70 mb-2 block">
                      Description (optional)
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                      placeholder="Add details..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/[0.08]
                               rounded-lg text-white placeholder-white/30
                               focus:outline-none focus:border-white/20 transition-colors
                               resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowTaskModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-white/[0.06] 
                             hover:bg-white/[0.08] text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTask}
                    disabled={!newTask.title.trim()}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-white text-black
                             hover:bg-white/90 transition-colors flex items-center justify-center gap-2
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiPlus className="text-lg" />
                    Add Task
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Task List Modal */}
        <AnimatePresence>
          {showTaskList && selectedDate && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowTaskList(false)}
              />
              <motion.div
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         w-full max-w-md bg-[#1c1c1e] rounded-2xl border border-white/[0.08] 
                         shadow-2xl z-50 p-6"
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Tasks for {format(selectedDate, 'MMM dd, yyyy')}
                  </h2>
                  <button
                    onClick={() => setShowTaskList(false)}
                    className="p-2 rounded-lg hover:bg-white/[0.08] transition-colors"
                  >
                    <HiX className="text-xl text-white/60" />
                  </button>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {getTasksForDate(selectedDate).length === 0 ? (
                    <p className="text-white/40 text-center py-8">
                      No tasks for this day
                    </p>
                  ) : (
                    getTasksForDate(selectedDate).map((task) => (
                      <motion.div
                        key={task._id}
                        className="p-4 rounded-lg bg-white/[0.04] border border-white/[0.08]
                                 hover:bg-white/[0.06] transition-colors group"
                        layout
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleComplete(task)}
                            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 
                                     flex items-center justify-center transition-colors
                                     ${
                                       task.completed
                                         ? 'bg-white border-white'
                                         : 'border-white/30 hover:border-white/50'
                                     }`}
                          >
                            {task.completed && (
                              <HiCheck className="text-black text-sm" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-medium ${
                                task.completed
                                  ? 'text-white/50 line-through'
                                  : 'text-white'
                              }`}
                            >
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-white/40 mt-1">
                                {task.description}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg
                                     text-red-400 hover:bg-red-400/10 transition-all"
                          >
                            <HiTrash className="text-base" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowTaskList(false);
                    setShowTaskModal(true);
                  }}
                  className="w-full mt-4 px-4 py-2.5 rounded-lg bg-white/[0.06]
                           hover:bg-white/[0.08] text-white transition-colors
                           flex items-center justify-center gap-2"
                >
                  <HiPlus className="text-lg" />
                  Add Task
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SchedulePage;
