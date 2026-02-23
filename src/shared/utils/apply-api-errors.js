export function applyApiErrors(errorState, setFieldError) {
    if (!errorState?.fields) return

    Object.entries(errorState.fields).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
            setFieldError(field, messages[0])
        }
    })
}
