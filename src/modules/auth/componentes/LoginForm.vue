<template>
  <Form :initial-values="loginForm" class="grid gap-4" @submit="onSubmit">
    <div>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Iniciar sesión</h2>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Accede a tu cuenta de administrador</p>
    </div>
    <div>
      <InputTextCommon
        type="email"
        fieldName="email"
        title="Correo del equipo"
        rules="required|max:60"
      />
    </div>
    <div>
      <InputTextCommon
        type="password"
        fieldName="password"
        title="Contraseña"
        rules="required|max:60"
      />
    </div>
    <div>
      <Button label="Iniciar sesión" type="submit" fluid />
    </div>
  </Form>
</template>

<script setup>
import { ref } from "vue";
import { Form } from "vee-validate";
import Button from "primevue/button";
import InputTextCommon from "@/shared/components/form-common/InputTextCommon.vue";
import { setupValidation } from "@/shared/utils/setup-validation";

setupValidation();

const loginForm = ref({
  email: null,
  password: null,
});

const onSubmit = (values) => {
  console.log(values);
};
</script>
