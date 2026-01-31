import { defineRule, configure } from 'vee-validate'
import { required, max, min, min_value, max_value, is, is_not, alpha_num, numeric } from '@vee-validate/rules'

export function setupValidation() {
    // Reglas básicas
    defineRule('required', required)
    defineRule('max', max)
    defineRule('min', min)
    defineRule('min_value', min_value)
    defineRule('max_value', max_value)
    defineRule('is', is)
    defineRule('is_not', is_not)
    defineRule('alpha_num', alpha_num)
    defineRule('numeric', numeric)

    defineRule('json', (value) => {
        try {
            JSON.parse(value)
            return true
        } catch {
            return 'El contenido no es un JSON válido'
        }
    })

    // Configuración de mensajes
    configure({
        generateMessage: (ctx) => {
            const messages = {
                required: `El campo es obligatorio`,
                max: `El límite de caracteres es ${ctx.rule.params[0]}`,
                min: `El mínimo de caracteres es ${ctx.rule.params[0]}`,
                min_value: `El valor mínimo es ${ctx.rule.params[0]}`,
                max_value: `El valor máximo es ${ctx.rule.params[0]}`,
                is: `El valor debe ser ${ctx.rule.params[0]}`,
                is_not: `El valor debe ser ${ctx.rule.params[0]}`,
                alpha_num: `El valor debe ser alfanumérico`,
                numeric: `El valor debe ser numérico`,
                json: `El contenido no es un JSON válido`,
            }
            return messages[ctx.rule.name] || 'Campo inválido'
        },
    })
}
