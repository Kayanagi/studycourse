<template>
  <div>
    <h2>Liste des matières</h2>
    <ul>
      <li v-for="subject in subjects" :key="subject.Id_matiere">
        {{ subject.nom }} — {{ subject.description }}
      </li>
    </ul>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase.js'

const subjects = ref([])
const error = ref(null)

const fetchSubjects = async () => {
  const { data, error: err } = await supabase.from('matiere').select('*')
  if (err) {
    error.value = err.message
  } else {
    subjects.value = data
  }
}

onMounted(fetchSubjects)
</script>