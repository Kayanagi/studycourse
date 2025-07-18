<template>
    <div class="card">
      <h3>{{ revision.titre }}</h3>
  
      <p>
        {{ isExpanded ? revision.contenu : truncatedContent }}
      </p>
  
      <button v-if="isLong" @click="isExpanded = !isExpanded">
        {{ isExpanded ? 'Voir moins' : 'Voir plus' }}
      </button>
  
      <button class="delete" @click="$emit('delete', revision.id_fiche)">Supprimer</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      revision: Object
    },
    data() {
      return {
        isExpanded: false
      }
    },
    computed: {
      isLong() {
        return this.revision.contenu && this.revision.contenu.length > 150
      },
      truncatedContent() {
        return this.revision.contenu.slice(0, 150) + '...'
      }
    }
  }
  </script>
  
  <style scoped>
  .card {
    border: 1px solid #ccc;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
  }
  
  button {
    margin-top: 0.5rem;
    padding: 0.3rem 0.7rem;
    border: none;
    background-color: #646cff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button.delete {
    background-color: #ff4d4d;
    margin-left: 1rem;
  }
  </style>
  