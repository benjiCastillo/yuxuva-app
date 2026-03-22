export const formatStageLabel = (stage) => {
    return [stage?.stageOrder ? `ET ${stage.stageOrder}` : null, stage?.name].filter(Boolean).join(' - ')
}

export const formatCategoryLabel = (category) => {
    return [category?.name, category?.modality].filter(Boolean).join(' - ')
}

export const formatTeamLabel = (team) => {
    return [
        team?.competitionNo ? `#${team.competitionNo}` : null,
        [team?.driver?.firstName, team?.driver?.lastName].filter(Boolean).join(' '),
        [team?.codriver?.firstName, team?.codriver?.lastName].filter(Boolean).join(' / '),
    ]
        .filter(Boolean)
        .join(' - ')
}

export const formatStageEventLabel = (stage) => {
    return [
        stage?.rally?.calendar?.roundNumber ? `Fecha ${stage.rally.calendar.roundNumber}` : null,
        stage?.rally?.calendar?.eventName,
    ]
        .filter(Boolean)
        .join(' - ')
}

export const groupSchedulesByCategory = (schedules = []) => {
    const groups = new Map()

    schedules.forEach((schedule) => {
        const categoryId = schedule?.category?.id ?? schedule?.categoryId ?? 'no-category'
        const categoryName = schedule?.category?.name ?? 'Sin categoria'
        const key = `${categoryId}`

        if (!groups.has(key)) {
            groups.set(key, {
                id: categoryId,
                name: categoryName,
                category: schedule?.category ?? null,
                items: [],
            })
        }

        groups.get(key).items.push(schedule)
    })

    return Array.from(groups.values())
        .map((group) => ({
            ...group,
            items: [...group.items].sort((left, right) => {
                const orderDifference = Number(left?.startOrder ?? 0) - Number(right?.startOrder ?? 0)

                if (orderDifference !== 0) {
                    return orderDifference
                }

                return String(left?.team?.competitionNo ?? '').localeCompare(String(right?.team?.competitionNo ?? ''))
            }),
        }))
        .sort((left, right) => left.name.localeCompare(right.name))
}

export const formatDateTime = (value) => {
    if (!value) {
        return ''
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return ''
    }

    return new Intl.DateTimeFormat('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date)
}

export const formatDuration = (milliseconds) => {
    if (milliseconds === null || milliseconds === undefined || milliseconds === '') {
        return ''
    }

    const numericValue = Number(milliseconds)

    if (Number.isNaN(numericValue)) {
        return ''
    }

    const totalSeconds = Math.floor(numericValue / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const ms = numericValue % 1000

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`
}

export const formatFinalTime = (time, penalty) => {
    const baseTime = Number(time ?? 0)
    const penaltyTime = Number(penalty ?? 0)

    if (Number.isNaN(baseTime) || Number.isNaN(penaltyTime)) {
        return ''
    }

    return formatDuration(baseTime + penaltyTime)
}

export const splitDateTimeMs = (value) => {
    if (!value) {
        return {
            date: null,
            milliseconds: '000',
        }
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return {
            date: null,
            milliseconds: '000',
        }
    }

    const milliseconds = String(date.getMilliseconds()).padStart(3, '0')
    date.setMilliseconds(0)

    return {
        date,
        milliseconds,
    }
}

export const combineDateTimeMs = (value, milliseconds) => {
    if (!(value instanceof Date)) {
        return null
    }

    const parsedMs = Number(String(milliseconds ?? '').padStart(3, '0'))

    if (Number.isNaN(parsedMs) || parsedMs < 0 || parsedMs > 999) {
        return null
    }

    const nextDate = new Date(value)
    nextDate.setMilliseconds(parsedMs)

    return nextDate
}

export const splitPenalty = (value) => {
    const numericValue = Number(value ?? 0)

    if (Number.isNaN(numericValue) || numericValue < 0) {
        return {
            value: 0,
            unit: 'ms',
        }
    }

    if (numericValue !== 0 && numericValue % 60000 === 0) {
        return {
            value: numericValue / 60000,
            unit: 'm',
        }
    }

    if (numericValue !== 0 && numericValue % 1000 === 0) {
        return {
            value: numericValue / 1000,
            unit: 's',
        }
    }

    return {
        value: numericValue,
        unit: 'ms',
    }
}

export const convertPenaltyToMilliseconds = (value, unit) => {
    const numericValue = Number(value)

    if (Number.isNaN(numericValue) || numericValue < 0) {
        return null
    }

    const factors = {
        ms: 1,
        s: 1000,
        m: 60000,
    }

    const factor = factors[unit]

    if (!factor) {
        return null
    }

    return Math.round(numericValue * factor)
}
