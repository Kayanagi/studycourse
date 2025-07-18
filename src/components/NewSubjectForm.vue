<template>
  <form @submit.prevent="addSubject" class="new-subject-form">
    <h3>Ajouter une matière</h3>
    <input v-model="nom" type="text" placeholder="Nom de la matière" required />
    <textarea v-model="description" placeholder="Description de la matière"></textarea>
    <button type="submit">Ajouter</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase.js'

const emit = defineEmits(['subject-added'])

const nom = ref('')
const description = ref('')

const addSubject = async () => {
  const localSubject = {
    nom: nom.value,
    description: description.value,
    synced: false
  }

  // Ajouter en local d'abord
  const all = JSON.parse(localStorage.getItem('subjects') || '[]')
  all.push(localSubject)
  localStorage.setItem('subjects', JSON.stringify(all))
  emit('subject-added', localSubject)

  // Puis essayer d'envoyer à Supabase
  const { data, error } = await supabase.from('matiere').insert([{
    nom: nom.value,
    description: description.value
  }]).select()

  if (!error && data && data[0]) {
    const updated = all.map(item =>
      item === localSubject ? { ...data[0], synced: true } : item
    )
    localStorage.setItem('subjects', JSON.stringify(updated))
    emit('subject-added', data[0])
  }

  nom.value = ''
  description.value = ''
}
</script>