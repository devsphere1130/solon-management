const MOCK_DELAY = 600

// Stubbed until a real backend exists — swap the body for an api.post('/auth/login', ...) call.
export function login({ email }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email) {
        reject(new Error('Email is required.'))
        return
      }

      resolve({
        token: `mock-token-${Date.now()}`,
        user: {
          name: email.split('@')[0].replace(/[._-]/g, ' ') || 'Ananya',
          email,
        },
      })
    }, MOCK_DELAY)
  })
}

export function logout() {
  return Promise.resolve()
}
