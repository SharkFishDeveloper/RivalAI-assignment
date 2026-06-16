/**
 * @jest-environment jsdom
 */

import { api } from '@/lib/api'

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
  localStorage.clear()
})

describe('api.login', () => {
  it('sends POST to /login with correct body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'abc', user: { id: '1', email: 'a@b.com', name: 'A', role: 'user' } }),
    })

    const res = await api.login('a@b.com', 'pass123')
    expect(res.token).toBe('abc')
    expect(res.user.email).toBe('a@b.com')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/login'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'a@b.com', password: 'pass123' }),
      })
    )
  })

  it('throws on error response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'invalid email or password' }),
    })

    await expect(api.login('a@b.com', 'wrong')).rejects.toThrow('invalid email or password')
  })
})

describe('api.listTasks', () => {
  it('sends GET with query params', async () => {
    localStorage.setItem('token', 'test-token')
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tasks: [], meta: { page: 1, limit: 20, total: 0, total_pages: 0 } }),
    })

    await api.listTasks({ status: 'todo', page: 1 })

    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain('status=todo')
    expect(url).toContain('page=1')
  })

  it('sends Authorization header when token exists', async () => {
    localStorage.setItem('token', 'my-jwt')
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ tasks: [], meta: { page: 1, limit: 20, total: 0, total_pages: 0 } }),
    })

    await api.listTasks()

    const opts = mockFetch.mock.calls[0][1]
    expect(opts.headers['Authorization']).toBe('Bearer my-jwt')
  })
})
