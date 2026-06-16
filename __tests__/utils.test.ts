import { cn, formatDate, formatDateTime, getStatusColor, getPriorityColor } from '@/lib/utils'

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('filters falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b')
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2025-06-15T00:00:00Z')
    expect(result).toContain('Jun')
    expect(result).toContain('15')
    expect(result).toContain('2025')
  })

  it('returns em dash for null', () => {
    expect(formatDate(null)).toBe('—')
  })
})

describe('formatDateTime', () => {
  it('formats date and time', () => {
    const result = formatDateTime('2025-06-15T14:30:00Z')
    expect(result).toContain('Jun')
    expect(result).toContain('15')
    expect(result).toContain('2025')
  })
})

describe('getStatusColor', () => {
  it('returns correct color for todo', () => {
    expect(getStatusColor('todo')).toContain('gray')
  })

  it('returns correct color for in_progress', () => {
    expect(getStatusColor('in_progress')).toContain('blue')
  })

  it('returns correct color for done', () => {
    expect(getStatusColor('done')).toContain('green')
  })
})

describe('getPriorityColor', () => {
  it('returns correct color for low', () => {
    expect(getPriorityColor('low')).toContain('gray')
  })

  it('returns correct color for medium', () => {
    expect(getPriorityColor('medium')).toContain('yellow')
  })

  it('returns correct color for high', () => {
    expect(getPriorityColor('high')).toContain('red')
  })
})
