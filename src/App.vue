<template>
  <div>
    <nav class="navbar">
      <router-link v-if="!user" to="/">Connexion</router-link>
      <span v-if="!user" class="separator">|</span>

      <router-link to="/dashboard">Dashboard</router-link>
      <span class="separator">|</span>
      <router-link to="/subjects">Matières</router-link>
      <span class="separator">|</span>
      <router-link to="/revisions">Fiches</router-link>
      <span class="separator">|</span>

      <button v-if="user" class="logout-button" @click="logout">Déconnexion</button>
    </nav>

    <router-view />

    <div class="toast-notifications-container">
      <ToastNotification
        v-for="notification in notifications"
        :key="notification.id_notification"
        :title="notification.titre"
        :message="notification.message"
        :type="notification.type"
        :duration="4000"
        @close="removeNotification(notification.id_notification)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from './supabase.js'
import ToastNotification from './components/ToastNotification.vue'

const router = useRouter()
const notifications = ref([])
const user = ref(null)
let authListener = null

const fetchNotifications = async () => {
  if (!user.value) return
  const { data, error } = await supabase
    .from('notification')
    .select('*')
    .eq('user_id', user.value.id)
    .order('date_envoi', { ascending: false })
    .limit(5)

  if (!error && data) {
    notifications.value = data
  }
}

const removeNotification = async (id) => {
  notifications.value = notifications.value.filter(n => n.id_notification !== id)
  await supabase
    .from('notification')
    .delete()
    .eq('id_notification', id)
}

const addNotification = (titre, message, type = 'info') => {
  notifications.value.unshift({
    id_notification: Date.now(),
    titre,
    message,
    type
  })
}

const logout = async () => {
  await supabase.auth.signOut()
  addNotification('Déconnexion', 'Vous avez été déconnecté.', 'success')
  window.location.href = '/'  
}

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  user.value = data?.session?.user ?? null

  const { data: auth } = supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
    if (!session) {
      router.push('/')
    }
  })

  authListener = auth?.subscription

  await fetchNotifications()
})

onBeforeUnmount(() => {
  authListener?.unsubscribe?.()
})
</script>

<style>
.navbar {
  padding: 1rem 2rem;
  background: #f4f4f4;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar a,
.navbar button {
  font-size: 1rem;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.navbar a {
  color: #333;
  text-decoration: none;
}

.navbar a:hover {
  color: #646cff;
}

.separator {
  color: #aaa;
}

.logout-button {
  color: red;
  font-weight: bold;
  background-color: #e74c3c;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.logout-button:hover {
  background-color: #c0392b;
}

.toast-notifications-container {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1000;
  padding: 20px;
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
}
</style>
