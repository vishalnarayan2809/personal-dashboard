// Test utilities for the dashboard extension
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Chrome APIs for testing
const mockChrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn()
    }
  },
  runtime: {
    getManifest: vi.fn(() => ({ version: '2.0.0' }))
  }
};

// Make chrome available globally in tests
global.chrome = mockChrome;

// Mock fetch for API testing
global.fetch = vi.fn();

// DOM testing utilities
export class DOMTestUtils {
  static createMockElement(tag = 'div', attributes = {}) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  }

  static mockLocalStorage() {
    const store = {};
    return {
      getItem: vi.fn(key => store[key] || null),
      setItem: vi.fn((key, value) => store[key] = value),
      removeItem: vi.fn(key => delete store[key]),
      clear: vi.fn(() => Object.keys(store).forEach(key => delete store[key]))
    };
  }

  static setupDOM() {
    document.body.innerHTML = `
      <div class="background-container"></div>
      <div id="weather"></div>
      <div id="qoute"></div>
      <div id="facts"></div>
      <div id="author"></div>
      <div id="time"></div>
      <div id="greeting"></div>
    `;
  }
}

// API testing utilities
export class APITestUtils {
  static mockSuccessfulWeatherResponse() {
    return {
      weather: [{ main: 'Clear', description: 'clear sky' }],
      main: { temp: 72 },
      name: 'Test City'
    };
  }

  static mockFailedResponse() {
    return Promise.reject(new Error('API Error'));
  }

  static setupFetchMock(responses) {
    global.fetch.mockImplementation((url) => {
      const response = responses[url] || responses.default;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(response)
      });
    });
  }
}

export { mockChrome };
