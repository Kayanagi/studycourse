<template>
  <div class="subject-card">
    <div class="subject-info">
      <h4>{{ subject.nom }}</h4> <!-- ✅ -->
      <p>{{ subject.description }}</p>
    </div>
    <div class="actions">
      <button @click="$emit('delete', subject.id_matiere)">❌ Supprimer</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  subject: {
    type: Object,
    required: true
  }
})
</script>

