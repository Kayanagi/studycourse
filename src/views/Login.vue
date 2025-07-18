<template>
  <div class="login">
    <form class="login-form" @submit.prevent="handleSubmit">
      <h2 class="form-title">
        {{ isLogin ? '🔐 Connexion' : '📝 Inscription' }}
      </h2>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="form.email" required placeholder="exemple@mail.com" />
      </div>

      <div class="form-group" v-if="!isLogin">
        <label for="username">Nom d'utilisateur</label>
        <input type="text" v-model="form.username" required placeholder="Nom" />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" v-model="form.password" required placeholder="........."/>
      </div>

      <button type="submit">
        {{ isLogin ? 'Se connecter' : "S'inscrire" }}
      </button>

      <p class="switch-mode">
        {{ isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?" }}
        <a href="#" @click.prevent="isLogin = !isLogin">
          {{ isLogin ? "Inscription" : "Connexion" }}
        </a>
      </p>
    </form>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase.js'

const router = useRouter()
const isLogin = ref(true)
const form = ref({
  email: '',
  password: '',
  username: ''
})

onMounted(() => {
  const localUser = localStorage.getItem('user')
  if (localUser) {
    router.push('/dashboard')
  }
})

const handleSubmit = async () => {
  if (isLogin.value) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password
    })

    if (error) {
      alert('Erreur de connexion : ' + error.message)
    } else {
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard')
    }

  } else {
    const { data, error } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: { username: form.value.username }
      }
    })

    if (error) {
      alert("Erreur d'inscription : " + error.message)
    } else {
      alert("Inscription réussie ! Vérifie tes mails.")
      isLogin.value = true
    }
  }
}
</script>
