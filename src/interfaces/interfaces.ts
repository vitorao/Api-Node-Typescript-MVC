export interface RegraHorario {
    intervals: Array<Intervals>,
    type: string,
    day?: string,
    daysOfWeek?: Array<string>
}

export interface Intervals {
    start: string,
    end: string
}

export interface Periodo {
    inicial: string,
    final: string
}