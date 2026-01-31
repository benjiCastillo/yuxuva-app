export const getRuleValue = (rules, ruleName) => {
    if (!rules || typeof rules !== 'string') return null

    const rule = rules.split('|').find((r) => r.startsWith(`${ruleName}:`))

    return rule ? rule.split(':')[1] : null
}
