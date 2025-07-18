<template>
  <div class="subjects">
    <header class="subjects-header">
      <h2>📚 Liste des matières</h2>
    </header>

    <template v-if="user">
      <section class="subject-list" v-if="subjects.length">
        <SubjectCard
          v-for="subject in subjects"
          :key="subject.nom"
          :subject="subject"
          @delete="deleteSubject"
        />
      </section>

      <section class="form-section">
        <NewSubjectForm @subject-added="addSubject" />
      </section>
    </template>

    <p v-else>
      🔒 Tu dois être connecté pour accéder aux matières.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase.js'
import SubjectCard from '../components/SubjectCard.vue'
import NewSubjectForm from '../components/NewSubjectForm.vue'

const subjects = ref([])
const user = ref(null)
const error = ref(null)

const fetchUser = async () => {
  const localUser = localStorage.getItem('user')
  if (localUser) {
    user.value = JSON.parse(localUser)
  }
}

const fetchSubjects = async () => {
  const local = JSON.parse(localStorage.getItem('subjects') || '[]')
  subjects.value = [...local]

  const { data, error: err } = await supabase.from('matiere').select('*')
  if (!err && data) {
    subjects.value = data
    localStorage.setItem('subjects', JSON.stringify(data.map(m => ({ ...m, synced: true }))))
  }
}

const addSubject = (newSubject) => {
  const current = JSON.parse(localStorage.getItem('subjects') || '[]')
  current.push(newSubject)
  localStorage.setItem('subjects', JSON.stringify(current))
  fetchSubjects()
}

const deleteSubject = async (id) => {
  const { error } = await supabase.from('matiere').delete().eq('id_matiere', id)
  if (!error) {
    const local = JSON.parse(localStorage.getItem('subjects') || '[]')
    const updated = local.filter(m => m.id_matiere !== id)
    localStorage.setItem('subjects', JSON.stringify(updated))
    fetchSubjects()
  }
}

onMounted(() => {
  fetchUser()
  fetchSubjects()
})
</script>