<template>
  <div class="dashboard" v-if="user">
    <h2>📊 Tableau de bord</h2>

    <section class="summary">
      <p>Bienvenue {{ user.email }} ! Tu as {{ tasks.length }} tâche(s) à faire.</p>
    </section>

    <NewTaskForm
      :subjects="subjects"
      :editing-task="editingTask"
      :user-id="user.id"
      @task-added="addTask"
      @task-updated="updateTask"
    />

    <section class="filters">
      <label>Filtrer par urgence :</label>
      <select v-model="filterUrgency">
        <option value="all">Toutes</option>
        <option value="urgent">Urgentes</option>
        <option value="normal">Non urgentes</option>
      </select>
    </section>

    <section class="tasks">
      <h3>📝 Tâches</h3>
      <ul>
        <li v-for="task in filteredTasks" :key="task.id_tache">
          <strong>{{ task.titre }}</strong> -
          <em>{{ task.type }}</em> -
          à rendre le {{ task.date_echeance }}
          <button @click="editTask(task)">✏️</button>
          <button @click="deleteTask(task.id_tache)">❌</button>
        </li>
      </ul>
    </section>
  </div>

  <div v-else class="unauthenticated">
    <h2>🔒 Accès restreint</h2>
    <p>Vous avez été redirigé car vous n'êtes pas connecté.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase.js'
import NewTaskForm from '../components/NewTaskForm.vue'

const user = ref(null)
const tasks = ref([])
const editingTask = ref(null)
const filterUrgency = ref('all')
const subjects = ref([])
const error = ref(null)

const fetchUser = async () => {
  const { data } = await supabase.auth.getSession()
  user.value = data?.session?.user || null
}

const fetchSubjects = async () => {
  const { data, error: err } = await supabase.from('matiere').select('*')
  if (!err && data) {
    subjects.value = data
  }
}

const fetchTasks = async () => {
  if (!user.value) return
  const { data, error: err } = await supabase
    .from('tache')
    .select('*')
    .eq('user_id', user.value.id)

  if (err) {
    error.value = err.message
  } else {
    tasks.value = data
    localStorage.setItem('tasks', JSON.stringify(data))
  }
}

const addTask = async (newTask) => {
  const { data, error: insertError } = await supabase
    .from('tache')
    .insert([{
      titre: newTask.title,
      description: newTask.description || '',
      date_echeance: newTask.dueDate,
      type: newTask.type,
      id_matiere: newTask.id_matiere,
      user_id: user.value.id,
      priorite: newTask.urgent ? 1 : 2,
      statut: 'à faire'
    }])
    .select()

  if (!insertError && data && data[0]) {
    tasks.value.push(data[0])
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  }
}

const updateTask = async (updatedTask) => {
  const { error: updateError } = await supabase
    .from('tache')
    .update({
      titre: updatedTask.title,
      description: updatedTask.description,
      date_echeance: updatedTask.dueDate,
      type: updatedTask.type,
      id_matiere: updatedTask.id_matiere,
      priorite: updatedTask.urgent ? 1 : 2
    })
    .eq('id_tache', updatedTask.id_tache)

  if (!updateError) {
    const index = tasks.value.findIndex(t => t.id_tache === updatedTask.id_tache)
    if (index !== -1) tasks.value[index] = updatedTask
    editingTask.value = null
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  }
}

const deleteTask = async (id) => {
  const { error: deleteError } = await supabase
    .from('tache')
    .delete()
    .eq('id_tache', id)

  if (!deleteError) {
    tasks.value = tasks.value.filter(t => t.id_tache !== id)
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  }
}

const editTask = (task) => {
  editingTask.value = { ...task }
}

const filteredTasks = computed(() => {
  const today = new Date()
  return tasks.value
    .filter(task => {
      const due = new Date(task.date_echeance)
      const timeDiff = (due - today) / (1000 * 60 * 60 * 24)
      if (filterUrgency.value === 'urgent') return timeDiff <= 2
      if (filterUrgency.value === 'normal') return timeDiff > 2
      return true
    })
    .sort((a, b) => new Date(a.date_echeance) - new Date(b.date_echeance))
})

onMounted(async () => {
  await fetchUser()
  if (user.value) {
    await fetchSubjects()
    await fetchTasks()
  }
})
</script>
