<template>
  <form @submit.prevent="submitForm" class="task-form">
    <input type="text" v-model="task.title" placeholder="Titre de la tâche" required />
    <select v-model="task.type" required>
      <option disabled value="">Type de tâche</option>
      <option>révision</option>
      <option>devoir</option>
    </select>
    <select v-model="task.id_matiere" required>
      <option disabled value="">Choisir une matière</option>
      <option v-for="subject in subjects" :key="subject.id_matiere" :value="subject.id_matiere">
        {{ subject.nom }}
      </option>
    </select>
    <input type="date" v-model="task.dueDate" required />
    <button type="submit">{{ task.id_tache ? 'Mettre à jour' : 'Ajouter' }}</button>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { supabase } from '../supabase.js'

const props = defineProps({
  subjects: Array,
  editingTask: Object,
  userId: String
})

const emit = defineEmits(['task-updated'])

const task = reactive({
  title: '',
  type: '',
  id_matiere: '',
  dueDate: '',
  id_tache: null
})

watch(() => props.editingTask, (newTask) => {
  if (newTask) {
    task.title = newTask.titre
    task.type = newTask.type
    task.id_matiere = newTask.id_matiere
    task.dueDate = newTask.date_echeance
    task.id_tache = newTask.id_tache
  }
}, { immediate: true })

const submitForm = async () => {
  if (!props.userId) {
    alert('Utilisateur non connecté.')
    return
  }

  if (task.id_tache) {
    const { error } = await supabase
      .from('tache')
      .update({
        titre: task.title,
        date_echeance: task.dueDate,
        type: task.type,
        id_matiere: task.id_matiere
      })
      .eq('id_tache', task.id_tache)

    if (!error) {
      updateLocalTask({ ...task })
      
    
    const updatedTask = {
      ...task,
      titre: task.title,
      date_echeance: task.dueDate,
      type: task.type,
      id_matiere: task.id_matiere
    }

    emit('task-updated', updatedTask)

    const currentTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const index = currentTasks.findIndex(t => t.id_tache === updatedTask.id_tache)
    if (taskIndex !== -1) {
      currentTasks[index] = updatedTask
      localStorage.setItem('tasks', JSON.stringify(currentTasks))
    }
    
    const updatedTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    const taskIndex = updatedTasks.findIndex(t => t.id_tache === task.id_tache)
    if (taskIndex !== -1) {
      updatedTasks[taskIndex] = { ...task }
      localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    }
    
    }
  } else {
    const { data, error } = await supabase
      .from('tache')
      .insert([{
        titre: task.title,
        date_echeance: task.dueDate,
        type: task.type,
        id_matiere: task.id_matiere,
        user_id: props.userId,
        priorite: 2,
        statut: 'à faire'
      }])
      .select()

    if (!error && data && data.length > 0) {
      addLocalTask(data[0])
    }
  }

  task.title = ''
  task.type = ''
  task.id_matiere = ''
  task.dueDate = ''
  task.id_tache = null
}

const addLocalTask = (newTask) => {
  const local = JSON.parse(localStorage.getItem('tasks') || '[]')
  local.push(newTask)
  localStorage.setItem('tasks', JSON.stringify(local))
}

const updateLocalTask = (updatedTask) => {
  const local = JSON.parse(localStorage.getItem('tasks') || '[]')
  const updated = local.map(t => t.id_tache === updatedTask.id_tache ? updatedTask : t)
  localStorage.setItem('tasks', JSON.stringify(updated))
}
</script>
