<template>
    <div class="revisions">
      <!-- En-tête de la page -->
      <header class="page-header">
        <strong> 📘 Fiches de révision</strong><br />
      </header>
        <!-- Formulaire d’ajout -->
        <section class="form-section">
        <NewRevisionForm @revision-added="addRevision" />
      </section>
      <!-- Liste des fiches -->
      <section>
        <RevisionCard
          v-for="rev in revisions"
          :key="rev.id_fiche"
          :revision="rev"
          @delete="deleteRevision"
        />
      </section>
  

    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { supabase } from '../supabase.js'
  import RevisionCard from '../components/RevisionCard.vue'
  import NewRevisionForm from '../components/NewRevisionForm.vue'
  
  const revisions = ref([])
  const user = ref(null)
  const error = ref(null)
  
  const fetchUser = async () => {
    const { data } = await supabase.auth.getSession()
    user.value = data?.session?.user || null
  }
  
  const loadLocalRevisions = () => {
    const local = JSON.parse(localStorage.getItem('revisions') || '[]')
    revisions.value = local
  }
  
  const fetchRevisions = async () => {
    if (!user.value) return
    const { data, error: err } = await supabase
      .from('fiche_de_revision')
      .select('*')
      .eq('user_id', user.value.id)
  
    if (!err && data) {
      revisions.value = data
      localStorage.setItem('revisions', JSON.stringify(data))
    }
  }
  
  const addRevision = (newRev) => {
    revisions.value.push(newRev)
    localStorage.setItem('revisions', JSON.stringify(revisions.value))
  }
  
  const deleteRevision = async (id) => {
    const { error: deleteError } = await supabase
      .from('fiche_de_revision')
      .delete()
      .eq('id_fiche', id)
  
    if (!deleteError) {
      revisions.value = revisions.value.filter(r => r.id_fiche !== id)
      localStorage.setItem('revisions', JSON.stringify(revisions.value))
    }
  }
  
  onMounted(async () => {
    loadLocalRevisions()
    await fetchUser()
    await fetchRevisions()
  })
  </script>
  
  <style scoped>
  .revisions {
    padding: 2rem;
    max-width: 800px;
    margin: auto;
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 2rem;
    font-family: Arial, sans-serif;
  }
  
  .page-header strong {
    font-size: 1.8rem;
  }
  
  .page-header small {
    display: block;
    font-size: 1rem;
    color: #555;
    margin-top: 0.3rem;
  }
  
  .form-section {
    margin-top: 2rem;
  }
  </style>
  