
<template>
  <form @submit.prevent="submitForm">
    <input v-model="title" placeholder="Titre de la fiche" required />
    <textarea v-model="content" placeholder="Contenu" required></textarea>
    <select v-model="id_matiere" required>
      <option disabled value="">Choisir une matière</option>
      <option v-for="subject in subjects" :key="subject.id_matiere" :value="subject.id_matiere">
        {{ subject.nom }}
      </option>
    </select>
    <button type="submit">Ajouter</button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase.js'

const emit = defineEmits(['revision-added'])

const title = ref('')
const content = ref('')
const id_matiere = ref('')
const subjects = ref([])
const user = ref(null)

onMounted(async () => {
  const session = await supabase.auth.getSession()
  user.value = session?.data?.session?.user || null

  const { data, error } = await supabase.from('matiere').select('*')
  if (!error && data) {
    subjects.value = data
    localStorage.setItem('subjects', JSON.stringify(data))
  } else {
    const localSubjects = JSON.parse(localStorage.getItem('subjects') || '[]')
    subjects.value = localSubjects
  }
})

const submitForm = async () => {
  if (!user.value || !id_matiere.value) {
    alert('Utilisateur non connecté ou matière non sélectionnée.')
    return
  }

  const { data, error } = await supabase
    .from('fiche_de_revision')
    .insert([{
      titre: title.value,
      contenu: content.value,
      type: 'texte',
      statut_validation: 'non lue',
      id_matiere: id_matiere.value,
      user_id: user.value.id
    }])
    .select()

  if (error) {
    alert("Erreur lors de l'ajout : " + error.message)
    return
  }

  if (data && data[0]) {
    emit('revision-added', data[0])
    const local = JSON.parse(localStorage.getItem('revisions') || '[]')
    local.unshift(data[0])
    localStorage.setItem('revisions', JSON.stringify(local))

    title.value = ''
    content.value = ''
    id_matiere.value = ''
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
input,
textarea,
select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  align-self: flex-start;
  padding: 0.5rem 1rem;
}
</style>
