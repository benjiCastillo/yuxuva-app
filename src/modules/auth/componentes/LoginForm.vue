<template>
    <Form :initial-values="loginForm" class="grid gap-4" @submit="onSubmit">
        <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Iniciar sesión</h2>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Accede a tu cuenta de administrador</p>
        </div>
        <div>
            <InputTextCommon type="email" fieldName="email" title="Correo del equipo" rules="required|max:60" />
        </div>
        <div>
            <InputTextCommon type="password" fieldName="password" title="Contraseña" rules="required|max:60" />
        </div>
        <p v-if="submitError" class="text-sm text-red-500">{{ submitError }}</p>
        <div>
            <Button label="Iniciar sesión" type="submit" fluid :loading="isSubmitting" />
        </div>
    </Form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Form } from 'vee-validate'
import Button from 'primevue/button'
import InputTextCommon from '@/shared/components/form-common/InputTextCommon.vue'
import { setupValidation } from '@/shared/utils/setup-validation'
import { useAuthStore } from '@/store/auth.store'

setupValidation()

const loginForm = ref({
    email: null,
    password: null,
})

const authStore = useAuthStore()
const router = useRouter()
const isSubmitting = ref(false)
const submitError = ref('')

const onSubmit = async (values) => {
    submitError.value = ''
    isSubmitting.value = true

    try {
        await authStore.login(values)
        await router.push('/admin')
    } catch (error) {
        const status = error?.response?.status

        if (status === 429) {
            submitError.value = 'Demasiados intentos. Espera unos segundos e intenta de nuevo.'
        } else {
            submitError.value = 'No pudimos iniciar sesión. Revisa tus credenciales.'
        }
    } finally {
        isSubmitting.value = false
    }
}
</script>
