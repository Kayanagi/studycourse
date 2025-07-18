<template>
    <div v-if="visible" class="toast-notification" :class="type">
      <div class="notification-content">
        <p class="notification-title">{{ title }}</p>
        <p class="notification-message">{{ message }}</p>
      </div>
      <button @click="close">&times;</button>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, onBeforeUnmount } from 'vue'
  
  const props = defineProps({
    id: Number,
    title: String,
    message: String,
    type: {
      type: String,
      default: 'info'
    },
    duration: {
      type: Number,
      default: 3000
    }
  })
  
  const emit = defineEmits(['close'])
  const visible = ref(true)
  let timeoutId = null
  
  onMounted(() => {
    timeoutId = setTimeout(() => {
      close()
    }, props.duration)
  })
  
  onBeforeUnmount(() => {
    clearTimeout(timeoutId)
  })
  
  const close = () => {
    visible.value = false
    emit('close', props.id)
  }
  </script>
  
  <style scoped>
  .toast-notification {
    position: relative;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-family: sans-serif;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 250px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    background-color: #3498db;
  }
  
  .notification-content {
    flex: 1;
  }
  
  .notification-title {
    font-weight: bold;
    margin: 0;
    margin-bottom: 5px;
  }
  
  .notification-message {
    margin: 0;
  }
  
  .toast-notification button {
    background: none;
    border: none;
    color: white;
    font-size: 1.2em;
    cursor: pointer;
  }
  
  .toast-notification.success {
    background-color: #2ecc71;
  }
  
  .toast-notification.warning {
    background-color: #f1c40f;
    color: #333;
  }
  
  .toast-notification.warning button {
    color: #333;
  }
  
  .toast-notification.error {
    background-color: #e74c3c;
  }
  </style>
  