import React, { useState } from 'react';

export default function KanbanBoard() {
  // State untuk menyimpan daftar task (Berisi data awal game encyclopedia)
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Riset Tutorial Dungeon Arid',
      desc: 'Mencari jalur tercepat untuk menyelesaikan dungeon tanpa terkena trap.',
      priority: 'High',
      columnId: 'backlog',
      date: '12 Juni 2026'
    },
    {
      id: 2,
      title: 'Galeri Asset Senjata & Equipment',
      desc: 'Ekstrak icon beresolusi tinggi untuk item dan tipe senjata baru.',
      priority: 'Medium',
      columnId: 'todo',
      date: '10 Juni 2026'
    }
  ]);

  // State untuk kontrol Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumnId, setCurrentColumnId] = useState('');
  
  // State untuk Form Input Task Baru
  const [form, setForm] = useState({
    title: '',
    desc: '',
    priority: 'Medium'
  });

  // Definisi Struktur Kolom Kanban
  const columns = [
    { id: 'backlog', name: 'Backlog', color: 'text-slate-500' },
    { id: 'todo', name: 'To Do', color: 'text-indigo-500' },
    { id: 'progress', name: 'In Progress', color: 'text-amber-500' },
    { id: 'accepted', name: 'Accepted', color: 'text-emerald-500' }
  ];

  // Buka modal untuk kolom tertentu
  const openModal = (columnId) => {
    setCurrentColumnId(columnId);
    setIsModalOpen(true);
  };

  // Tutup modal dan reset form
  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ title: '', desc: '', priority: 'Medium' });
  };

  // Simpan task baru ke dalam state
  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!form.title || !form.desc) {
      alert('Harap isi judul dan deskripsi!');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: form.title,
      desc: form.desc,
      priority: form.priority,
      columnId: currentColumnId,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setTasks([...tasks, newTask]);
    closeModal();
  };

  // Hapus task berdasarkan ID
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Fungsi interaktif untuk memindahkan task ke kolom berikutnya/sebelumnya
  const moveTask = (id, direction) => {
    const columnIndex = columns.findIndex(col => col.id === tasks.find(t => t.id === id).columnId);
    let nextIndex = columnIndex + direction;

    if (nextIndex >= 0 && nextIndex < columns.length) {
      setTasks(tasks.map(task => {
        if (task.id === id) {
          return { ...task, columnId: columns[nextIndex].id };
        }
        return task;
      }));
    }
  };

  // Helper untuk menentukan warna badge kesulitan
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-500';
      case 'Medium': return 'bg-amber-50 text-amber-500';
      case 'Low': return 'bg-emerald-50 text-emerald-500';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  return (
    <div className="text-slate-700 min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-900 rounded-full flex items-center justify-center text-white text-[10px]">
            🌙
          </div>
          <span className="font-bold text-xl tracking-wide text-indigo-950 uppercase">GamePedia Board</span>
        </div>
        <nav className="flex gap-8 font-medium text-sm text-slate-600">
          <a href="#" className="text-indigo-900 font-semibold border-b-2 border-indigo-900 pb-1">Project</a>
          <a href="#" className="hover:text-slate-900">Team</a>
          <a href="#" className="hover:text-slate-900">Settings</a>
        </nav>
      </header>

      {/* Main Board */}
      <main className="flex-1 px-8 py-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start overflow-x-auto">
        {columns.map((col) => (
          <div key={col.id} className="bg-slate-100/70 border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 min-w-[250px]">
            {/* Column Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800">
                <span className={col.color}>●</span>
                <span>{col.name}</span>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  {tasks.filter(t => t.columnId === col.id).length}
                </span>
              </div>
              <button 
                onClick={() => openModal(col.id)} 
                className="bg-white hover:bg-indigo-50 text-indigo-600 w-7 h-7 rounded-lg shadow-xs border border-slate-200 transition-all flex items-center justify-center font-bold text-sm"
              >
                +
              </button>
            </div>

            {/* Task Cards Container */}
            <div className="flex flex-col gap-3 min-h-[150px]">
              {tasks.filter(task => task.columnId === col.id).map((task) => (
                <div key={task.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-md transition-all group relative">
                  <div className="flex justify-between items-center text-[10px] font-bold mb-2">
                    <span className={`${getPriorityClass(task.priority)} px-2 py-0.5 rounded-sm uppercase tracking-wider`}>
                      {task.priority}
                    </span>
                    <span className="text-slate-400 font-medium">{task.date}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{task.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{task.desc}</p>
                  
                  {/* Action Controls */}
                  <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => moveTask(task.id, -1)} 
                        className="text-xs text-slate-400 hover:text-indigo-600 disabled:opacity-30 p-1"
                        disabled={col.id === 'backlog'}
                      >
                        ◀
                      </button>
                      <button 
                        onClick={() => moveTask(task.id, 1)} 
                        className="text-xs text-slate-400 hover:text-indigo-600 disabled:opacity-30 p-1"
                        disabled={col.id === 'accepted'}
                      >
                        ▶
                      </button>
                    </div>
                    <button 
                      onClick={() => handleDeleteTask(task.id)} 
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all text-xs"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 class="font-bold text-lg text-indigo-950">Tambah Task Baru</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
            </div>
            <form onSubmit={handleSaveTask}>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Judul Task / Panduan</label>
                  <input 
                    type="text" 
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Contoh: Build Meta Hero Mage Patch v1.2" 
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tingkat Kesulitan</label>
                  <select 
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="High">High (Sulit)</option>
                    <option value="Medium">Medium (Normal)</option>
                    <option value="Low">Low (Mudah)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deskripsi Singkat</label>
                  <textarea 
                    rows="3" 
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                    placeholder="Tulis instruksi pengerjaan di sini..." 
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-50 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">Batal</button>
                <button type="submit" className="bg-indigo-900 hover:bg-indigo-800 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md transition-all">Simpan Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}